import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

// GET /api/events/[id]/memories — public
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const days = await db.eventMemoryDay.findMany({ where: { eventId: id }, orderBy: { dayNumber: "asc" } });
    return NextResponse.json(days);
  } catch (e: any) {
    console.error("[GET /api/events/[id]/memories]", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

// PUT /api/events/[id]/memories — admin: replace entire memories set
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { days } = await req.json();
  if (!Array.isArray(days)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const norm = days
    .map((d: any, i: number) => ({
      dayNumber: Number(d.dayNumber ?? i + 1),
      title: d.title ? String(d.title) : null,
      images: Array.isArray(d.images) ? d.images.map(String) : [],
    }))
    .filter((d: any) => d.images.length > 0 || (d.title && d.title.trim().length > 0));

  try {
    await db.$transaction([
      db.eventMemoryDay.deleteMany({ where: { eventId: id } }),
      ...(norm.length ? [db.eventMemoryDay.createMany({ data: norm.map((d: any) => ({ ...d, eventId: id })) })] : []),
    ]);
    const out = await db.eventMemoryDay.findMany({ where: { eventId: id }, orderBy: { dayNumber: "asc" } });
    return NextResponse.json(out);
  } catch (e: any) {
    console.error("[PUT /api/events/[id]/memories]", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}
