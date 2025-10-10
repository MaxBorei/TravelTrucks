"use client";

import { useState } from "react";
import { createBooking } from "@/lib/api/clientApi";
import css from "./BookingForm.module.css";

type Props = { camperId: string };

export default function BookingForm({ camperId }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setSubmitting(true);
    setToast(null);

    try {
      const fd = new FormData(formEl);
      const payload = {
        camperId,
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        date: String(fd.get("date") ?? ""),
        comment: String(fd.get("comment") ?? ""),
      };

      if (!payload.name || !payload.email || !payload.date) {
        throw new Error("Please fill in Name, Email and Date.");
      }

      await createBooking(payload);
      formEl.reset();
      setToast({ type: "success", text: "Booking request sent successfully!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking failed. Please try again.";
      setToast({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h4 className={css.title}>Book your campervan now</h4>
      <p className={css.muted}>Stay connected! We are always ready to help you.</p>

      <div className={css.form_input}>
        <input className={css.input} type="text" name="name" placeholder="Name*" required disabled={submitting} />
        <input className={css.input} type="email" name="email" placeholder="Email*" required disabled={submitting} />
        <input className={css.input} type="date" name="date" placeholder="Date*" required disabled={submitting} />
        <textarea className={css.textarea} name="comment" placeholder="Comment" rows={4} disabled={submitting} />
      </div>

      <button type="submit" className={css.submit} disabled={submitting}>
        {submitting ? "Sending…" : "Send"}
      </button>

      {toast && (
        <div role="status" className={`${css.toast} ${toast.type === "success" ? css.toastSuccess : css.toastError}`}>
          {toast.text}
        </div>
      )}
    </form>
  );
}
