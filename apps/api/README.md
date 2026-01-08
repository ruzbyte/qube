# api

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## ENV VARS

```
- TRAEFIK_ENABLED: true|false
- TRAEFIK_ENTRYPOINT: NAME_OF_ENTRYPOINT
- TRAEFIK_CERTRESOLVER: NAME_OF_ENTRYPOINT (optional)
- DOMAIN: DOMAIN_OF_QUBE
- CF_API_KEY: CurseForge
- NETWORK_NAME: The network to connect game servers (optional)
```
