"use client";

import css from "./VehicleDetails.module.css";

type KV = { k: string; v: string };
type Props = { items: KV[]; title?: string };

export default function VehicleDetails({ items, title = "Vehicle details" }: Props) {
  if (!items.length) return null;
  return (
    <div className={css.card}>
      <h4 className={css.title}>{title}</h4>
      <ul className={css.list}>
        {items.map((d) => (
          <li key={d.k} className={css.row}>
            <span className={css.key}>{d.k}</span>
            <span className={css.val}>{d.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
