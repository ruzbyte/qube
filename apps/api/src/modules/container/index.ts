import { Elysia, t } from "elysia";

import { ContainerModel } from "./model";
import { ContainerService } from "./service";

export const container = new Elysia({ prefix: '/container' })
  .post(
    '/new',
    async ({ body }) => {
      return ContainerService.createContainer(body)
    }, {
    body: ContainerModel.createContainerBody,
    response: {
      201: ContainerModel.containerInfo,
      400: ContainerModel.response,
      500: ContainerModel.response,
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
      404: ContainerModel.response,
      500: ContainerModel.response,
    }
  })
  .put(
    '/:id/start',
    ({ params }) => {
      return ContainerService.startContainer(params.id)

    }, {
    params: t.Object({
      id: t.String()
    }),
    response: {
      200: ContainerModel.containerInfo,
      404: ContainerModel.response,
      500: ContainerModel.response,
    }
  })
  .put(
    '/:id/stop',
    ({ params }) => {
      return ContainerService.stopContainer(params.id)

    }, {
    params: t.Object({
      id: t.String()
    }),
    response: {
      200: ContainerModel.containerInfo,
      404: ContainerModel.response,
      500: ContainerModel.response,
    }
  })
  .delete(
    '/:id',
    ({ params, query }) => {
      ContainerService.deleteContainer(params.id, query.force)
      return {
        id: params.id
      }
    }, {
    params: t.Object({
      id: t.String()
    }),
    query: t.Object({
      force: t.Optional(t.Boolean({ default: false }))
    }),
    response: {
      200: ContainerModel.responseId,
      404: ContainerModel.response,
      500: ContainerModel.response,
    }
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
      500: ContainerModel.response,
    }
  }
  )
