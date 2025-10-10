"use client";

import Image from "next/image";
import type { Camper } from "@/types/types";
import css from "./ReviewsList.module.css";

type Props = { camper: Camper };

export default function ReviewsList({ camper }: Props) {
  const list = camper.reviews ?? [];
  if (!list.length) return <p className={css.muted}>No reviews yet.</p>;

  return (
    <div className={css.root}>
      {list.map((r, i) => (
        <div key={i} className={css.item}>
          <div className={css.head}>
            <div className={css.avatar}>
              {r.reviewer_name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <div className={css.name}>{r.reviewer_name ?? "User"}</div>
              <div className={css.rating}>
                <Image src="/star.png" width={14} height={14} alt="" />
                <span>{(r.reviewer_rating ?? 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
          {r.comment && <p className={css.text}>{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}
