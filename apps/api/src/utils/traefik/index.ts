import { t } from 'elysia'

export const traefikLabelsBody = t.Object({
  entrypoint: t.String(),
  domain: t.String(),
  certresolver: t.Optional(t.String()),
})
export type traefikLabelsBody = typeof traefikLabelsBody.static

const buildTraefikLabelsParams = t.Object({
  slug: t.String(),
  port: t.String(),
  ...traefikLabelsBody.properties
})
type buildTraefikLabelsParams = typeof buildTraefikLabelsParams.static

export function buildTraefikLabels(params: buildTraefikLabelsParams) {
  const service = `${params.slug}-svc`
  const router = `${params.slug}-rtr`
  const domain = `${params.slug}.${params.domain}`

  const traefikLabels: { [key: string]: string } = {}
  traefikLabels["traefik.enable"] = "true"
  traefikLabels["traefik.http.routers." + router + ".entrypoints"] = params.entrypoint
  traefikLabels["traefik.http.routers." + router + ".rule"] = `Host(\`${domain}\`)`
  if (params.certresolver) traefikLabels["traefik.http.routers." + router + ".tls.certresolver"] = params.certresolver
  traefikLabels["traefik.http.routers." + router + ".service"] = service
  traefikLabels["traefik.http.services." + service + ".loadBalancer.server.port"] = params.port

  return traefikLabels
}
