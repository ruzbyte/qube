FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json

RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

WORKDIR /usr/src/app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /usr/src/app/apps/web/public ./apps/web/public
COPY --from=builder /usr/src/app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /usr/src/app/apps/web/.next/standalone ./

EXPOSE 3000
CMD ["bun", "apps/web/server.js"]
