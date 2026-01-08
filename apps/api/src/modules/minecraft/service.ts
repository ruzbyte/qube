import { status } from "elysia";
import type { ContainerModel } from "../container/model";
import type { MinecraftModel } from "./model";
import { PortUtils } from "../../utils/ports";

export class MinecraftService {

  static async buildMinecraftParams(config: MinecraftModel.createBody): Promise<ContainerModel.createContainerBody> {
    if (config.type === "BEDROCK") return this.buildMinecraftBedrockParams(config)

    const gamePort = "25565/tcp"

    const ports: Record<string, string> = {}
    if (config.port) {
      ports[config.port] = gamePort
    } else {
      const nextFreePort = await PortUtils.getPortOrNextFree(gamePort)
      ports[nextFreePort] = gamePort
    }
    const env: Record<string, string> = {
      "EULA": "TRUE",
      "MEMORY": config.maxMemory,
      "TZ": config.timezone,
      "TYPE": config.type,
      "MOTD": config.motd || "Minecraft Server deployes by QUBE",
      "DIFFICULTY": config.difficulty || "normal",
      "SERVER_NAME": config.name,
      "ONLINE_MODE": config.onlineMode || 'false'
    }
    if (config.seed) env["SEED"] = config.seed
    if (config.maxPlayers) env["MAX_PLAYERS"] = config.maxPlayers
    if (config.whitelist) {
      env["ENABLE_WHITELIST"] = "true"
      env["WHITELIST"] = config.whitelist
    }

    switch (config.type) {
      case "VANILLA":
        if (config.version) env["VERSION"] = config.version
        break
      case "AUTOCURSEFORGE":
        if (!config.cfSlug) {
          throw status(400, "CurseForge modpack slug missing, but type is set to AUTOCURSEFORGE")
        }
        const cf_api_key = process.env.CF_API_KEY
        if (!cf_api_key) {
          throw status(500, "CurseForge API key is not set on the server")
        }
        env["CF_API_KEY"] = cf_api_key
        env["CF_SLUG"] = config.cfSlug
        break
    }

    const dict: ContainerModel.createContainerBody = {
      game: "minecraft",
      image: "itzg/minecraft-server",
      name: config.name,
      persistentDataPath: "/data",
      ports: ports,
      environment: env,
      startOnDeploy: config.startOnDeploy || false,
    }

    return dict

  }

  static async buildMinecraftBedrockParams(config: MinecraftModel.createBody): Promise<ContainerModel.createContainerBody> {
    const gamePort = "19132/udp"

    const ports: Record<string, string> = {}
    if (config.port) {
      ports[config.port] = gamePort
    } else {
      const nextFreePort = await PortUtils.getPortOrNextFree(gamePort)
      ports[nextFreePort] = gamePort
    }

    const env: Record<string, string> = {
      "EULA": "TRUE",
      "TZ": config.timezone,
      "SERVER_NAME": config.name,
      "MOTD": config.motd || "Minecraft Bedrock Server deployed by QUBE",
      "DIFFICULTY": config.difficulty || "normal",
      "VERSION": config.version || "LATEST",
      "ONLINE_MODE": config.onlineMode || 'true'
    }

    if (config.seed) env["LEVEL_SEED"] = config.seed
    if (config.maxPlayers) env["MAX_PLAYERS"] = config.maxPlayers

    if (config.whitelist) {
      env["ALLOW_LIST"] = "true"
      env["ALLOW_LIST_USERS"] = config.whitelist
    }

    const dict: ContainerModel.createContainerBody = {
      game: "minecraft",
      image: "itzg/minecraft-bedrock-server",
      name: config.name,
      persistentDataPath: "/data",
      ports: ports,
      environment: env,
      startOnDeploy: config.startOnDeploy || false,
    }

    return dict
  }

}
