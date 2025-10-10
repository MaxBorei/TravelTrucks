import axios, { AxiosInstance } from "axios";

/** Абсолютна база до апстріму (mockapi / твій бекенд) */
export const BASE = process.env.BASE_URL;

/** Серверний інстанс: використовується лише з app/api/... route handlers */
export const nextServer: AxiosInstance = axios.create({
  baseURL: BASE,
  timeout: 10000,
});

/** Клієнтський інстанс: з браузера ходимо у внутрішні Next API */
export const client: AxiosInstance = axios.create({
  baseURL: "/api",
});