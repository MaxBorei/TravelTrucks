"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import Container from "../Container/Container";
import Loader from "../Loader/Loader";
import ErrorPage from "../ErrorPage/ErrorPage";
import css from "./Catalog.module.css";

import { fetchCampers } from "./campersApi";
import { useNoteStore } from "@/app/lib/stores/noteStore";
import type {
  Camper,
  EquipmentKey,
  Transmission,
  Engine,
  Form,
} from "@/app/lib/stores/noteStore";
import { getAverageRating } from "@/app/lib/utils/rating"; // утиліта середнього рейтингу

export default function Catalog() {
  /* 1) Дані із сервера */
  const { data: serverCampers = [], isLoading, isError } = useQuery({
    queryKey: ["campers"],
    queryFn: fetchCampers,
  });

  /* 2) Селектори стора */
  const setCampers         = useNoteStore((s) => s.setCampers);
  const getFilteredCampers = useNoteStore((s) => s.getFilteredCampers);

  const filtersDraft    = useNoteStore((s) => s.filtersDraft);
  const setLocation     = useNoteStore((s) => s.setLocation);
  const toggleEquipment = useNoteStore((s) => s.toggleEquipment);
  const setTransmission = useNoteStore((s) => s.setTransmission);
  const setEngine       = useNoteStore((s) => s.setEngine);
  const setVehicleType  = useNoteStore((s) => s.setVehicleType);

  const applyFilters = useNoteStore((s) => s.applyFilters);
  const resetFilters = useNoteStore((s) => s.resetFilters);

  const toggleFavorite = useNoteStore((s) => s.toggleFavorite);

  /* 🔔 Підписки для ререндеру */
  const filtersApplied = useNoteStore((s) => s.filtersApplied);
  const campersState   = useNoteStore((s) => s.campers);
  const favorites      = useNoteStore((s) => s.favorites);

  /* 3) Покласти дані до стора після завантаження */
  useEffect(() => {
    if (serverCampers.length) setCampers(serverCampers as Camper[]);
  }, [serverCampers, setCampers]);

  /* 4) Отримати відфільтрований список */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = filtersApplied && campersState; // явна підписка
  const campers = getFilteredCampers();

  if (isLoading) return <Loader />;
  if (isError) return <ErrorPage />;

  return (
    <Container>
      <section className={css.catalog}>
        {/* ============ SIDEBAR FILTERS ============ */}
        <aside className={css.filters}>
          {/* Location */}
          <div className={css.filterBlock}>
            <label className={css.filterLabel}>Location</label>
            <div className={css.locationField}>
              <svg
                className={css.locationIcon}
                width="16"
                height="16"
                aria-hidden="true"
              >
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
            <button type="button" className={css.searchBtn} onClick={applyFilters}>
              Search
            </button>
            <button type="button" className={css.resetBtn} onClick={resetFilters}>
              Reset
            </button>
          </div>
        </aside>

        {/* ============ CAMPER CARDS ============ */}
        <div className={css.cards}>
          {campers.map((camper: Camper) => {
            const fav = Boolean(favorites[camper.id]);
            const { average, count } = getAverageRating(camper.reviews || []);

            // підготовка мапи іконок для пігулок
            const iconMap: Record<string, string> = {
              // трансмісія
              automatic: "icon-diagram",
              manual: "icon-diagram",
              // двигун
              diesel: "icon-petrol",
              petrol: "icon-petrol",
              hybrid: "icon-petrol",
              // форма
              van: "icon-bi_grid-1x2",
              "fully integrated": "icon-bi_grid",
              alcove: "icon-bi_grid-3x3-gap",
              // обладнання
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
                      {/* Ціна + “в обране” */}
                      <div className={css.priceWrap}>
                        <p className={css.cardPrice}>€{camper.price.toFixed(2)}</p>
                        <button
                          type="button"
                          className={css.favBtn}
                          aria-pressed={fav}
                          onClick={() => toggleFavorite(camper.id)}
                          title={fav ? "In favorites" : "Add to favorites"}
                        >
                          <svg
                            className={`${css.favIcon} ${fav ? css.favIconActive : ""}`}
                            aria-hidden="true"
                          >
                            <use href="/sprite.svg#icon-Heart" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Рейтинг + Локація */}
                    <div className={css.rating_location_container}>
                      <span className={css.ratingWrap}>
                        <Image
                          src="/star.png"
                          alt=""
                          width={16}
                          height={16}
                          className={css.starIcon}
                          priority={false}
                        />
                        <span className={css.ratingText}>
                          {average.toFixed(1)}
                          <span className={css.muted}>
                            ({count} Reviews)
                          </span>
                        </span>
                      </span>
                      <span className={css.locationWrap}>
                        <svg
                          className={css.locationIcon}
                          width="16"
                          height="16"
                          aria-hidden="true"
                        >
                          <use href="/sprite.svg#icon-Map" />
                        </svg>
                        <span className={css.cardLocation}>{camper.location}</span>
                      </span>
                    </div>
                  </div>

                  <p className={css.cardDescription}>{camper.description}</p>

                  {/* Пігулки з іконками (обгортаючі елементи не змінюю) */}
                  <ul className={css.cardFeatures}>
                    {[
                      // camper.form,
                      camper.transmission,
                      camper.engine,
                      camper.AC && "AC",
                      camper.TV && "TV",
                      camper.kitchen && "Kitchen",
                      camper.bathroom && "Bathroom",
                      // camper.refrigerator && "Fridge",
                      // camper.microwave && "Microwave",
                      // camper.gas && "Gas",
                      // camper.water && "Water",
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
        </div>
      </section>
    </Container>
  );
}
