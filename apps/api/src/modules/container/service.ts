import Docker from 'dockerode'
import type { ContainerCreateOptions } from 'dockerode';

import { ContainerModel } from './model';
import { randomId } from 'elysia/utils';

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

  static async pullImage(imageName: string) {
    const image = docker.getImage(imageName)
    try {
      await image.inspect()
    } catch {
      const stream = await docker.pull(imageName)
      await new Promise(resolve => docker.modem.followProgress(stream, resolve));
    }
  }

  static async getContainerInfo(id: string): Promise<ContainerModel.containerInfo> {
    const c = docker.getContainer(id)
    const cInfo = await c.inspect()
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

    const filteredLabels = Object.entries(cInfo.Config.Labels).filter(([key, _]) => key.startsWith('qube.')).reduce((obj, [key, value]) => { obj[key] = value; return obj }, {} as { [key: string]: string })

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
    console.log(containerInfo)
    return containerInfo
  }

  static async createContainer(params: ContainerModel.createContainerBody): Promise<ContainerModel.containerInfo> {
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

    await this.pullImage(params.image)

    const container = await docker.createContainer(containerConfig)
    await NetworkService.connectContainerToNetworks(container.id)

    return this.getContainerInfo(container.id)

  }

  static async getContainer(containerId: string) {
    const container = docker.getContainer(containerId)
    return this.getContainerInfo(container.id)
  }

  static async deleteContainer(containerId: string, force: boolean = false) {
    await docker.getContainer(containerId).remove({ force: force })
  }

  static async listContainers(all: boolean = true): Promise<ContainerModel.containerInfo[]> {
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
