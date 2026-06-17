import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateInvoice } from "@/lib/invoice";
import { sendInvoiceEmail } from "@/lib/email";
import { generateEventReceiptPdf } from "@/lib/event-pdf";
import { sendEventReceiptEmail } from "@/lib/email";

const db = prisma as any;

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let webhookEvent: any;
  try {
    webhookEvent = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (webhookEvent.event === "payment.captured") {
    const payment    = webhookEvent.payload.payment.entity;
    const rzpOrderId = payment.order_id;
    const paymentId  = payment.id;

    /* ── 1. Try event booking first ── */
    const eventBooking = await db.eventBooking.findFirst({
      where: { razorpayOrderId: rzpOrderId, paymentStatus: "PENDING" },
      include: { event: true },
    });

    if (eventBooking) {
      await db.$transaction([
        db.eventBooking.update({
          where: { id: eventBooking.id },
          data: { paymentStatus: "PAID", razorpayPaymentId: paymentId },
        }),
        db.event.update({
          where: { id: eventBooking.eventId },
          data: { bookedSeats: { increment: eventBooking.seats } },
        }),
      ]);

      try {
        const ev = eventBooking.event;
        const pdf = await generateEventReceiptPdf({
          bookingId:   eventBooking.id,
          userName:    eventBooking.userName,
          userEmail:   eventBooking.userEmail,
          eventTitle:  ev.title,
          city:        ev.city,
          country:     ev.country,
          startDate:   fmtDate(ev.startDate),
          endDate:     fmtDate(ev.endDate),
          seats:       eventBooking.seats,
          costPerSeat: ev.costPerSeat,
          totalAmount: eventBooking.totalAmount,
          paymentId,
        });
        await sendEventReceiptEmail({
          email:       eventBooking.userEmail,
          name:        eventBooking.userName,
          eventTitle:  ev.title,
          city:        ev.city,
          startDate:   fmtDate(ev.startDate),
          endDate:     fmtDate(ev.endDate),
          seats:       eventBooking.seats,
          totalAmount: eventBooking.totalAmount,
          bookingId:   eventBooking.id,
          pdfBuffer:   pdf,
        });
        await db.eventBooking.update({ where: { id: eventBooking.id }, data: { receiptSent: true } });
      } catch (e) {
        console.error("[webhook] Event receipt email failed:", e);
      }

      return NextResponse.json({ ok: true });
    }

    /* ── 2. Fall back to sample order ── */
    const order = await db.sampleOrder.findFirst({ where: { razorpayOrderId: rzpOrderId } });
    if (!order) return NextResponse.json({ ok: true });

    await db.sampleOrder.update({
      where: { id: order.id },
      data: { status: "PAID", razorpayPaymentId: paymentId },
    });

    try {
      const fullOrder = await db.sampleOrder.findUnique({
        where: { id: order.id },
        include: { user: true, product: { select: { title: true } } },
      });
      const pdfBuffer = await generateInvoice(fullOrder);
      await sendInvoiceEmail(fullOrder.user.email, fullOrder.user.name, fullOrder.code, pdfBuffer);
    } catch (e) {
      console.error("[webhook] Invoice generation failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
