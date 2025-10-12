import axios, { AxiosInstance } from "axios";


export const BASE = process.env.BASE_URL;


export const nextServer: AxiosInstance = axios.create({
  baseURL: BASE,
  timeout: 10000,
});


export const client: AxiosInstance = axios.create({
  baseURL: "/api",
});