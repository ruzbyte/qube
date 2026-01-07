import type { ContainerCreateOptions } from "dockerode"
import type { ContainerModel } from "../../modules/container/model"
import { ContainerService, docker } from "../../modules/container/service"
import { status } from "elysia"

export class PortUtils {
  static async isPortAvailable(port: number): Promise<boolean> {
    const labels: ContainerModel.qubeLabels = {
      "qube.port.test": 'true'
    }
    const portBinding: { [key: string]: Array<{ HostPort: string }> } = {
      "1337/tcp": [{ HostPort: port.toString() }]
    }
    let containerConfig: ContainerCreateOptions = {
      name: `qube-server-port-test`,
      Image: 'busybox',
      Labels: labels,
      HostConfig: {
        PortBindings: portBinding
      }
    }

    const container = await docker.createContainer(containerConfig)
    let available = true
    try {
      container.start()
    } catch (err) {
      console.log(`Port ${port} is not available: ${err}`)
      available = false
    }
    await ContainerService.deleteContainer(container.id, true)
    return available
  }

  // Deine angefragte Methode
  static async getPortOrNextFree(startPort: string | number): Promise<number> {
    let port = typeof startPort === 'string' ? parseInt(startPort, 10) : startPort;

    const maxPort = 1000;
    while (port <= maxPort) {
      const available = await this.isPortAvailable(port);
      if (available) {
        return port;
      }
      port++;
    }
    throw status(500, `No free ports found in range ${port}-${port + maxPort}`);
  }
}

