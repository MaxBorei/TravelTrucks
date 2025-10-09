import axios, { AxiosInstance } from 'axios';

export const BASE =
  process.env.BASE_URL;

export const nextServer: AxiosInstance = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

export function upstreamUrl(path: string, search?: string): string {
  const url = new URL(path, BASE);
  if (search) url.search = search.startsWith('?') ? search : `?${search}`;
  return url.toString();
}
