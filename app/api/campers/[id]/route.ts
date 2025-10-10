// C:\Study\Next\traveltrucks\app\api\campers\[id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { nextServer } from "@/lib/api/api";
import type { Camper } from "@/types/types";

/** Next 15: params приходить як Promise */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data } = await nextServer.get<Camper>(`/campers/${encodeURIComponent(id)}`);
    if (!data) return NextResponse.json({ error: "Camper not found" }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    console.error("API /api/campers/[id] error:", err);
    return NextResponse.json({ error: "Failed to load camper from upstream" }, { status: 502 });
  }
}
