import type { ContainerModel } from "../container/model";
import type { ScribblersModel } from "./model";

export class ScribblersService {
  static async buildScribblersParams(config: ScribblersModel.createBody): Promise<ContainerModel.createContainerBody> {
    const gamePort = "8080/tcp"

    const env: Record<string, string> = {
      "LANGUAGE": config.language || "de_DE",
      "PUBLIC": config.public?.toString() || "true",
      "ROUNDS": config.rounds || "5",
    }

    const dict: ContainerModel.createContainerBody = {
      game: "scribblers",
      image: "biosmarcel/scribble.rs",
      name: config.name,
      environment: env,
      startOnDeploy: config.startOnDeploy || false,
      traefikPort: gamePort
    }
    return dict
  }
}
