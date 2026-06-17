import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { getSystemConfig } from "@/lib/system-config";

const db = prisma as any;

/* POST /api/events/[id]/book
   Creates a Razorpay order + pending EventBooking */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { seats } = await req.json();
  const seatsNum = parseInt(seats) || 1;

  const event = await db.event.findUnique({ where: { id } });
  if (!event)      return NextResponse.json({ error: "Event not found" }, { status: 404 });
  if (!event.isActive) return NextResponse.json({ error: "Event is not active" }, { status: 400 });
  if (new Date(event.endDate) < new Date())
    return NextResponse.json({ error: "Event has ended" }, { status: 400 });
  if (event.bookingEndDate && new Date(event.bookingEndDate) < new Date())
    return NextResponse.json({ error: "Bookings are closed for this event" }, { status: 400 });

  const available = event.totalSeats - event.bookedSeats;
  if (seatsNum > available)
    return NextResponse.json({ error: `Only ${available} seat(s) remaining` }, { status: 400 });

  const totalAmount = event.costPerSeat * seatsNum;
  const userId  = (token as any).id as string;
  const userName  = (token as any).name  as string ?? "Guest";
  const userEmail = (token as any).email as string ?? "";

  const cfg       = await getSystemConfig();
  const keyId     = cfg.razorpayKeyId || undefined;
  const keySecret = cfg.razorpayKeySecret || undefined;

  if (!keyId || !keySecret) {
    /* Demo mode — confirm immediately */
    const booking = await db.eventBooking.create({
      data: {
        eventId: id, userId, userName, userEmail,
        seats: seatsNum, totalAmount,
        paymentStatus: "PAID",
        razorpayPaymentId: "demo_" + Date.now(),
      },
    });
    await db.event.update({
      where: { id },
      data: { bookedSeats: { increment: seatsNum } },
    });
    return NextResponse.json({ demo: true, bookingId: booking.id });
  }

  /* Create Razorpay order */
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const rzpOrder = await razorpay.orders.create({
    amount:   Math.round(totalAmount * 100),
    currency: "INR",
    receipt:  `evt-${id.slice(0, 8)}-${Date.now()}`,
    notes:    { eventId: id, userId, seats: String(seatsNum) },
  });

  /* Create pending booking */
  const booking = await db.eventBooking.create({
    data: {
      eventId: id, userId, userName, userEmail,
      seats: seatsNum, totalAmount,
      paymentStatus: "PENDING",
      razorpayOrderId: rzpOrder.id,
    },
  });

  return NextResponse.json({
    key:       keyId,
    orderId:   rzpOrder.id,
    amount:    rzpOrder.amount,
    currency:  "INR",
    bookingId: booking.id,
    name:      "SailX",
    description: `${event.title} — ${seatsNum} seat(s)`,
    prefill:   { name: userName, email: userEmail },
  });
}
