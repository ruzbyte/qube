import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello from Elysia API")
  .get("/users", () => [{ id: 1, name: "Alice" }])
  .listen(8080);

export type App = typeof app;

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
