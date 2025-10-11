"use client";

import { getIconId } from "@/lib/constants/iconMap";
import type { FeatureFlag } from "@/lib/utils/features";
import css from "./FeaturePills.module.css";

type Props = { items: FeatureFlag[] };

export default function FeaturePills({ items }: Props) {
  return (
    <ul className={css.pills}>
      {items.map((f) => {
        const iconKey =
          f.key === "transmission" || f.key === "engine"
            ? f.label
            : String(f.key);
        const iconId = getIconId(iconKey);

        return (
          <li key={`${f.key}-${f.label}`} className={css.pill}>
            <svg className={css.icon} aria-hidden="true">
              <use href={`/sprite.svg#${iconId}`} />
            </svg>
            <span>{f.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
