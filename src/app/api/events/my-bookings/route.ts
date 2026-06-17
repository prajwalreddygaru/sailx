import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (token as any).id as string;
  const bookings = await (prisma as any).eventBooking.findMany({
    where:   { userId, paymentStatus: "PAID" },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
