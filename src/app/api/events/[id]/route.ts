import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { parseEventType } from "@/lib/event-type";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

/* GET /api/events/[id] — public */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const event = await db.event.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (e: any) {
    console.error("[GET /api/events/[id]]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* PATCH /api/events/[id] — admin update */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data: any = {};
  if (body.title       !== undefined) data.title       = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.city        !== undefined) data.city        = body.city;
  if (body.country     !== undefined) data.country     = body.country;
  if (body.costPerSeat !== undefined) data.costPerSeat = parseFloat(body.costPerSeat);
  if (body.mrp         !== undefined) data.mrp         = body.mrp === null || body.mrp === "" ? null : parseFloat(body.mrp);
  if (body.startDate   !== undefined) data.startDate   = new Date(body.startDate);
  if (body.endDate     !== undefined) data.endDate     = new Date(body.endDate);
  if (body.bookingEndDate !== undefined)
    data.bookingEndDate = body.bookingEndDate ? new Date(body.bookingEndDate) : null;
  if (body.totalSeats  !== undefined) data.totalSeats  = parseInt(body.totalSeats);
  if (body.images      !== undefined) data.images      = body.images;
  if (body.isActive    !== undefined) data.isActive    = body.isActive;
  if (body.eventType !== undefined) {
    const parsed = parseEventType(body.eventType);
    if (parsed) data.eventType = parsed;
  }
  if (body.overview    !== undefined) data.overview    = body.overview;
  if (body.overviewHeading !== undefined) data.overviewHeading = body.overviewHeading ? String(body.overviewHeading).trim() : null;
  if (body.highlights  !== undefined) data.highlights  = Array.isArray(body.highlights) ? body.highlights : [];
  if (body.inclusions  !== undefined) data.inclusions  = Array.isArray(body.inclusions) ? body.inclusions : [];
  if (body.exclusions  !== undefined) data.exclusions  = Array.isArray(body.exclusions) ? body.exclusions : [];
  if (body.minAge      !== undefined) data.minAge      = body.minAge === null || body.minAge === "" ? null : parseInt(body.minAge);
  if (body.maxAge      !== undefined) data.maxAge      = body.maxAge === null || body.maxAge === "" ? null : parseInt(body.maxAge);
  if (body.happyTravellers !== undefined) data.happyTravellers = body.happyTravellers === null || body.happyTravellers === "" ? null : parseInt(body.happyTravellers);

  try {
    const event = await db.event.update({ where: { id }, data });
    return NextResponse.json(event);
  } catch (e: any) {
    if (typeof e?.message === "string" && e.message.includes("Unknown argument")) {
      const {
        overview, overviewHeading, highlights, inclusions, exclusions,
        minAge, maxAge, happyTravellers,
        ...base
      } = data as any;
      const event = await db.event.update({ where: { id }, data: base });
      return NextResponse.json(event);
    }
    throw e;
  }
}

/* DELETE /api/events/[id] — admin */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
