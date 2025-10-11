import Hero from "@/components/Hero/Hero";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TravelTrucks — Camper Rentals",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className={styles.screen}>
      <Hero />
    </div>
  );
}
