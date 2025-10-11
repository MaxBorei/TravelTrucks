"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useNoteStore } from "@/lib/stores/noteStore";
import type { EquipmentKey, Transmission, Engine, Form } from "@/types/types";

/** type guards */
const isTransmission = (v: string): v is Transmission =>
  v === "automatic" || v === "manual";

const isEngine = (v: string): v is Engine =>
  v === "diesel" || v === "petrol" || v === "hybrid";

const isForm = (v: string): v is Form =>
  v === "panelTruck" || v === "fullyIntegrated" || v === "alcove";

const isEquipment = (v: string): v is EquipmentKey =>
  [
    "AC",
    "bathroom",
    "kitchen",
    "TV",
    "refrigerator",
    "microwave",
    "gas",
    "water",
  ].includes(v as EquipmentKey); 

function draftToSearchParams(
  d: {
    location: string;
    transmission: Transmission | null;
    engine: Engine | null;
    vehicleType: Form | null;
    filters: EquipmentKey[];
  },
  page: number,
  limit: number
) {
  const sp = new URLSearchParams();
  if (page > 1) sp.set("page", String(page));
  if (limit !== 4) sp.set("limit", String(limit));
  if (d.location) sp.set("location", d.location);
  if (d.transmission) sp.set("transmission", d.transmission);
  if (d.engine) sp.set("engine", d.engine);
  if (d.vehicleType) sp.set("vehicleType", d.vehicleType);
  if (d.filters.length) sp.set("filters", d.filters.join(","));
  return sp;
}

/** Синхронизация фильтров каталога с URL: гидратация из URL/applied и live-update */
export function useCatalogFiltersSync(limit: number, page: number) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // store selectors
  const filtersDraft = useNoteStore((s) => s.filtersDraft);
  const setLocation = useNoteStore((s) => s.setLocation);
  const toggleEquipment = useNoteStore((s) => s.toggleEquipment);
  const setTransmission = useNoteStore((s) => s.setTransmission);
  const setEngine = useNoteStore((s) => s.setEngine);
  const setVehicleType = useNoteStore((s) => s.setVehicleType);

  /* ---- Инициализация из URL ---- */
  useEffect(() => {
    const loc = (searchParams.get("location") ?? "").trim();
    if (loc) setLocation(loc);

    const t = searchParams.get("transmission") ?? "";
    if (t && isTransmission(t)) setTransmission(t);

    const e = searchParams.get("engine") ?? "";
    if (e && isEngine(e)) setEngine(e);

    const vt = searchParams.get("vehicleType") ?? "";
    if (vt && isForm(vt)) setVehicleType(vt);

    const filtersStr = searchParams.get("filters") ?? "";
    if (filtersStr) {
      filtersStr
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((f) => {
          if (isEquipment(f)) {
            if (!useNoteStore.getState().filtersDraft.filters.includes(f)) {
              toggleEquipment(f);
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Если URL пустой, но есть applied — гидратируем draft ---- */
  useEffect(() => {
    if (searchParams.toString()) return;

    const a = useNoteStore.getState().filtersApplied;
    const hasAny =
      a.location ||
      a.filters.length > 0 ||
      a.transmission !== null ||
      a.engine !== null ||
      a.vehicleType !== null;

    if (!hasAny) return;

    setLocation(a.location);
    if (a.transmission) setTransmission(a.transmission);
    if (a.engine) setEngine(a.engine);
    if (a.vehicleType) setVehicleType(a.vehicleType);
    a.filters.forEach((f) => {
      if (!useNoteStore.getState().filtersDraft.filters.includes(f)) {
        toggleEquipment(f);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Live-синхронизация draft ↔ URL ---- */
  useEffect(() => {
    const d = useNoteStore.getState().filtersDraft;
    const sp = draftToSearchParams(d, page, limit);
    const url = sp.toString() ? `${pathname}?${sp.toString()}` : pathname;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", url);
    }
  }, [filtersDraft, page, pathname, limit]);
}
