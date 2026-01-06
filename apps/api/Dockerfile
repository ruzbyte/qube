FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lockb ./
COPY apps/api/package.json ./apps/api/package.json

RUN bun install --frozen-lockfile

FROM base AS release
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY --from=install /usr/src/app/bun.lockb ./bun.lockb
COPY --from=install /usr/src/app/package.json ./package.json

COPY apps/api ./apps/api

WORKDIR /usr/src/app/apps/api
ENV NODE_ENV=production

EXPOSE 8080
CMD ["bun", "src/index.ts"]
