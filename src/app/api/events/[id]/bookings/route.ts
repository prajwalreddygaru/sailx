import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

/* GET /api/events/[id]/bookings — admin only */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const bookings = await (prisma as any).eventBooking.findMany({
    where:   { eventId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}
