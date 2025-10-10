"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import css from "./CamperDetailsClient.module.css";

import { createBooking } from "@/lib/api/clientApi";
import type { Camper, EquipmentKey } from "@/types/types";

/* ---------- Props ---------- */
type Props = {
  id: string;     // camper id для бронювання
  camper: Camper; // дані кемпера (завантажені на сервері)
};

/* ---------- Tabs ---------- */
type Tab = "features" | "reviews";

/* ---------- Feature flags ---------- */
/**
 * Дозволяємо в «пігулках» як обладнання (EquipmentKey),
 * так і службові ключі трансмісії/двигуна.
 */
type FeatureKey = EquipmentKey | "transmission" | "engine";

/** Маленький хелпер, щоб зберегти літерал ключа та не отримати string */
const flag = <K extends FeatureKey>(key: K, label: string, value: boolean) => ({
  key,
  label,
  value,
});

export default function CamperDetailsClient({ id, camper }: Props) {
  const [tab, setTab] = useState<Tab>("features");

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ---------- Rating (avg) ---------- */
  const avgRating = useMemo(() => {
    const r = camper.reviews ?? [];
    if (!r.length) return camper.rating ?? 0;
    const sum = r.reduce((s, x) => s + (x.reviewer_rating ?? 0), 0);
    return sum / r.length;
  }, [camper]);

  /* ---------- Features (equipment + transmission/engine) ---------- */
  const featureFlags: Array<{ key: FeatureKey; label: string; value: boolean }> = [
    flag("transmission", camper.transmission, true),
    flag("engine", camper.engine, true),

    flag("AC", "AC", !!camper.AC),
    flag("bathroom", "Bathroom", !!camper.bathroom),
    flag("kitchen", "Kitchen", !!camper.kitchen),
    flag("TV", "TV", !!camper.TV),
    // flag("radio", "Radio", !!camper.radio),
    flag("refrigerator", "Fridge", !!camper.refrigerator),
    flag("microwave", "Microwave", !!camper.microwave),
    flag("gas", "Gas", !!camper.gas),
    flag("water", "Water", !!camper.water),
  ].filter((f) => f.value);

  /* ---------- Vehicle details (right column) ---------- */
  const details = [
    { k: "Form", v: camper.form?.toString() ?? "" },
    { k: "Length", v: camper.length ?? "" },
    { k: "Width", v: camper.width ?? "" },
    { k: "Height", v: camper.height ?? "" },
    { k: "Tank", v: camper.tank ?? "" },
    { k: "Consumption", v: camper.consumption ?? "" },
  ].filter((d) => d.v);

  /* ---------- Submit через Axios ---------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget; // зберігаємо ДООО await, щоби не зловити "reading 'reset'"
    setSubmitting(true);
    setToast(null);

    try {
      const fd = new FormData(formEl);
      const payload = {
        camperId: id,
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        date: String(fd.get("date") ?? ""),
        comment: String(fd.get("comment") ?? ""),
      };

      // валідація (мінімальна)
      if (!payload.name || !payload.email || !payload.date) {
        throw new Error("Please fill in Name, Email and Date.");
      }

      await createBooking(payload); // Axios -> /api/bookings (або ваш бекенд-роут)
      formEl.reset();
      setToast({ type: "success", text: "Booking request sent successfully!" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Booking failed. Please try again.";
      setToast({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- Render ---------- */
  return (
    <div className={css.detailsWrapper}>
      {/* Header: Title, price, rating, location */}
      <div className={css.header}>
        <div>
          <h1 className={css.title}>{camper.name}</h1>
          <div className={css.meta}>
            <span className={css.rating}>
              <Image src="/star.png" width={16} height={16} alt="" />
              <span>{avgRating.toFixed(1)}</span>
              <span className={css.muted}>
                {" "}
                ({(camper.reviews?.length ?? 0)} Reviews)
              </span>
            </span>
            <span className={css.dot}>·</span>
            <span className={css.location}>
              <svg className={css.locIcon} width="16" height="16" aria-hidden="true">
                <use href="/sprite.svg#icon-Map" />
              </svg>
              {camper.location}
            </span>
          </div>
        </div>

        <p className={css.price}>€{camper.price.toFixed(2)}</p>
      </div>

      {/* Gallery */}
      <div className={css.gallery}>
        <Image
          className={css.mainImage}
          src={camper.gallery?.[0]?.original || camper.gallery?.[0]?.thumb || "/Picture.jpg"}
          alt={camper.name}
          width={888}
          height={380}
        />
        <div className={css.thumbs}>
          {(camper.gallery ?? []).slice(1, 4).map((g, idx) => (
            <Image
              key={idx}
              className={css.thumb}
              src={g.thumb || g.original || "/Picture.jpg"}
              alt={`${camper.name} ${idx + 1}`}
              width={280}
              height={180}
            />
          ))}
        </div>
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
        {/* Left column */}
        <div className={css.leftCol}>
          {/* Опис */}
          {camper.description && (
            <p className={css.description}>{camper.description}</p>
          )}

          {/* Пігулки features */}
          {tab === "features" && (
            <ul className={css.pills}>
              {featureFlags.map((f) => (
                <li key={`${f.key}-${f.label}`} className={css.pill}>
                  {/* Іконку підбирайте за своїм мапінгом; для простоти іконку не міняю */}
                  <svg className={css.pillIcon} aria-hidden="true">
                    <use href="/sprite.svg#icon-diagram" />
                  </svg>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Відгуки */}
          {tab === "reviews" && (
            <div className={css.reviews}>
              {(camper.reviews ?? []).map((r, i) => (
                <div key={i} className={css.reviewItem}>
                  <div className={css.reviewerHead}>
                    <div className={css.avatar}>
                      {r.reviewer_name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div>
                      <div className={css.reviewerName}>{r.reviewer_name ?? "User"}</div>
                      <div className={css.reviewerRating}>
                        <Image src="/star.png" width={14} height={14} alt="" />
                        <span>{(r.reviewer_rating ?? 0).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  {r.comment && <p className={css.reviewText}>{r.comment}</p>}
                </div>
              ))}
              {!camper.reviews?.length && (
                <p className={css.muted}>No reviews yet.</p>
              )}
            </div>
          )}

          {/* Деталі транспортного засобу */}
          <div className={css.detailsCard}>
            <h4 className={css.detailsTitle}>Vehicle details</h4>
            <ul className={css.detailsList}>
              {details.map((d) => (
                <li key={d.k} className={css.detailRow}>
                  <span className={css.detailKey}>{d.k}</span>
                  <span className={css.detailVal}>{d.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column — booking form */}
        <aside className={css.rightCol}>
          <form className={css.form} onSubmit={handleSubmit}>
            <h4 className={css.formTitle}>Book your campervan now</h4>
            <p className={css.formMuted}>
              Stay connected! We are always ready to help you.
            </p>

            <input
              className={css.input}
              type="text"
              name="name"
              placeholder="Name*"
              required
              disabled={submitting}
            />
            <input
              className={css.input}
              type="email"
              name="email"
              placeholder="Email*"
              required
              disabled={submitting}
            />
            <input
              className={css.input}
              type="date"
              name="date"
              placeholder="Date*"
              required
              disabled={submitting}
            />
            <textarea
              className={css.textarea}
              name="comment"
              placeholder="Comment"
              rows={4}
              disabled={submitting}
            />
            <button
              type="submit"
              className={css.submitBtn}
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send"}
            </button>

            {toast && (
              <div
                role="status"
                className={`${css.toast} ${
                  toast.type === "success" ? css.toastSuccess : css.toastError
                }`}
              >
                {toast.text}
              </div>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
}
