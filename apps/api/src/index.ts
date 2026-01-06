import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { container } from "./modules/container/index.ts";

const app = new Elysia().use(cors()).use(openapi()).use(container).listen(8080);
export type App = typeof app;

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
