"use client";

import type { Camper } from "@/lib/types/types";
import css from "./ReviewsList.module.css";

import StarRatingSprite from "@/components/StarFills/StarFills";
import { roundToStep } from "@/lib/utils/rating";

type Props = { camper: Camper };

export default function ReviewsList({ camper }: Props) {
  const list = camper.reviews ?? [];
  if (!list.length) return <p className={css.muted}>No reviews yet.</p>;

  return (
    <div className={css.root}>
      {list.map((r, i) => {
        const initial = r.reviewer_name?.[0]?.toUpperCase() ?? "U";
        const value = roundToStep(r.reviewer_rating ?? 0, 0.5);

        return (
          <div key={i} className={css.item}>
            <div className={css.head}>
              <div className={css.avatar}>{initial}</div>
              <div>
                <div className={css.name}>{r.reviewer_name ?? "User"}</div>
                <div className={css.ratingRow}>
                  <StarRatingSprite value={value} size={14} />
                </div>
              </div>
            </div>

            {r.comment && <p className={css.text}>{r.comment}</p>}
          </div>
        );
      })}
    </div>
  );
}
