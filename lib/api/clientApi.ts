import type {
  CampersQuery,
  Paginated,
  Camper,
  BookingRequest,
} from "@/types/types";
import { client } from "./api";

/** Список кемперів (клієнт → наш Next API) */
export async function getCampers(
  params: CampersQuery
): Promise<Paginated<Camper>> {
  const { data } = await client.get<Paginated<Camper>>("/campers", { params });
  return data;
}

/** Деталі кемпера (клієнт → наш Next API) */
export async function getCamperById(id: string): Promise<Camper> {
  const { data } = await client.get<Camper>(`/campers/${id}`);
  return data;
}

/** Бронювання (клієнт → наш Next API) */
export async function createBooking(
  payload: BookingRequest
): Promise<{ ok: boolean }> {
  const { data } = await client.post<{ ok: boolean }>("/bookings", payload);
  return data;
}
