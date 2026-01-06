import { Container } from "dockerode";
import { Elysia } from "elysia";

import { ContainerModel } from "./model.ts";

export const container = new Elysia({ prefix: '/container' })
  .put(
    '/new',
    async ({ body }) => {

    }, {
    body: ContainerModel.createContainerBody,
    response: {
      200: ContainerModel.createResponse,
      400: ContainerModel.badRequestResponse,
      500: ContainerModel.errorResponse,
    }
  }
  )
