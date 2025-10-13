import type { Metadata } from "next";
import Catalog from "@/components/Catalog/Catalog";

export const metadata: Metadata = {
  title: "TravelTrucks — Camper Catalog",
  description:
    "Explore without limits with TravelTrucks: fully equipped expedition campers for rent. Hit mountains, deserts, forests, or coastlines in comfort and style.",
  metadataBase: new URL("https://travel-trucks-eta-eight.vercel.app"),
  alternates: {
    canonical: "https://travel-trucks-eta-eight.vercel.app/catalog",
  },
  openGraph: {
    type: "website",
    url: "https://travel-trucks-eta-eight.vercel.app/catalog",
    title: "TravelTrucks — Camper Catalog",
    description:
      "Explore without limits with TravelTrucks: fully equipped expedition campers for rent. Hit mountains, deserts, forests, or coastlines in comfort and style.",
  },
  twitter: {
    card: "summary",
    title: "TravelTrucks — Camper Catalog",
    description:
      "Explore without limits with TravelTrucks: fully equipped expedition campers for rent. Hit mountains, deserts, forests, or coastlines in comfort and style.",
  },
  robots: { index: true, follow: true },
};

export default function CatalogPage() {
  return <Catalog />;
}
