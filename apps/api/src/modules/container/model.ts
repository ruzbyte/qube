import { t } from 'elysia'
import { traefikLabelsBody } from '../../utils/traefik'

export namespace ContainerModel {

  export const containerInfo = t.Object({
    name: t.String(),
    containerName: t.String(),
    id: t.String(),
    image: t.String(),
    ports: t.Array(t.String()),
    domain: t.Nullable(t.String()),
    attachedNetworks: t.Array(t.String()),
    labels: t.Record(t.String(), t.String()),
    environment: t.Record(t.String(), t.String()),
    createdAt: t.String(),
    startedAt: t.String(),
    status: t.String(),
  })
  export type containerInfo = typeof containerInfo.static

  export const createContainerBody = t.Object({
    name: t.String(),
    image: t.String(),
    game: t.String(),
    persistentDataPath: t.String(),
    environment: t.Optional(t.Record(t.String(), t.String())),
    labels: t.Optional(t.Record(t.String(), t.String())),
    ports: t.Optional(t.Record(t.String(), t.String())),  // HostPort:ContainerPort
    traefik: t.Optional(traefikLabelsBody)
  })
  export type createContainerBody = typeof createContainerBody.static

  export const response = t.String()
  export type response = typeof response.static

  export const responseId = t.Object({
    id: t.String()
  })
  export type responseId = typeof responseId.static
}
