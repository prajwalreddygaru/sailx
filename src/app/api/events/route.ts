import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { normalizeEventType } from "@/lib/event-type";
import { prisma } from "@/lib/prisma";

/* GET /api/events — public listing */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // "active" | "completed" | "all"
  const now = new Date();

  const where: any = {};
  if (status === "active")    { where.endDate = { gte: now }; where.isActive = true; }
  if (status === "completed") { where.endDate = { lt:  now }; }
  if (!status || status === "all") { /* no filter */ }

  try {
    const events = await (prisma as any).event.findMany({
      where,
      orderBy: { startDate: "asc" },
      include: { _count: { select: { bookings: true } } },
    });
    return NextResponse.json(events);
  } catch (e: any) {
    console.error("[GET /api/events]", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

/* POST /api/events — admin creates event */
export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, city, country, costPerSeat, mrp, startDate, endDate,
          bookingEndDate, totalSeats, images, overview, overviewHeading, highlights, inclusions, exclusions,
          minAge, maxAge, happyTravellers, eventType } = body;

  if (!title || !city || !costPerSeat || !startDate || !endDate || !totalSeats)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  try {
    const data: any = {
      title, description: description ?? "",
      city, country: country ?? "India",
      costPerSeat: parseFloat(costPerSeat),
      mrp: mrp ? parseFloat(mrp) : undefined,
      startDate: new Date(startDate),
      endDate:   new Date(endDate),
      bookingEndDate: bookingEndDate ? new Date(bookingEndDate) : undefined,
      totalSeats: parseInt(totalSeats),
      images: images ?? [],
      adminId: (token as any).id as string,
      eventType: normalizeEventType(eventType),
    };

    // Optional extras for booking page
    if (overview !== undefined) data.overview = String(overview);
    if (overviewHeading !== undefined) data.overviewHeading = overviewHeading ? String(overviewHeading).trim() : null;
    if (Array.isArray(highlights)) data.highlights = highlights;
    if (Array.isArray(inclusions)) data.inclusions = inclusions;
    if (Array.isArray(exclusions)) data.exclusions = exclusions;
    if (minAge !== undefined) data.minAge = minAge === null || minAge === "" ? null : parseInt(minAge);
    if (maxAge !== undefined) data.maxAge = maxAge === null || maxAge === "" ? null : parseInt(maxAge);
    if (happyTravellers !== undefined) data.happyTravellers = happyTravellers === null || happyTravellers === "" ? null : parseInt(happyTravellers);

    try {
      const event = await (prisma as any).event.create({ data });
      return NextResponse.json(event, { status: 201 });
    } catch (e: any) {
      // Fallback for environments where Prisma schema hasn't been migrated with new fields
      if (typeof e?.message === "string" && e.message.includes("Unknown argument")) {
        const {
          overview, overviewHeading, highlights, inclusions, exclusions,
          minAge, maxAge, happyTravellers, // strip extras
          ...base
        } = data;
        const event = await (prisma as any).event.create({ data: base });
        return NextResponse.json(event, { status: 201 });
      }
      throw e;
    }
  } catch (e: any) {
    console.error("[POST /api/events]", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}
