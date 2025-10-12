import { NextRequest, NextResponse } from "next/server";
import { nextServer } from "@/lib/api/api";
import type { Camper } from "@/types/types";
import type { AxiosError } from "axios";

type Params = { id: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const safeId = encodeURIComponent(id?.trim() ?? "");
    if (!safeId) {
      return NextResponse.json({ error: "Missing camper id" }, { status: 400 });
    }

    const { data, status } = await nextServer.get<Camper>(
      `/campers/${safeId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!data) {
      return NextResponse.json({ error: "Camper not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status });
  } catch (err) {
    const ax = err as AxiosError<unknown>;
    if (ax.response) {
      // Проксую відповідь апстріму як є (статус + короткий опис)
      return NextResponse.json(
        {
          error: "Upstream error",
          details: ax.response.data ?? ax.response.statusText,
        },
        { status: ax.response.status }
      );
    }
    console.error("API /api/campers/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to load camper from upstream" },
      { status: 502 }
    );
  }
}
