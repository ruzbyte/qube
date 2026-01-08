"use server";

import { Featured, Modpack } from "@/types/modpack";
import { Curseforge } from "node-curseforge";

const baseUrl = "https://api.curseforge.com";

type ModpackDefinition = {
  name: string;
  id: number;
};

const supportedModpacks: ModpackDefinition[] = [
  {
    name: "All The Mods 9",
    id: 715572,
  },
  {
    name: "BetterMC - BMC4 Forge",
    id: 876781,
  },
];

const getHeaders = () => {
  const apiKey = process.env.CF_API_KEY || "";

  if (!apiKey) console.warn("Missing CF_API_KEY!");

  return {
    Accept: "application/json",
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };
};

export const getGames = async () => {
  const request = await fetch(`${baseUrl}/v1/games`, {
    headers: getHeaders(),
    method: "GET",
  });
};

export const getMods = async () => {
  const modpacks: Modpack[] = [];

  for (let mod in supportedModpacks) {
    const req = await fetch(baseUrl + "/v1/mods/" + supportedModpacks[mod].id, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = (await req.json()).data as Modpack;
    modpacks.push(data);
  }

  return modpacks;
};

export const getFeaturedModpacks = async (game: string = "minecraft") => {
  const curseforge = new Curseforge(process.env.CF_API_KEY || "");
  const game_obj = await curseforge.get_game(game);
  const req = await fetch(baseUrl + "/v1/mods/featured", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      gameId: game_obj.id,
      excludedModIds: [],
    }),
  });
  const result = await req.json();

  return result.data as Featured;
};

export const searchModpacks = async (
  query: string,
  game: string = "minecraft"
) => {
  const curseforge = new Curseforge(process.env.CF_API_KEY || "");
  const game_obj = await curseforge.get_game(game);
  let queryParams = {
    gameId: game_obj.id.toString(),
    searchFilter: query,
    sortOrder: "desc",
    sortField: "2",
  };
  const req = await fetch(
    baseUrl + "/v1/mods/search?" + new URLSearchParams(queryParams),
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  const result = await req.json();

  return result.data as Modpack[];
};

export const getModpackBySlug = async (
  slug: string,
  game: string = "minecraft"
) => {
  const curseforge = new Curseforge(process.env.CF_API_KEY || "");
  const game_obj = await curseforge.get_game(game);
  let queryParams = {
    gameId: game_obj.id.toString(),
    slug: slug,
  };
  const req = await fetch(
    baseUrl + "/v1/mods/search?" + new URLSearchParams(queryParams),
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  const result = await req.json();

  return result.data[0] as Modpack;
};

export const getModpack = async (modId: number) => {
  const req = await fetch(`${baseUrl}/v1/mods/${modId}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const result = await req.json();
  return result.data as Modpack;
};
