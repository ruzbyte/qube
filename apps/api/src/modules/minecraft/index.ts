import { Elysia, t } from "elysia";
import { ContainerService } from "../container/service";
import { ContainerModel } from "../container/model";
import { MinecraftModel } from "./model";
import { MinecraftService } from "./service";

export const minecraft = new Elysia({ prefix: '/minecraft' })
  .post(
    '/new',
    async ({ body }) => {
      const containerParams = MinecraftService.buildMinecraftParams(body)
      return ContainerService.createContainer(containerParams)
    }, {
    body: MinecraftModel.createBody,
    response: {
      201: ContainerModel.containerInfo,
      400: MinecraftModel.response,
      500: MinecraftModel.response,
    }
  })
  .get(
    '/list',
    ({ query }) => {
      return ContainerService.listContainers(query.all, "minecraft")
    }, {
    query: t.Object({
      all: t.Boolean({ default: true })
    }),
    response: {
      200: t.Array(ContainerModel.containerInfo),
      500: MinecraftModel.response,
    }
  }
  )
