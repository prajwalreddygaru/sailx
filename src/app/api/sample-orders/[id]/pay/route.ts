import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { getSystemConfig } from "@/lib/system-config";

const db = prisma as any;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const order = await db.sampleOrder.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!order.quotedPrice) return NextResponse.json({ error: "No price quoted yet" }, { status: 400 });

  const cfg       = await getSystemConfig();
  const keyId     = cfg.razorpayKeyId || undefined;
  const keySecret = cfg.razorpayKeySecret || undefined;

  if (!keyId || !keySecret) {
    // Demo mode: skip Razorpay, mark as paid directly
    const updated = await db.sampleOrder.update({
      where: { id },
      data: { status: "PAID", razorpayPaymentId: "demo_" + Date.now() },
    });
    return NextResponse.json({ demo: true, order: updated });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  const rzpOrder = await razorpay.orders.create({
    amount: Math.round(order.quotedPrice * 100),
    currency: "INR",
    receipt: order.code,
    notes: { sampleOrderId: order.id },
  });

  await db.sampleOrder.update({
    where: { id },
    data: { status: "PAYMENT_PENDING", razorpayOrderId: rzpOrder.id },
  });

  return NextResponse.json({
    key: keyId,
    orderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    name: "SailX",
    description: `Sample order ${order.code}`,
    orderCode: order.code,
  });
}
