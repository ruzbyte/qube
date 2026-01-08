import { t } from 'elysia'

export namespace ScribblersModel {

  export const createBody = t.Object({
    name: t.String({ default: "Scribblers Server" }),
    startOnDeploy: t.Optional(t.Boolean({ default: false })),
    language: t.Optional(t.Union([
      t.Literal("de_DE"),
      t.Literal("en_US"),
      t.Literal("es_ES"),
    ])),
    rounds: t.Optional(t.String({ default: "5" })),
    public: t.Optional(t.Boolean({ default: true })),

  })
  export type createBody = typeof createBody.static

  export const response = t.String()
  export type response = typeof response.static

  export const responseId = t.Object({
    id: t.String()
  })
  export type responseId = typeof responseId.static
}
