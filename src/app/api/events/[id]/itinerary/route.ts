import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

// GET /api/events/[id]/itinerary — public
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const days = await db.eventDay.findMany({ where: { eventId: id }, orderBy: { dayNumber: "asc" } });
  return NextResponse.json(days);
}

// PUT /api/events/[id]/itinerary — admin: replace entire itinerary
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { days } = await req.json();
  if (!Array.isArray(days)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // normalize
  const norm = days
    .map((d: any, i: number) => ({
      dayNumber: Number(d.dayNumber ?? i + 1),
      heading: (d.heading ?? null) ? String(d.heading).trim() : null,
      title: String(d.title ?? "Day " + (i + 1)),
      description: String(d.description ?? ""),
    }))
    .filter((d: any) => d.title.trim().length > 0);

  try {
    await db.$transaction([
      db.eventDay.deleteMany({ where: { eventId: id } }),
      db.eventDay.createMany({ data: norm.map((d: any) => ({ ...d, eventId: id })) }),
    ]);
  } catch (e: any) {
    if (typeof e?.message === "string" && e.message.includes("Unknown argument")) {
      // Retry without optional fields like heading if the DB wasn't migrated yet
      const fallback = norm.map((d: any) => ({ dayNumber: d.dayNumber, title: d.title, description: d.description }));
      await db.$transaction([
        db.eventDay.deleteMany({ where: { eventId: id } }),
        db.eventDay.createMany({ data: fallback.map((d: any) => ({ ...d, eventId: id })) }),
      ]);
    } else {
      throw e;
    }
  }

  const out = await db.eventDay.findMany({ where: { eventId: id }, orderBy: { dayNumber: "asc" } });
  return NextResponse.json(out);
}
