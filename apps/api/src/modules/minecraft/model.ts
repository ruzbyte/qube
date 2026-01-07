import { t } from 'elysia'

export namespace MinecraftModel {

  export const createBody = t.Object({
    name: t.String(),
    timezone: t.String({ default: 'UTC' }),
    maxMemory: t.String(),
    type: t.Union([
      t.Literal("VANILLA"),
      // t.Literal("BEDROCK"),
      t.Literal("AUTOCURSEFORGE"),
      // t.Literal("FABRIC"),
      // t.Literal("NEOFORGE"),
    ]),
    motd: t.Optional(t.String()),
    difficulty: t.Optional(t.Union([
      t.Literal("peaceful"),
      t.Literal("easy"),
      t.Literal("normal"),
      t.Literal("hard"),
    ])),
    version: t.Optional(t.String()),
    maxPlayers: t.Optional(t.String({ default: '20' })),
    onlineMode: t.Optional(t.Union([t.Literal("true"), t.Literal("false")])),
    whitelist: t.Optional(t.String()),
    seed: t.Optional(t.String()),
    port: t.Optional(t.String()),
    cfSlug: t.Optional(t.String()),
  })
  export type createBody = typeof createBody.static

  export const response = t.String()
  export type response = typeof response.static

  export const responseId = t.Object({
    id: t.String()
  })
  export type responseId = typeof responseId.static
}
