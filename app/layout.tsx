import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Container from "@/components/Container/Container";
import { Inter } from "next/font/google";

const inter = Inter({
   subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "TravelTrucks — Camper Rentals",
    template: "%s | TravelTrucks",
  },
  description:
    "TravelTrucks is a camper rental service that gives you the freedom to travel anywhere with comfort and style.",
  keywords: [
    "camper rental", "campervan", "RV", "vanlife", "off-road", "rent a camper"
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },            // <-- без /public
      { url: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  
  openGraph: {
    title: "TravelTrucks — Camper Rentals",
    description:
      "Fully equipped campervans for adventures anywhere — comfort, flexibility, and support.",
    url: "/", 
    siteName: "TravelTrucks",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelTrucks — Camper Rentals",
    description: "Freedom to travel anywhere with comfort and style.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Header />
        <main>
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}
