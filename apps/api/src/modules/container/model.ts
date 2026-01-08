import { t } from 'elysia'

export namespace ContainerModel {

  export const supportedGames = t.Union([
    t.Literal("minecraft")
  ])
  export type supportedGames = typeof supportedGames.static

  export const qubeLabels = t.Partial(t.Record(
    t.Union([
      t.Literal("qube.server"),
      t.Literal("qube.server.game"),
      t.Literal("qube.server.name"),
      t.Literal("qube.server.domain"),
      t.Literal("qube.port.test"),
    ]), t.String()
  ))
  export type qubeLabels = typeof qubeLabels.static

  export const secretEnvVars = [
    "CF_API_KEY",
    "UID",
    "GID",
    "EULA",
  ]

  export const containerInfo = t.Object({
    name: t.String(),
    containerName: t.String(),
    id: t.String(),
    image: t.String(),
    ports: t.Array(t.String()),
    domain: t.Nullable(t.String()),
    attachedNetworks: t.Array(t.String()),
    labels: qubeLabels,
    environment: t.Record(t.String(), t.String()),
    createdAt: t.String(),
    startedAt: t.String(),
    status: t.String(),
  })
  export type containerInfo = typeof containerInfo.static

  export const createContainerBody = t.Object({
    name: t.String(),
    image: t.String(),
    game: supportedGames,
    persistentDataPath: t.String(),
    environment: t.Optional(t.Record(t.String(), t.String())),
    labels: t.Optional(t.Record(t.String(), t.String())),
    ports: t.Optional(t.Record(t.String(), t.String())),  // HostPort:ContainerPort
    traefikPort: t.Optional(t.String()),
    startOnDeploy: t.Optional(t.Boolean({ default: false }))
  })
  export type createContainerBody = typeof createContainerBody.static

  export const response = t.String()
  export type response = typeof response.static

  export const responseExec = t.Object({
    output: t.String()
  })
  export type responseExec = typeof responseExec.static

  export const responseLogs = t.Object({
    logs: t.String()
  })
  export type responseLogs = typeof responseLogs.static

  export const responseId = t.Object({
    id: t.String()
  })
  export type responseId = typeof responseId.static
}
