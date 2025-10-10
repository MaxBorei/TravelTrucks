// C:\Study\Next\traveltrucks\app\api\bookings\route.ts
import { NextRequest, NextResponse } from "next/server";
import type { BookingRequest } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<BookingRequest>;

    const camperId = body?.camperId?.toString().trim();
    const name     = body?.name?.toString().trim();
    const email    = body?.email?.toString().trim();
    const date     = body?.date?.toString().trim();
    const comment  = body?.comment?.toString() ?? "";

    if (!camperId || !name || !email || !date) {
      return NextResponse.json(
        { ok: false, message: "name, email, date and camperId are required" },
        { status: 400 }
      );
    }

    // Тут могла б бути реальна логіка (DB/SMTP/інтеграції)
    return NextResponse.json(
      { ok: true, booking: { camperId, name, email, date, comment } },
      { status: 201 }
    );
  } catch (err) {
    console.error("API /api/bookings error:", err);
    return NextResponse.json(
      { ok: false, message: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
