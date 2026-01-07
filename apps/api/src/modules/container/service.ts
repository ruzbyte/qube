import Docker from 'dockerode'
import type { ContainerCreateOptions } from 'dockerode';

import { ContainerModel } from './model';
import { randomId } from 'elysia/utils';
import { status } from 'elysia';
import { buildTraefikLabels } from '../../utils/traefik';

var docker = new Docker({ socketPath: '/var/run/docker.sock' });

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
      enviromentDict[parts[0]!] = parts[1] || ''
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
    let labels: { [key: string]: string } = {
      'qube.server': params.game,
      'qube.server.name': params.name,
      'qube.server.domain': `${randomContainerId}.example.com`,
    }



    labels = { ...labels, ...params.labels }
    const enviromentDict = params.environment || {}
    const env: string[] = []
    for (const k in enviromentDict) {
      env.push(`${k}=${enviromentDict[k]}`)
    }
    const portsDict = params.ports || {}
    const portBindings: { [key: string]: Array<{ HostPort: string }> } = {}
    for (const port in portsDict) {
      portBindings[`${portsDict[port]}/tcp`] = [{ HostPort: port }]
    }

    if (params.traefik && Object.keys(portsDict).length == 1) {
      const traefikLabels = buildTraefikLabels({
        slug: `server-${randomContainerId}`,
        port: `${Object.values(portsDict)[0]}`,
        ...params.traefik,
      })

      labels = { ...labels, ...traefikLabels }
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

    return this.getContainerInfo(container.id)

  }

  static async getContainer(containerId: string) {
    await this.verifyDockerConnection()
    console.info(`Getting container info for ID: ${containerId}`)
    return this.getContainerInfo(containerId)
  }

  static async startContainer(containerId: string) {
    await this.verifyDockerConnection()
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
    console.info(`Deleting container with ID: ${containerId}, force: ${force}`)
    const container = docker.getContainer(containerId)
    try {
      await container.remove({ force: force })
    } catch (err) {
      console.error(`Failed to delete container with ID: ${containerId}; ${err}`)
      throw status(404, `Failed to delete container with ID: ${containerId}; ${err}` satisfies ContainerModel.response)
    }
  }

  static async listContainers(all: boolean = true): Promise<ContainerModel.containerInfo[]> {
    await this.verifyDockerConnection()
    console.info(`Listing containers, all: ${all}`)
    const containers = await docker.listContainers({
      all,
      filters: {
        "label": ["qube.server"]
      }
    })
    const containerInfos = containers.map(
      async (c) => { return await this.getContainerInfo(c.Id) }
    )
    return await Promise.all(containerInfos);
  }
}
