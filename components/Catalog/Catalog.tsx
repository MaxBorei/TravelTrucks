"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCampers } from "./campersApi";
import css from "./Catalog.module.css";
import Image from "next/image";
import Container from "../Container/Container";
import Loader from "../Loader/Loader";
import ErrorPage from "../ErrorPage/ErrorPage"

interface Camper {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  description: string;
  transmission: string;
  engine: string;
  form: string;
  AC: boolean;
  bathroom: boolean;
  kitchen: boolean;
  TV: boolean;
  refrigerator: boolean;
  microwave: boolean;
  gas: boolean;
  water: boolean;
  gallery: { thumb: string; original: string }[];
}

export default function Catalog() {
  const { data: campers = [], isLoading, isError } = useQuery({
    queryKey: ["campers"],
    queryFn: fetchCampers,
  });

  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [transmission, setTransmission] = useState<string | null>(null);
  const [engine, setEngine] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<string | null>(null);

  // multi-filter toggle (equipment)
  const toggleFilter = (feature: string) => {
    setFilters((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  // single-select filters
  const handleTransmission = (type: string) => {
    setTransmission((prev) => (prev === type ? null : type));
  };

  const handleEngine = (type: string) => {
    setEngine((prev) => (prev === type ? null : type));
  };

  const handleVehicleType = (type: string) => {
    setVehicleType((prev) => (prev === type ? null : type));
  };

  // filtering logic
  const filteredCampers = campers.filter((camper: Camper) => {
    const matchLocation =
      !location ||
      camper.location.toLowerCase().includes(location.toLowerCase());

    const matchTransmission = transmission
      ? camper.transmission.toLowerCase() === transmission
      : true;

    const matchEngine = engine
      ? camper.engine.toLowerCase() === engine
      : true;

    const matchVehicleType = vehicleType
      ? camper.form === vehicleType
      : true;

    const matchEquipment = filters.every(
      (f) => camper[f as keyof Camper] === true
    );

    return (
      matchLocation &&
      matchTransmission &&
      matchEngine &&
      matchVehicleType &&
      matchEquipment
    );
  });

  if (isLoading)
    return <Loader/>;

  if (isError)
    return <ErrorPage/>;

  return (
    <Container>
      <section className={css.catalog}>
        {/* === SIDEBAR FILTERS === */}
        <aside className={css.filters}>
          {/* Location */}
<div className={css.filterBlock}>
  <label className={css.filterLabel}>Location</label>

  <div className={css.locationField}>
    <svg className={css.locationIcon} aria-hidden="true">
      <use href="/sprite.svg#icon-Map" />
    </svg>

    <input
      type="text"
      placeholder="City"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      className={css.locationInput}
    />
  </div>
</div>

          {/* Vehicle equipment */}
          <div className={css.filterBlock}>
            <h4 className={css.filterTitle}>Vehicle equipment</h4>
            <div className={css.filterOptions}>
              {[
                { key: "AC", label: "AC", icon: "icon-wind" },
                { key: "kitchen", label: "Kitchen", icon: "icon-cup-hot" },
                { key: "bathroom", label: "Bathroom", icon: "icon-ph_shower" },
                { key: "TV", label: "TV", icon: "icon-tv" },
                { key: "refrigerator", label: "Fridge", icon: "icon-solar_fridge-outline" },
                { key: "microwave", label: "Microwave", icon: "icon-lucide_microwave" },
                { key: "gas", label: "Gas", icon: "icon-hugeicons_gas-stove" },
                { key: "water", label: "Water", icon: "icon-ion_water-outline" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  className={`${css.filterBtn} ${filters.includes(key) ? css.activeFilter : ""}`}
                >
                  <svg className={css.icon}>
                    <use href={`/sprite.svg#${icon}`} />
                  </svg>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className={css.filterBlock}>
            <h4 className={css.filterTitle}>Transmission</h4>
            <div className={css.filterOptions}>
              {[
                { key: "automatic", label: "Automatic", icon: "icon-diagram" },
                { key: "manual", label: "Manual", icon: "icon-diagram" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => handleTransmission(key)}
                  className={`${css.filterBtn} ${transmission === key ? css.activeFilter : ""}`}
                >
                  <svg className={css.icon}>
                    <use href={`/sprite.svg#${icon}`} />
                  </svg>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Engine type */}
          <div className={css.filterBlock}>
            <h4 className={css.filterTitle}>Engine type</h4>
            <div className={css.filterOptions}>
              {[
                { key: "diesel", label: "Diesel", icon: "icon-petrol" },
                { key: "petrol", label: "Petrol", icon: "icon-petrol" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => handleEngine(key)}
                  className={`${css.filterBtn} ${engine === key ? css.activeFilter : ""}`}
                >
                  <svg className={css.icon}>
                    <use href={`/sprite.svg#${icon}`} />
                  </svg>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle type */}
          <div className={css.filterBlock}>
            <h4 className={css.filterTitle}>Vehicle type</h4>
            <div className={css.filterOptions}>
                {[
                { key: "panelTruck", label: "Van", icon: "icon-bi_grid-1x2" },
                { key: "fullyIntegrated", label: "Fully Integrated", icon: "icon-bi_grid" },
                
                { key: "alcove", label: "Alcove", icon: "icon-bi_grid-3x3-gap" },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => handleVehicleType(key)}
                  className={`${css.filterBtn} ${vehicleType === key ? css.activeFilter : ""}`}
                >
                  <svg className={css.icon}>
                    <use href={`/sprite.svg#${icon}`} />
                  </svg>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button className={css.searchBtn}>Search</button>
        </aside>

        {/* === CAMPER CARDS === */}
        <div className={css.cards}>
          {filteredCampers.map((camper: Camper) => (
            <article key={camper.id} className={css.card}>
              <Image
                src={camper.gallery?.[0]?.thumb || "/Picture.jpg"}
                alt={camper.name}
                width={290}
                height={320}
                className={css.image}
              />
              <div className={css.cardContent}>
                <div className={css.cardHeader}>
                  <h3 className={css.cardTitle}>{camper.name}</h3>
                  <p className={css.cardPrice}>€{camper.price.toFixed(2)}</p>
                </div>
                <p className={css.cardLocation}>{camper.location}</p>
                <p className={css.cardDescription}>{camper.description}</p>
                <ul className={css.cardFeatures}>
                  {[
                    camper.form,
                    camper.transmission,
                    camper.engine,
                    camper.AC && "AC",
                    camper.TV && "TV",
                    camper.kitchen && "Kitchen",
                    camper.bathroom && "Bathroom",
                  ]
                    .filter((f): f is string => Boolean(f))
                    .map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                </ul>
                <button className={css.showMore}>Show more</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
