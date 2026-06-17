import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { generateEventReceiptPdf } from "@/lib/event-pdf";
import { sendEventReceiptEmail } from "@/lib/email";
import { getSystemConfig } from "@/lib/system-config";

const db = prisma as any;

function fmt(d: Date) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* POST /api/events/[id]/verify
   Verifies Razorpay signature, marks booking PAID, decrements seats, sends PDF receipt */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

  /* Verify signature */
  const cfg = await getSystemConfig();
  const keySecret = cfg.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;
  if (keySecret) {
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    if (expected !== razorpaySignature)
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  /* Fetch booking + event */
  const booking = await db.eventBooking.findUnique({
    where: { id: bookingId },
    include: { event: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.paymentStatus === "PAID")
    return NextResponse.json({ message: "Already confirmed" });

  /* Mark paid + decrement seats atomically */
  await db.$transaction([
    db.eventBooking.update({
      where: { id: bookingId },
      data: {
        paymentStatus:     "PAID",
        razorpayPaymentId,
        razorpaySignature,
      },
    }),
    db.event.update({
      where: { id },
      data: { bookedSeats: { increment: booking.seats } },
    }),
  ]);

  /* Generate PDF + send email (non-blocking) */
  const ev = booking.event;
  generateEventReceiptPdf({
    bookingId,
    userName:    booking.userName,
    userEmail:   booking.userEmail,
    eventTitle:  ev.title,
    city:        ev.city,
    country:     ev.country,
    startDate:   fmt(ev.startDate),
    endDate:     fmt(ev.endDate),
    seats:       booking.seats,
    costPerSeat: ev.costPerSeat,
    totalAmount: booking.totalAmount,
    paymentId:   razorpayPaymentId,
  }).then((pdf) =>
    sendEventReceiptEmail({
      email:       booking.userEmail,
      name:        booking.userName,
      eventTitle:  ev.title,
      city:        ev.city,
      startDate:   fmt(ev.startDate),
      endDate:     fmt(ev.endDate),
      seats:       booking.seats,
      totalAmount: booking.totalAmount,
      bookingId,
      pdfBuffer:   pdf,
    }).then(() => db.eventBooking.update({ where: { id: bookingId }, data: { receiptSent: true } }))
  ).catch((e) => console.error("Receipt email error:", e));

  return NextResponse.json({ success: true, bookingId });
}
