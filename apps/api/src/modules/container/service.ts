import Docker from 'dockerode'
import type { ContainerCreateOptions } from 'dockerode';
var docker = new Docker({ socketPath: '/var/run/docker.sock' });

function createContainer() {

  let containerConfig: ContainerCreateOptions = {
    Image: "itzg/minecraft-server",
    Env: [
      "MY_ENV_VAR=my_value"
    ],
    Labels: {
      'traefik.enable': 'true',
    },
    HostConfig: {
      Binds: [
        "/app/server/id:/data"
      ],
      PortBindings: {
        "25565/tcp": [
          {
            HostPort: "25565"
          }
        ]
      }
    },
  }
}
