import { t } from 'elysia'

export namespace MinecraftModel {

  export const createBody = t.Object({
    name: t.String({ default: "Minecraft Server" }),
    startAfterCreation: t.Optional(t.Boolean({ default: false })),
    timezone: t.String({ default: 'Europe/Berlin' }),
    maxMemory: t.String({ default: '4G' }),
    type: t.Union([
      t.Literal("VANILLA"),
      // t.Literal("BEDROCK"),
      t.Literal("AUTOCURSEFORGE"),
      // t.Literal("FABRIC"),
      // t.Literal("NEOFORGE"),
    ], { default: "VANILLA" }),
    motd: t.Optional(t.String({ default: "Minecraft Server deployes by QUBE" })),
    difficulty: t.Optional(t.Union([
      t.Literal("peaceful"),
      t.Literal("easy"),
      t.Literal("normal"),
      t.Literal("hard"),
    ], { default: "normal" })),
    version: t.Optional(t.String({ default: "latest" })),
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
