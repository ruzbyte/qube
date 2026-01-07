import { Elysia, t } from "elysia";

import { ContainerModel } from "./model.ts";
import { ContainerService } from "./service.ts";

export const container = new Elysia({ prefix: '/container' })
  .post(
    '/new',
    async ({ body }) => {
      return ContainerService.createContainer(body)
    }, {
    body: ContainerModel.createContainerBody,
    response: {
      200: ContainerModel.containerInfo,
      400: ContainerModel.badRequestResponse,
      500: ContainerModel.errorResponse,
    }
  })
  .get(
    '/:id',
    ({ params }) => {
      return ContainerService.getContainer(params.id)
    }, {
    params: t.Object({
      id: t.String()
    }),
    response: {
      200: ContainerModel.containerInfo,
      404: ContainerModel.notFoundResponse,
    }
  }
  )
  .delete(
    '/:id',
    ({ params, query }) => {

      ContainerService.deleteContainer(params.id, query.force)

    }, {
    params: t.Object({
      id: t.String()
    }),
    query: t.Object({
      force: t.Boolean({ default: false })
    })
  },
  )
  .get(
    '/list',
    ({ query }) => {
      return ContainerService.listContainers(query.all)
    }, {
    query: t.Object({
      all: t.Boolean({ default: true })
    }),
    response: {
      200: t.Array(ContainerModel.containerInfo),
      500: ContainerModel.errorResponse,
    }
  }
  )
