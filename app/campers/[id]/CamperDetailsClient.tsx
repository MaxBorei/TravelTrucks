"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import css from "./CamperDetailsClient.module.css";
import FeaturePills from "@/components/FeaturePills/FeaturePills";
import ReviewsList from "@/components/ReviewsList/ReviewsList";
import VehicleDetails from "@/components/VehicleDetails/VehicleDetails";
import BookingForm from "@/components/BookingForm/BookingForm";
import type { Camper, EquipmentKey } from "@/types/types";
import { getAverageRating } from "@/lib/utils/rating";

type Tab = "features" | "reviews";
export type FeatureKey = EquipmentKey | "transmission" | "engine" | "radio";
export type FeatureFlag = { key: FeatureKey; label: string; value: boolean };
const flag = <K extends FeatureKey>(
  key: K,
  label: string,
  value: boolean
): FeatureFlag => ({
  key,
  label,
  value,
});

type Props = {
  id: string;
  camper: Camper;
};

export default function CamperDetailsClient({ id, camper }: Props) {
  const [tab, setTab] = useState<Tab>("features");

  const { average, count } = useMemo(
    () => getAverageRating(camper.reviews, 1),
    [camper.reviews]
  );
  const avgRating = count > 0 ? average : (camper.rating ?? 0);

  // для бейдджів фіч
  const featureFlags: FeatureFlag[] = [
    flag("transmission", camper.transmission, true),
    flag("engine", camper.engine, true),
    flag("AC", "AC", !!camper.AC),
    flag("bathroom", "Bathroom", !!camper.bathroom),
    flag("kitchen", "Kitchen", !!camper.kitchen),
    flag("TV", "TV", !!camper.TV),
    flag("radio", "Radio", !!camper.radio),
    flag("refrigerator", "Fridge", !!camper.refrigerator),
    flag("microwave", "Microwave", !!camper.microwave),
    flag("gas", "Gas", !!camper.gas),
    flag("water", "Water", !!camper.water),
  ].filter((f) => f.value);

  // vehicle details (показуємо лише на Features)
  const details = [
    { k: "Form", v: camper.form?.toString() ?? "" },
    { k: "Length", v: camper.length ?? "" },
    { k: "Width", v: camper.width ?? "" },
    { k: "Height", v: camper.height ?? "" },
    { k: "Tank", v: camper.tank ?? "" },
    { k: "Consumption", v: camper.consumption ?? "" },
  ].filter((d) => d.v);

  // перші 4 фото однакової ширини в ряд
  const gallery = (camper.gallery ?? []).slice(0, 3);

  return (
    <div className={css.detailsWrapper}>
      {/* Header */}
      <div className={css.header_container}>
        <div className={css.header}>
          <h1 className={css.title}>{camper.name}</h1>
          <div className={css.header_rewies_location}>
            <div className={css.meta}>
              <Image src="/star.png" width={16} height={16} alt="" />
              <span className={css.rating}>
                <span>{avgRating.toFixed(1)}</span>
                <span className={css.muted}>
                  {" "}
                  ({camper.reviews?.length ?? 0} Reviews)
                </span>
              </span>
            </div>
            <span className={css.location}>
              <svg
                className={css.locIcon}
                width="16"
                height="16"
                aria-hidden="true"
              >
                <use href="/sprite.svg#icon-Map" />
              </svg>
              {camper.location}
            </span>
          </div>
          <p className={css.price}>€{camper.price.toFixed(2)}</p>
        </div>
        {/* Gallery — 4 однакові зображення в ряд */}
        <div className={css.gallery}>
          {gallery.map((g, i) => (
            <Image
              key={i}
              className={css.galleryImg}
              src={g?.original || g?.thumb || "/Picture.jpg"}
              alt={`${camper.name} ${i + 1}`}
              width={284}
              height={188}
              priority={i === 0}
            />
          ))}
        </div>
        {/* Опис ПІД картинками */}
        {camper.description && (
          <p className={css.description}>{camper.description}</p>
        )}
      </div>

      {/* Tabs */}
      <div className={css.tabs}>
        <button
          type="button"
          className={`${css.tabBtn} ${tab === "features" ? css.tabActive : ""}`}
          onClick={() => setTab("features")}
        >
          Features
        </button>
        <button
          type="button"
          className={`${css.tabBtn} ${tab === "reviews" ? css.tabActive : ""}`}
          onClick={() => setTab("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className={css.contentRow}>
        <div className={css.leftCol}>
          {tab === "features" ? (
            <>
              <FeaturePills items={featureFlags} />
              <VehicleDetails items={details} />
            </>
          ) : (
            <ReviewsList camper={camper} />
          )}
        </div>

        <aside className={css.rightCol}>
          <BookingForm camperId={id} />
        </aside>
      </div>
    </div>
  );
}
