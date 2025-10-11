"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCampers } from "@/lib/api/clientApi";
import type {
  Camper,
  Engine,
  Form,
  Paginated,
  Transmission,
  EquipmentKey,
} from "@/types/types";

// ← тип запроса берём из функции, чтобы 1-в-1 совпадал с clientApi
type CamperQuery = Parameters<typeof getCampers>[0];

export function useCampersQuery(
  filtersApplied: {
    location: string;
    transmission: Transmission | null;
    engine: Engine | null;
    vehicleType: Form | null;
    filters: EquipmentKey[]; // ВАЖНО: EquipmentKey[], не string[]
  },
  page: number,
  setPage: (p: number) => void,
  limit: number
) {
  const queryParams: CamperQuery = useMemo(() => {
    const d = filtersApplied;
    return {
      page,
      limit,
      location: d.location || "",
      transmission: (d.transmission ?? "") as Transmission | "",
      engine: (d.engine ?? "") as Engine | "",
      vehicleType: (d.vehicleType ?? "") as Form | "",
      filters: d.filters.slice() as EquipmentKey[],
    };
  }, [filtersApplied, page, limit]);

  const { data, isLoading, isError, isFetching } = useQuery<Paginated<Camper>>({
    queryKey: ["campers", queryParams] as const,
    queryFn: () => getCampers(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  // аккумулирование
  const [acc, setAcc] = useState<Camper[]>([]);
  const initialFixApplied = useRef(false);

  // фикс "page > totalPages" строго >
  useEffect(() => {
    if (initialFixApplied.current) return;
    if (!data) return;
    const totalPages = data.pages ?? 1;
    if (page > totalPages) {
      initialFixApplied.current = true;
      setAcc([]);
      setPage(Math.max(1, totalPages));
    }
  }, [data, page, setPage]);

  useEffect(() => {
    if (!data?.items) return;
    setAcc((prev) => {
      if (page === 1) return data.items.slice();
      const ids = new Set(prev.map((c) => c.id));
      const toAppend = data.items.filter((c) => !ids.has(c.id));
      return [...prev, ...toAppend];
    });
  }, [data?.items, page]);

  const campers = acc.length ? acc : (data?.items ?? []);
  const canLoadMore = (data?.page ?? 1) < (data?.pages ?? 1);

  const loadMore = () => {
    if (!canLoadMore) return;
    setPage(page + 1);
  };

  return { data, isLoading, isError, isFetching, campers, canLoadMore, loadMore, resetAcc: () => setAcc([]) };
}
