import { status, t } from 'elysia';

const buildTraefikLabelsParams = t.Object({
  slug: t.String(),
  port: t.String(),
});
type buildTraefikLabelsParams = typeof buildTraefikLabelsParams.static;

export function buildTraefikLabels(params: buildTraefikLabelsParams) {
  const entrypoint = process.env.TRAEFIK_ENTRYPOINT;
  const tlDomain = process.env.DOMAIN;

  if (!entrypoint || !tlDomain)
    throw status(400, 'Traefik is not properly configured on the server');

  const certresolver = process.env.TRAEFIK_CERTRESOLVER;

  const service = `${params.slug}-svc`;
  const router = `${params.slug}-rtr`;
  const domain = `${params.slug}.${tlDomain}`;

  const traefikLabels: { [key: string]: string } = {};
  traefikLabels['traefik.enable'] = 'true';
  traefikLabels['traefik.http.routers.' + router + '.entrypoints'] = entrypoint;
  traefikLabels['traefik.http.routers.' + router + '.rule'] = `Host(\`${domain}\`)`;
  if (certresolver)
    traefikLabels['traefik.http.routers.' + router + '.tls.certresolver'] = certresolver;
  traefikLabels['traefik.http.routers.' + router + '.service'] = service;
  traefikLabels['traefik.http.services.' + service + '.loadBalancer.server.port'] = params.port;
  traefikLabels['qube.server.domain'] = domain;

  return traefikLabels;
}
