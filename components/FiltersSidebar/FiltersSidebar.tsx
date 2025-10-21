"use client";
import {
  EQUIPMENT,
  TRANSMISSIONS,
  ENGINES,
  VEHICLE_TYPES,
} from "@/lib/constants/constants";
import css from "./FiltersSidebar.module.css";

import { useNoteStore } from "@/lib/stores/noteStore";
import { getIconId } from "@/lib/constants/iconMap";

type Props = {
  onApply: () => void;
  onReset: () => void;
};

export default function FiltersSidebar({ onApply, onReset }: Props) {
  // ===== Zustand (працюємо з "draft")
  const filtersDraft = useNoteStore((s) => s.filtersDraft);
  const setLocation = useNoteStore((s) => s.setLocation);
  const toggleEquipment = useNoteStore((s) => s.toggleEquipment);
  const setTransmission = useNoteStore((s) => s.setTransmission);
  const setEngine = useNoteStore((s) => s.setEngine);
  const setVehicleType = useNoteStore((s) => s.setVehicleType);

  return (
    <div className={css.filters}>
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
        <ul className={css.filterOptions}>
          {EQUIPMENT.map(({ key, label, iconKey }) => {
            const active = filtersDraft.filters.includes(key);
            const iconId = getIconId(iconKey);

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => toggleEquipment(key)}
                  className={`${css.filterBtn} ${active ? css.activeFilter : ""}`}
                  aria-pressed={active}
                >
                  <svg className={css.icon} aria-hidden="true">
                    <use href={`/sprite.svg#${iconId}`} />
                  </svg>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Transmission */}
      <div className={css.filterBlock}>
        <h4 className={css.filterTitle}>Transmission</h4>
        <ul className={css.filterOptions}>
          {TRANSMISSIONS.map(({ key, label, iconKey }) => {
            const active = filtersDraft.transmission === key;
            const iconId = getIconId(iconKey);

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setTransmission(key)}
                  className={`${css.filterBtn} ${active ? css.activeFilter : ""}`}
                  aria-pressed={active}
                >
                  <svg className={css.icon} aria-hidden="true">
                    <use href={`/sprite.svg#${iconId}`} />
                  </svg>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Engine type */}
      <div className={css.filterBlock}>
        <h4 className={css.filterTitle}>Engine type</h4>
        <ul className={css.filterOptions}>
          {ENGINES.map(({ key, label, iconKey }) => {
            const active = filtersDraft.engine === key;
            const iconId = getIconId(iconKey);

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setEngine(key)}
                  className={`${css.filterBtn} ${active ? css.activeFilter : ""}`}
                  aria-pressed={active}
                >
                  <svg className={css.icon} aria-hidden="true">
                    <use href={`/sprite.svg#${iconId}`} />
                  </svg>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Vehicle type */}
      <div className={css.filterBlock}>
        <h4 className={css.filterTitle}>Vehicle type</h4>
        <ul className={css.filterOptions}>
          {VEHICLE_TYPES.map(({ key, label, iconKey }) => {
            const active = filtersDraft.vehicleType === key;
            const iconId = getIconId(iconKey);

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setVehicleType(key)}
                  className={`${css.filterBtn} ${active ? css.activeFilter : ""}`}
                  aria-pressed={active}
                >
                  <svg className={css.icon} aria-hidden="true">
                    <use href={`/sprite.svg#${iconId}`} />
                  </svg>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
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
    </div>
  );
}
