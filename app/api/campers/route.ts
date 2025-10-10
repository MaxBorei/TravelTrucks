// C:\Study\Next\traveltrucks\app\api\campers\route.ts
import { NextRequest, NextResponse } from "next/server";
import { nextServer } from "@/lib/api/api";
import type { Paginated, Camper, EquipmentKey, Transmission, Engine, Form } from "@/types/types";

function parseQuery(sp: URLSearchParams) {
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const limit = Math.max(1, Math.min(50, Number(sp.get("limit") ?? "10")));
  const location = (sp.get("location") ?? "").trim();
  const transmission = (sp.get("transmission") ?? "") as "" | Transmission;
  const engine = (sp.get("engine") ?? "") as "" | Engine;
  const vehicleType = (sp.get("vehicleType") ?? "") as "" | Form;
  const filters = [...sp.getAll("filters").flatMap(v => v.split(",").filter(Boolean))] as EquipmentKey[];
  const sort = (sp.get("sort") ?? "") as "" | "price" | "rating";
  const order = (sp.get("order") ?? "asc") as "asc" | "desc";
  return { page, limit, location, transmission, engine, vehicleType, filters, sort, order };
}

function ratingOf(camper: Camper): number {
  const r = camper.reviews ?? [];
  if (r.length) return r.reduce((s, it) => s + (it.reviewer_rating ?? 0), 0) / r.length;
  return camper.rating ?? 0;
}

function matchesEquipment(c: Camper, filters: EquipmentKey[]): boolean {
  if (!filters.length) return true;
  return filters.every(f => {
    switch (f) {
      case "AC": return !!c.AC;
      case "kitchen": return !!c.kitchen;
      case "bathroom": return !!c.bathroom;
      case "TV": return !!c.TV;
      case "refrigerator": return !!c.refrigerator;
      case "microwave": return !!c.microwave;
      case "gas": return !!c.gas;
      case "water": return !!c.water;
      default: return true;
    }
  });
}

export async function GET(req: NextRequest) {
  try {
    const q = parseQuery(req.nextUrl.searchParams);

    const { data } = await nextServer.get("/campers");
    const all: Camper[] = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

    const filtered = all.filter(c => {
      if (q.location && !c.location?.toLowerCase().includes(q.location.toLowerCase())) return false;
      if (q.transmission && c.transmission !== q.transmission) return false;
      if (q.engine && c.engine !== q.engine) return false;
      if (q.vehicleType && (c.form ?? "").toString().trim() !== q.vehicleType) return false;
      if (!matchesEquipment(c, q.filters)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (q.sort === "price") {
      sorted.sort((a, b) => (q.order === "asc" ? a.price - b.price : b.price - a.price));
    } else if (q.sort === "rating") {
      sorted.sort((a, b) => (q.order === "asc" ? ratingOf(a) - ratingOf(b) : ratingOf(b) - ratingOf(a)));
    }

    const total = sorted.length;
    const pages = Math.max(1, Math.ceil(total / q.limit));
    const start = (q.page - 1) * q.limit;
    const items = sorted.slice(start, start + q.limit);

    const body: Paginated<Camper> = { items, total, page: q.page, limit: q.limit, pages };
    return NextResponse.json(body);
  } catch (err) {
    console.error("API /api/campers error:", err);
    return NextResponse.json({ error: "Failed to load campers from upstream" }, { status: 502 });
  }
}
