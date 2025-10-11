"use client";

import Image from "next/image";
import Link from "next/link";
import css from "./CamperCard.module.css";

import type { Camper } from "@/types/types";
import { buildFeatureFlags, type FeatureFlag } from "@/lib/utils/features";
import { getIconId } from "@/lib/constants/iconMap";

type Props = {
  camper: Camper;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

const PRIORITY: FeatureFlag["key"][] = [
  "transmission",
  "engine",
  "AC",
  "kitchen",
  "bathroom",
  "TV",
  "refrigerator",
  "microwave",
  "gas",
  "water",
  "radio",
];

function sortByPriority(flags: FeatureFlag[]): FeatureFlag[] {
  const idx = new Map(PRIORITY.map((k, i) => [k, i]));
  return flags.slice().sort((a, b) => {
    const ai = idx.get(a.key) ?? Number.MAX_SAFE_INTEGER;
    const bi = idx.get(b.key) ?? Number.MAX_SAFE_INTEGER;
    return ai === bi ? a.label.localeCompare(b.label) : ai - bi;
  });
}

export default function CamperCard({
  camper,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const reviewsCount = camper.reviews?.length ?? 0;
  const average = reviewsCount
    ? camper.reviews!.reduce((s, r) => s + r.reviewer_rating, 0) / reviewsCount
    : (camper.rating ?? 0);

  const topFeatures = sortByPriority(buildFeatureFlags(camper)).slice(0, 5);

  return (
    <article className={css.card}>
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
                aria-pressed={isFavorite}
                onClick={() => onToggleFavorite(camper.id)}
                title={isFavorite ? "In favorites" : "Add to favorites"}
              >
                <svg
                  className={`${css.favIcon} ${isFavorite ? css.favIconActive : ""}`}
                  aria-hidden="true"
                >
                  <use href="/sprite.svg#icon-Heart" />
                </svg>
              </button>
            </div>
          </div>

          <div className={css.rating_location_container}>
            <span className={css.ratingWrap}>
              <Image
                src="/star.png"
                alt=""
                width={16}
                height={16}
                className={css.starIcon}
              />
              <span className={css.ratingText}>
                {average.toFixed(1)}{" "}
                <span className={css.muted}>({reviewsCount} Reviews)</span>
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

        {/* пилюли */}
        <ul className={css.cardFeatures}>
          {topFeatures.map((f) => {
            const iconKey =
              f.key === "transmission" || f.key === "engine"
                ? f.label
                : String(f.key);
            const iconId = getIconId(iconKey);

            return (
              <li key={`${f.key}-${f.label}`} className={css.featurePill}>
                <svg className={css.featureIcon} aria-hidden="true">
                  <use href={`/sprite.svg#${iconId}`} />
                </svg>
                <span>{f.label}</span>
              </li>
            );
          })}
        </ul>

        <Link href={`/campers/${camper.id}`} className={css.showMore}>
          Show more
        </Link>
      </div>
    </article>
  );
}
