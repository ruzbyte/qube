import { treaty } from "@elysiajs/eden";
import type { App } from "api/src/index";

// Für Server Components (SSR) nutze den internen Docker-Namen, für Client den Public Namen
const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = treaty<App>(url);
