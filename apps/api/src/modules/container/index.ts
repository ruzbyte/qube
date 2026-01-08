import { Elysia, t } from "elysia";

import { ContainerModel } from "./model";
import { ContainerService } from "./service";

export const container = new Elysia({ prefix: "/container" })
  .post(
    "/new",
    async ({ body }) => {
      return ContainerService.createContainer(body);
    },
    {
      body: ContainerModel.createContainerBody,
      response: {
        201: ContainerModel.containerInfo,
        400: ContainerModel.response,
        500: ContainerModel.response,
      },
    }
  )
  .get(
    "/:id",
    ({ params }) => {
      return ContainerService.getContainer(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: ContainerModel.containerInfo,
        404: ContainerModel.response,
        500: ContainerModel.response,
      },
    }
  )
  .put(
    "/:id/start",
    ({ params }) => {
      return ContainerService.startContainer(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: ContainerModel.containerInfo,
        404: ContainerModel.response,
        500: ContainerModel.response,
      },
    }
  )
  .put(
    "/:id/restart",
    ({ params }) => {
      return ContainerService.restartContainer(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: ContainerModel.containerInfo,
        404: ContainerModel.response,
        500: ContainerModel.response,
      },
    }
  )
  .put(
    "/:id/stop",
    ({ params, query }) => {
      return ContainerService.stopContainer(params.id, query.force);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        force: t.Optional(t.Boolean({ default: false })),
      }),
      response: {
        200: ContainerModel.containerInfo,
        404: ContainerModel.response,
        500: ContainerModel.response,
      },
    }
  )
  .delete(
    "/:id",
    ({ params, query }) => {
      ContainerService.deleteContainer(params.id, query.force);
      return {
        id: params.id,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        force: t.Optional(t.Boolean({ default: false })),
      }),
      response: {
        200: ContainerModel.responseId,
        404: ContainerModel.response,
        500: ContainerModel.response,
      },
    }
  ).get(
    "/:id/logs",
    ({ params, query }) => {
      const logOptions = {
        stdout: { stdout: true, stderr: false },
        stderr: { stdout: false, stderr: true },
        both: { stdout: true, stderr: true }
      };

      // Fallback auf 'stdout', falls query.type leer oder unbekannt ist
      const { stdout, stderr } = logOptions[query.type || "stdout"];
      return ContainerService.getLogs(params.id, stdout, stderr, query.tail);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        type: t.Optional(t.Union([t.Literal("stdout"), t.Literal("stderr"), t.Literal("both")], { default: "stdout" })),
        tail: t.Optional(t.Number({ default: 50 })),
      }),
      response: {
        200: ContainerModel.responseLogs,
        404: ContainerModel.response,
        500: ContainerModel.response,
      },
    }
  ).post(
    "/:id/exec",
    ({ body, params }) => {
      return ContainerService.execInContainer(params.id, body.cmd)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        cmd: t.Array(t.String()),
      }),
      response: {
        200: ContainerModel.responseExec,
        404: ContainerModel.response,
        500: ContainerModel.response,
      },
    }
  ).get(
    "/list",
    ({ query }) => {
      return ContainerService.listContainers(query.game);
    },
    {
      query: t.Object({
        game: t.Optional(ContainerModel.supportedGames),

      }),
      response: {
        200: t.Array(ContainerModel.containerInfo),
        500: ContainerModel.response,
      },
    }
  );
