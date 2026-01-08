import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { container } from "./modules/container";
import { minecraft } from "./modules/minecraft";
import { scribblers } from "./modules/scribbers";

export const app = new Elysia()
  .use(cors())
  .use(openapi())
  .use(container)
  .use(minecraft)
  .use(scribblers)
  .listen(8080);

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`API Docs available at http://localhost:8080/openapi`);
