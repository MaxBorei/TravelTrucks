TravelTrucks — Camper Rentals (Next.js)

A camper catalog with filters, pagination, and URL-synced state.
Filtering/sorting/pagination are handled on the backend (Next Route Handler). The frontend uses React Query + Axios, and global state is managed with Zustand (with persist).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Tech stack:
Next.js (app router)
TypeScript (no any)
Zustand (+ persist) — global state (filters, favorites)
@tanstack/react-query — data/cache/refetch
Axios — requests to /api
CSS Modules — component styles
Next Image — images

Features:
Filters: location, equipment, transmission, engine, vehicleType
Server-side pagination + Show more button (lazy-load 4 cards per click)
URL sync for draft filters (?page=&location=&filters=AC,kitchen…)
Apply filters via Search button (triggers backend request)
Reset — clears filters and URL
Favorites (local, via Zustand persist)
Universal <Button /> component with primary | outline variants
Refresh resilience: applied filters and favorites are preserved
No jump-to-top on filter clicks (URL updated via history.replaceState)

## Getting Started

First, install dependencies:

```bash
npm i
# or
yarn
# or
pnpm i
# or
bun install
```
Environment variables

Configure your environment variables:

```bash
cp .env.example .env
# Fill in: BASE_URL, etc.
```

```bash
# Upstream API base used by Next.js Route Handlers when fetching external data
BASE_URL=https://66b1f8e71ca8ad33d4f5f63e.mockapi.io
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
