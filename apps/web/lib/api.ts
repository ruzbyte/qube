import { treaty } from "@elysiajs/eden";
import { app } from "api/src/index";

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const containerApi = treaty<typeof app>(url).container;
export const minecraftApi = treaty<typeof app>(url).minecraft;
