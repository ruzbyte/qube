import { Elysia } from "elysia";
import { ContainerService } from "../container/service";
import { ContainerModel } from "../container/model";
import { ScribblersModel } from "./model";
import { ScribblersService } from "./service";

export const scribblers = new Elysia({ prefix: '/scribblers' })
  .post(
    '/new',
    async ({ body }) => {
      const containerParams = await ScribblersService.buildScribblersParams(body)
      return ContainerService.createContainer(containerParams)
    }, {
    body: ScribblersModel.createBody,
    response: {
      201: ContainerModel.containerInfo,
      400: ScribblersModel.response,
      500: ScribblersModel.response,
    }
  })
