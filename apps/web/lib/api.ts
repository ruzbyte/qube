"use server";

import { RequestType } from "@/types/contaier";
import { treaty } from "@elysiajs/eden";
import { app } from "api/src/index";

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const containerApi = treaty<typeof app>(url).container;
export const minecraftApi = treaty<typeof app>(url).minecraft;

// For client components
export const createMinecraftServer = async (requestBody: RequestType) => {
  const result = await minecraftApi.new.post(requestBody);
  return { data: result.data, error: result.error };
};

export const getContainerLogs = async (id: string) => {
  const result = await containerApi({ id }).logs.get({
    query: { type: "stdout", tail: 100 },
  });
  console.log(result);
  return { data: result.data, error: result.error };
};

export const startContainer = async (id: string) => {
  const result = await containerApi({ id }).start.put();
  return { data: result.data, error: result.error };
};

export const stopContainer = async (id: string, force: boolean = false) => {
  const result = await containerApi({ id }).stop.put({ force: force });
  return { data: result.data, error: result.error };
};

export const deleteContainer = async (id: string, force: boolean = false) => {
  const result = await containerApi({ id }).delete({ force: force });
  return { data: result.data, error: result.error };
};

export const restartContainer = async (id: string) => {
  const result = await containerApi({ id }).restart.put();
  return { data: result.data, error: result.error };
};
