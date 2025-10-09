"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Container from "../Container/Container";
import Loader from "../Loader/Loader";
import ErrorPage from "../ErrorPage/ErrorPage";
import css from "./Catalog.module.css";

import { useNoteStore } from "@/lib/stores/noteStore";
import { getCampers } from "@/lib/api/clientApi";

import type {
  Camper,
  Paginated,
  EquipmentKey,
  Transmission,
  Engine,
  Form,
} from "@/types/types";

// ===== helpers =====
const isTransmission = (v: string): v is Transmission =>
  v === "automatic" || v === "manual";
const isEngine = (v: string): v is Engine =>
  v === "diesel" || v === "petrol" || v === "hybrid";
const isForm = (v: string): v is Form =>
  v === "panelTruck" || v === "fullyIntegrated" || v === "alcove";
const isEquipment = (v: string): v is EquipmentKey =>
  ["AC", "bathroom", "kitchen", "TV", "refrigerator", "microwave", "gas", "water"].includes(v as EquipmentKey);

type Draft = {
  location: string;
  transmission: Transmission | null;
  engine: Engine | null;
  vehicleType: Form | null;
  filters: EquipmentKey[];
};

function buildDraftFromStore() {
  const s = useNoteStore.getState().filtersDraft;
  return {
    location: s.location,
    transmission: s.transmission,
    engine: s.engine,
    vehicleType: s.vehicleType,
    filters: s.filters.slice(),
  } as Draft;
}

function draftToSearchParams(d: Draft, page: number, limit: number) {
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

export default function Catalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ===== Zustand =====
  const filtersDraft    = useNoteStore((s) => s.filtersDraft);
  const filtersApplied  = useNoteStore((s) => s.filtersApplied);

  const setLocation     = useNoteStore((s) => s.setLocation);
  const toggleEquipment = useNoteStore((s) => s.toggleEquipment);
  const setTransmission = useNoteStore((s) => s.setTransmission);
  const setEngine       = useNoteStore((s) => s.setEngine);
  const setVehicleType  = useNoteStore((s) => s.setVehicleType);

  const applyFilters    = useNoteStore((s) => s.applyFilters);
  const resetFilters    = useNoteStore((s) => s.resetFilters);

  const toggleFavorite  = useNoteStore((s) => s.toggleFavorite);
  const favorites       = useNoteStore((s) => s.favorites);

  // ===== Пагинація + акумулятор під Show more =====
  const [page, setPage] = useState<number>(1);
  const limit = 4;
  const [acc, setAcc] = useState<Camper[]>([]);

  // ---- Ініціалізація з URL ----
  useEffect(() => {
    const p = Number(searchParams.get("page") ?? "1");
    setPage(Number.isFinite(p) && p > 0 ? p : 1);

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

  // ---- Якщо URL порожній, але є applied у сторі — гідратуємо драфт ----
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

  // ---- Реалтайм-синхронізація draft ↔ URL ----
  useEffect(() => {
  const d = buildDraftFromStore();
  const sp = draftToSearchParams(d, page, limit).toString();
  const url = sp ? `${pathname}?${sp}` : pathname;

  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", url);
  }
}, [filtersDraft, page, pathname, limit]);

  
  // ---- Запит тільки по applied ----
  const queryParams = useMemo(() => {
    const d = filtersApplied;
    return {
      page,
      limit,
      location: d.location || "",
      transmission: (d.transmission ?? "") as Transmission | "",
      engine: (d.engine ?? "") as Engine | "",
      vehicleType: (d.vehicleType ?? "") as Form | "",
      filters: d.filters.slice(),
    };
  }, [filtersApplied, page]);

  const { data, isLoading, isError } = useQuery<Paginated<Camper>>({
    queryKey: ["campers", queryParams] as const,
    queryFn: () => getCampers(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const initialFixApplied = useRef(false);
useEffect(() => {
  if (initialFixApplied.current) return;
  if (!data) return;

  const urlPage = Number(searchParams.get("page") ?? "1");
  const totalPages = data.pages ?? 1;

  // Якщо в URL була сторінка >1 і це остання/поза діапазоном — скидаємо на 1
  if (urlPage > 1 && urlPage >= totalPages) {
    initialFixApplied.current = true;
    setAcc([]);        // чистимо накопичені елементи
    setPage(1);        // тригерить перезапит і синхронізацію URL
  }
}, [data, searchParams, setPage]);

  // накопичення для "Load more"
  useEffect(() => {
    if (!data?.items) return;
    setAcc((prev) => {
      if (page === 1) return data.items.slice();
      const ids = new Set(prev.map((c) => c.id));
      const toAppend = data.items.filter((c) => !ids.has(c.id));
      return [...prev, ...toAppend];
    });
  }, [data?.items, page]);

  const campers = acc.length ? acc : data?.items ?? [];

  if (isLoading && !acc.length) return <Loader />;
  if (isError) return <ErrorPage />;

  // ---- Дії ----
  const onApply = () => {
    setPage(1);
    setAcc([]);
    applyFilters();
  };

  const onReset = () => {
    resetFilters();
    setPage(1);
    setAcc([]);
    router.replace(pathname, { scroll: false });
  };

  const canLoadMore = (data?.page ?? 1) < (data?.pages ?? 1);
  const loadMore = () => {
    if (!canLoadMore) return;
    setPage((p) => p + 1);
  };

  return (
    <Container>
      <section className={css.catalog}>
        {/* ============ SIDEBAR FILTERS ============ */}
        <aside className={css.filters}>
          {/* Location */}
          <div className={css.filterBlock}>
            <label className={css.filterLabel}>Location</label>
            <div className={css.locationField}>
              <svg className={css.locationIcon} width="16" height="16" aria-hidden="true">
                <use href="/sprite.svg#icon-Map" />
              </svg>
              <input
                type="text"
                placeholder="City"
                value={filtersDraft.location}
                onChange={(e) => setLocation(e.target.value)}
                className={css.locationInput}
              />
            </div>
          </div>

          {/* Vehicle equipment */}
          <div className={css.filterBlock}>
            <h4 className={css.filterTitle}>Vehicle equipment</h4>
            <div className={css.filterOptions}>
              {(
                [
                  { key: "AC", label: "AC", icon: "icon-wind" },
                  { key: "kitchen", label: "Kitchen", icon: "icon-cup-hot" },
                  { key: "bathroom", label: "Bathroom", icon: "icon-ph_shower" },
                  { key: "TV", label: "TV", icon: "icon-tv" },
                  { key: "refrigerator", label: "Fridge", icon: "icon-solar_fridge-outline" },
                  { key: "microwave", label: "Microwave", icon: "icon-lucide_microwave" },
                  { key: "gas", label: "Gas", icon: "icon-hugeicons_gas-stove" },
                  { key: "water", label: "Water", icon: "icon-ion_water-outline" },
                ] as { key: EquipmentKey; label: string; icon: string }[]
              ).map(({ key, label, icon }) => {
                const active = filtersDraft.filters.includes(key);
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleEquipment(key)}
                    className={`${css.filterBtn} ${active ? css.activeFilter : ""}`}
                    aria-pressed={active}
                  >
                    <svg className={css.icon} aria-hidden="true">
                      <use href={`/sprite.svg#${icon}`} />
                    </svg>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transmission */}
          <div className={css.filterBlock}>
            <h4 className={css.filterTitle}>Transmission</h4>
            <div className={css.filterOptions}>
              {(
                [
                  { key: "automatic", label: "Automatic", icon: "icon-diagram" },
                  { key: "manual", label: "Manual", icon: "icon-diagram" },
                ] as { key: Transmission; label: string; icon: string }[]
              ).map(({ key, label, icon }) => {
                const active = filtersDraft.transmission === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setTransmission(key)}
                    className={`${css.filterBtn} ${active ? css.activeFilter : ""}`}
                    aria-pressed={active}
                  >
                    <svg className={css.icon} aria-hidden="true">
                      <use href={`/sprite.svg#${icon}`} />
                    </svg>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Engine type */}
          <div className={css.filterBlock}>
            <h4 className={css.filterTitle}>Engine type</h4>
            <div className={css.filterOptions}>
              {(
                [
                  { key: "diesel", label: "Diesel", icon: "icon-petrol" },
                  { key: "petrol", label: "Petrol", icon: "icon-petrol" },
                  { key: "hybrid", label: "Hybrid", icon: "icon-petrol" },
                ] as { key: Engine; label: string; icon: string }[]
              ).map(({ key, label, icon }) => {
                const active = filtersDraft.engine === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setEngine(key)}
                    className={`${css.filterBtn} ${active ? css.activeFilter : ""}`}
                    aria-pressed={active}
                  >
                    <svg className={css.icon} aria-hidden="true">
                      <use href={`/sprite.svg#${icon}`} />
                    </svg>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle type */}
          <div className={css.filterBlock}>
            <h4 className={css.filterTitle}>Vehicle type</h4>
            <div className={css.filterOptions}>
              {(
                [
                  { key: "panelTruck", label: "Van", icon: "icon-bi_grid-1x2" },
                  { key: "fullyIntegrated", label: "Fully Integrated", icon: "icon-bi_grid" },
                  { key: "alcove", label: "Alcove", icon: "icon-bi_grid-3x3-gap" },
                ] as { key: Form; label: string; icon: string }[]
              ).map(({ key, label, icon }) => {
                const active = filtersDraft.vehicleType === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setVehicleType(key)}
                    className={`${css.filterBtn} ${active ? css.activeFilter : ""}`}
                    aria-pressed={active}
                  >
                    <svg className={css.icon} aria-hidden="true">
                      <use href={`/sprite.svg#${icon}`} />
                    </svg>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apply / Reset */}
          <div className={css.actions}>
            <button type="button" className={css.searchBtn} onClick={onApply}>
              Search
            </button>
            <button type="button" className={css.resetBtn} onClick={onReset}>
              Reset
            </button>
          </div>
        </aside>

        {/* ============ CAMPER CARDS ============ */}
        <div className={css.cards}>
          {campers.map((camper: Camper) => {
            const fav = Boolean(favorites[camper.id]);

            const reviewsCount = camper.reviews?.length ?? 0;
            const average = reviewsCount
              ? camper.reviews!.reduce((s, r) => s + r.reviewer_rating, 0) / reviewsCount
              : camper.rating ?? 0;

            const iconMap: Record<string, string> = {
              automatic: "icon-diagram",
              manual: "icon-diagram",
              diesel: "icon-petrol",
              petrol: "icon-petrol",
              hybrid: "icon-petrol",
              van: "icon-bi_grid-1x2",
              "fully integrated": "icon-bi_grid",
              alcove: "icon-bi_grid-3x3-gap",
              kitchen: "icon-cup-hot",
              ac: "icon-wind",
              tv: "icon-tv",
              bathroom: "icon-ph_shower",
              fridge: "icon-solar_fridge-outline",
              refrigerator: "icon-solar_fridge-outline",
              microwave: "icon-lucide_microwave",
              gas: "icon-hugeicons_gas-stove",
              water: "icon-ion_water-outline",
            };

            return (
              <article key={camper.id} className={css.card}>
                <Image
                  src={camper.gallery?.[0]?.thumb || "/Picture.jpg"}
                  alt={camper.name}
                  width={292}
                  height={320}
                  className={css.image}
                />

                <div className={css.cardContent}>
                  <div>
                    <div className={css.cardHeader}>
                      <h3 className={css.cardTitle}>{camper.name}</h3>

                      <div className={css.priceWrap}>
                        <p className={css.cardPrice}>€{camper.price.toFixed(2)}</p>
                        <button
                          type="button"
                          className={css.favBtn}
                          aria-pressed={fav}
                          onClick={() => toggleFavorite(camper.id)}
                          title={fav ? "In favorites" : "Add to favorites"}
                        >
                          <svg className={`${css.favIcon} ${fav ? css.favIconActive : ""}`} aria-hidden="true">
                            <use href="/sprite.svg#icon-Heart" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className={css.rating_location_container}>
                      <span className={css.ratingWrap}>
                        <Image src="/star.png" alt="" width={16} height={16} className={css.starIcon} />
                        <span className={css.ratingText}>
                          {average.toFixed(1)}
                          <span className={css.muted}>({reviewsCount} Reviews)</span>
                        </span>
                      </span>

                      <span className={css.locationWrap}>
                        <svg className={css.locationIcon} width="16" height="16" aria-hidden="true">
                          <use href="/sprite.svg#icon-Map" />
                        </svg>
                        <span className={css.cardLocation}>{camper.location}</span>
                      </span>
                    </div>
                  </div>

                  <p className={css.cardDescription}>{camper.description}</p>

                  <ul className={css.cardFeatures}>
                    {[
                      camper.transmission,
                      camper.engine,
                      camper.AC && "AC",
                      camper.TV && "TV",
                      camper.kitchen && "Kitchen",
                      camper.bathroom && "Bathroom",
                    ]
                      .filter((f): f is string => Boolean(f))
                      .map((f) => {
                        const key = f.toLowerCase();
                        const iconId = iconMap[key] ?? "icon-diagram";
                        return (
                          <li key={f} className={css.featurePill}>
                            <svg className={css.featureIcon} aria-hidden="true">
                              <use href={`/sprite.svg#${iconId}`} />
                            </svg>
                            <span>{f}</span>
                          </li>
                        );
                      })}
                  </ul>

                  <button type="button" className={css.showMore}>
                    Show more
                  </button>
                </div>
              </article>
            );
          })}

          {/* ============ Load more ============ */}
          {((data?.page ?? 1) < (data?.pages ?? 1)) && (
            <button className={css.loadMore} onClick={loadMore}>
              Load more
            </button>
          )}
        </div>
      </section>
    </Container>
  );
}
