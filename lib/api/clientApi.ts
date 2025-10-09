import axios, { AxiosInstance } from 'axios';
import type { CampersQuery, Paginated, Camper } from '@/types/types';

export const client: AxiosInstance = axios.create({
  baseURL: '/api',
});

export async function getCampers(params: CampersQuery): Promise<Paginated<Camper>> {
  const { data } = await client.get<Paginated<Camper>>('/campers', { params });
  return data;
}