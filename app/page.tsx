import Hero from "@/components/Hero/Hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TravelTrucks — Camper Rentals",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div>
      <Hero />
    </div>
  );
}
