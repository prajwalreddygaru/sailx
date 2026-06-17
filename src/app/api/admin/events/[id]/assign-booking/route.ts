import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || (token as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || body.userEmail || "").trim().toLowerCase();
  const seats = Math.max(1, parseInt(String(body.seats || "1")) || 1);
  const status = String(body.paymentStatus || "PAID").toUpperCase();

  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const event = await db.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  if (!event.isActive) return NextResponse.json({ error: "Event is not active" }, { status: 400 });
  if (new Date(event.endDate) < new Date())
    return NextResponse.json({ error: "Event has ended" }, { status: 400 });
  if (event.bookingEndDate && new Date(event.bookingEndDate) < new Date())
    return NextResponse.json({ error: "Bookings are closed for this event" }, { status: 400 });

  const available = event.totalSeats - event.bookedSeats;
  if (seats > available)
    return NextResponse.json({ error: `Only ${available} seat(s) remaining` }, { status: 400 });

  const totalAmount = body.totalAmount != null
    ? Number(body.totalAmount)
    : Number(event.costPerSeat) * seats;

  try {
    const [booking] = await db.$transaction([
      db.eventBooking.create({
        data: {
          eventId: id,
          userId: user.id,
          userName: user.name ?? email.split("@")[0],
          userEmail: user.email,
          seats,
          totalAmount,
          paymentStatus: status,
          razorpayPaymentId: status === "PAID" ? `manual_${Date.now()}` : null,
        },
      }),
      db.event.update({ where: { id }, data: { bookedSeats: { increment: seats } } })
    ]);

    return NextResponse.json(booking, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to assign booking" }, { status: 500 });
  }
}
