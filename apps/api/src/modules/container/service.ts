import Docker from 'dockerode'
import type { ContainerCreateOptions } from 'dockerode';

import { ContainerModel } from './model';
import { randomId } from 'elysia/utils';
import { status } from 'elysia';
import { buildTraefikLabels } from '../../utils/traefik';

export const docker = new Docker({ socketPath: '/var/run/docker.sock' });


class NetworkService {
  static async getNetworks() {
    const networks = await docker.listNetworks({
      filters: {
        "label": ['qube.network=servers']
      }
    })
    return networks.map(n => n.Id)
  }

  static async createNetwork() {
    const network = await docker.createNetwork({
      Name: "qube-server-network",
      Labels: {
        "qube.network": "servers"
      }
    })
    return network.id
  }

  static async ensureNetwork() {
    const networks = await this.getNetworks()
    if (networks.length == 0) {
      networks.push(await this.createNetwork())
    }
    return networks
  }

  static async connectContainerToNetworks(containerId: string) {
    const networks = await this.ensureNetwork()
    for (const n in networks) {
      const network = docker.getNetwork(networks[n]!)
      await network.connect({
        Container: containerId
      })
    }
  }
}

export class ContainerService {

  static async verifyDockerConnection() {
    try {
      const data = await docker.ping()
      console.log('Docker daemon is reachable.', data);
    } catch (err) {
      console.error('Docker daemon is not reachable:', err);
      throw status(500, `Docker daemon is not reachable {${err}}` satisfies ContainerModel.response)
    }
  }

  private static async pullImage(imageName: string) {
    console.log(`Try to find image: ${imageName}`)
    const image = docker.getImage(imageName)
    try {
      await image.inspect()
      return
    } catch {
      console.log(`Image not found locally. Pulling image: ${imageName}`)
    }

    try {
      const stream = await docker.pull(imageName)
      await new Promise(resolve => docker.modem.followProgress(stream, resolve));
    } catch (err) {
      console.error(`Failed to pull image: ${imageName}; ${err}`)
      throw status(404, `Failed to pull image: ${imageName}; ${err}` satisfies ContainerModel.response)
    }
  }

  private static async ensureContainerIsManaged(containerId: string) {
    const container = docker.getContainer(containerId)
    let cInfo: Docker.ContainerInspectInfo
    try {
      cInfo = await container.inspect()
    } catch {
      // Preserve existing behavior: treat non-existent containers as "not managed"
      throw status(404, `Container with ID ${containerId} not found.` satisfies ContainerModel.response)
    }
    const labels = cInfo.Config && cInfo.Config.Labels ? cInfo.Config.Labels : {}
    if (!labels['qube.server']) {
      throw status(403, `Container with ID ${containerId} is not managed by Qube.` satisfies ContainerModel.response)
    }
  }

  private static async getContainerInfo(id: string): Promise<ContainerModel.containerInfo> {
    const c = docker.getContainer(id)
    let cInfo = null
    try {
      cInfo = await c.inspect()
    } catch (err) {
      console.error(`Container with ID ${id} not found.`)
      throw status(404, `Container with ID ${id} not found.` satisfies ContainerModel.response)
    }
    const image = docker.getImage(cInfo.Image)
    const imageInfo = await image.inspect()

    const portBindings = cInfo.HostConfig.PortBindings;
    const hostPorts: string[] = []
    for (const portBinding in portBindings) {
      hostPorts.push(...portBindings[portBinding]!.map((pb: { HostPort: string }) => pb.HostPort))
    }

    const attachedNetworks: string[] = []
    const networkSettings = cInfo.NetworkSettings.Networks;
    for (const network in networkSettings) {
      attachedNetworks.push(network)
    }

    const enviromentDict: { [key: string]: string } = {}
    for (const envVar of cInfo.Config.Env) {
      const parts = envVar.split('=')
      if (parts.length != 2) {
        console.warn(`Skipping malformed environment variable: ${envVar}`)
        continue
      }
      if (ContainerModel.secretEnvVars.includes(parts[0]!)) {
        console.debug(`Skipping secret environment variable: ${parts[0]}`)
      }
      enviromentDict[parts[0]!] = parts[1]!
    }

    const filteredLabels = Object.entries(cInfo.Config.Labels)
      .filter(([key, _]) => key.startsWith('qube.'))
      .reduce(
        (obj, [key, value]) => { obj[key] = value; return obj },
        {} as { [key: string]: string })

    const containerInfo: ContainerModel.containerInfo = {
      name: cInfo.Config.Labels['qube.server.name'] || cInfo.Name,
      containerName: cInfo.Name.replace('/', ''),
      image: imageInfo.RepoTags ? imageInfo.RepoTags[0]! : cInfo.Image,
      id,
      ports: hostPorts,
      domain: cInfo.Config.Labels['qube.server.domain'] || null,
      attachedNetworks,
      labels: filteredLabels,
      environment: enviromentDict,
      createdAt: cInfo.Created,
      startedAt: cInfo.State.StartedAt,
      status: cInfo.State.Status,
    }
    return containerInfo
  }

  static async createContainer(params: ContainerModel.createContainerBody): Promise<ContainerModel.containerInfo> {
    await this.verifyDockerConnection()
    const randomContainerId = randomId()
    let labels: ContainerModel.qubeLabels = {
      'qube.server': 'true',
      'qube.server.game': params.game,
      'qube.server.name': params.name,
    }
    const domainLabel = process.env.DOMAIN || null
    if (domainLabel) labels["qube.server.domain"] = domainLabel

    labels = { ...labels, ...params.labels }
    const enviromentDict = params.environment || {}
    const env: string[] = []
    for (const k in enviromentDict) {
      env.push(`${k}=${enviromentDict[k]}`)
    }
    const portsDict = params.ports || {}
    const portBindings: { [key: string]: Array<{ HostPort: string }> } = {}
    for (const port in portsDict) {
      // ggf port/tcp or port/udp
      portBindings[`${portsDict[port]}`] = [{ HostPort: port }]
    }


    if (process.env.TRAEFIK_ENABLED === "true") {
      if (Object.keys(portsDict).length != 1) {
        console.log("Not possible to enable traefik with multiple or no ports")
      }
      if (params.traefikPort) {
        const traefikLabels = buildTraefikLabels({
          slug: `${params.game}-${randomContainerId.slice(0, 4)}`,
          port: params.traefikPort,
        })
        labels = { ...labels, ...traefikLabels }
      } else {
        console.log("Not possible to enable traefik without a defined game port or single port mapping")
      }
    }

    let containerConfig: ContainerCreateOptions = {
      name: `qube-server-${randomContainerId}`,
      Image: params.image,
      Env: env,
      Labels: labels,
      HostConfig: {
        Binds: [
          `/app/server/${randomContainerId}:${params.persistentDataPath}`
        ],
        PortBindings: portBindings,
      },
    }

    console.info(`Creating container with config: ${JSON.stringify(containerConfig, null, 2)}`)
    await this.pullImage(params.image)

    const container = await docker.createContainer(containerConfig)
    await NetworkService.connectContainerToNetworks(container.id)

    if (params.startAfterCreation) return await this.startContainer(container.id)

    return this.getContainerInfo(container.id)

  }

  static async getContainer(containerId: string) {
    await this.verifyDockerConnection()
    await this.ensureContainerIsManaged(containerId)
    console.info(`Getting container info for ID: ${containerId}`)
    return this.getContainerInfo(containerId)
  }

  static async startContainer(containerId: string) {
    await this.verifyDockerConnection()
    await this.ensureContainerIsManaged(containerId)
    console.info(`Starting container with ID: ${containerId}`)
    const container = docker.getContainer(containerId)
    try {
      await container.start()
    } catch (err) {
      console.error(`Failed to start container with ID: ${containerId}; ${err}`)
      throw status(404, `Failed to start container with ID: ${containerId}; ${err}` satisfies ContainerModel.response)
    }
    return this.getContainerInfo(container.id)
  }

  static async stopContainer(containerId: string) {
    await this.verifyDockerConnection()
    await this.ensureContainerIsManaged(containerId)
    console.info(`Stopping container with ID: ${containerId}`)
    const container = docker.getContainer(containerId)
    try {
      await container.stop()
    } catch (err) {
      console.error(`Failed to stop container with ID: ${containerId}; ${err}`)
      throw status(404, `Failed to stop container with ID: ${containerId}; ${err}` satisfies ContainerModel.response)
    }
    return this.getContainerInfo(container.id)
  }

  static async deleteContainer(containerId: string, force: boolean = false) {
    await this.verifyDockerConnection()
    await this.ensureContainerIsManaged(containerId)
    console.info(`Deleting container with ID: ${containerId}, force: ${force}`)
    const container = docker.getContainer(containerId)
    try {
      await container.remove({ force: force })
    } catch (err) {
      console.error(`Failed to delete container with ID: ${containerId}; ${err}`)
      throw status(404, `Failed to delete container with ID: ${containerId}; ${err}` satisfies ContainerModel.response)
    }
  }

  static async listContainers(all: boolean = true, game: ContainerModel.supportedGames | undefined = undefined): Promise<ContainerModel.containerInfo[]> {
    await this.verifyDockerConnection()
    console.info(`Listing containers, all: ${all}`)
    const label = game ? ["qube.server.game=" + game] : ["qube.server"]
    const containers = await docker.listContainers({
      all,
      filters: {
        "label": label
      }
    })
    const containerInfos = containers.map(
      async (c) => { return await this.getContainerInfo(c.Id) }
    )
    return await Promise.all(containerInfos);
  }

  static async getLogs(
    containerId: string,
    stdout: boolean = true,
    stderr: boolean = false,
    tail: number = 50
  ) {
    await this.verifyDockerConnection()
    await this.ensureContainerIsManaged(containerId)
    console.info(`Getting logs for container with ID: ${containerId}, stdout: ${stdout}, stderr: ${stderr}, tail: ${tail}`)
    const container = docker.getContainer(containerId)
    try {
      const logStream = await container.logs({ tail, stdout, stderr })
      const str = logStream.toString('utf-8')
      return { logs: str }
    } catch (err) {
      console.error(`Failed to get logs for container with ID: ${containerId}; ${err}`)
      throw status(404, `Failed to get logs for container with ID: ${containerId}; ${err}` satisfies ContainerModel.response)
    }
  }

  static async execInContainer(containerId: string, dockerCmd: string[]) {
    await this.verifyDockerConnection()
    await this.ensureContainerIsManaged(containerId)
    console.info(`Executing command in container with ID: ${containerId}, cmd: ${dockerCmd.join(' ')}`)
    const container = docker.getContainer(containerId)
    try {
      const execInstance = await container.exec({
        Cmd: dockerCmd,
        AttachStdout: true,
        AttachStderr: true,
      })
      const outputStream = await execInstance.start({
        Detach: false
      })
      const output = await outputStream.toArray()
      const outputStr = output.map(o => o.toString('utf-8')).join('')
      console.debug(outputStr)
      return { output: outputStr }
    } catch (err) {
      console.error("Failed to exec command in container:", err)
      throw status(404, `Failed to exec command in container with ID: ${containerId}; ${err}` satisfies ContainerModel.response)
    }
  }
}
