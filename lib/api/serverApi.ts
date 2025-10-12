import type { Camper } from "@/types/types";
import { BASE, nextServer } from "./api";

export function upstreamUrl(path: string, search?: string): string {
  const url = new URL(path, BASE);
  if (search) url.search = search.startsWith("?") ? search : `?${search}`;
  return url.toString();
}

export async function getCamperByIdServer(id: string): Promise<Camper> {
  const { data } = await nextServer.get<Camper>(`/campers/${(id)}`);
  return data;
}
