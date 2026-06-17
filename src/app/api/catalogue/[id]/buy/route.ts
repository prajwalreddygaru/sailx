import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const db = prisma as any;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await db.catalogueItem.findUnique({ where: { id } });
  if (!item)         return NextResponse.json({ error: "Item not found" }, { status: 404 });
  if (!item.isActive) return NextResponse.json({ error: "Item not available" }, { status: 400 });

  // Optional quantity from body
  let qty = 1;
  try {
    const body = await req.json();
    if (body && body.qty) {
      const q = parseInt(String(body.qty));
      if (!isNaN(q) && q > 0 && q < 1000) qty = q;
    }
  } catch { /* body may be empty */ }

  const userId    = (token as any).id    as string;
  const userName  = (token as any).name  as string ?? "Guest";
  const userEmail = (token as any).email as string ?? "";

  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const totalAmount = item.price * qty;

  if (!keyId || !keySecret) {
    const purchase = await db.cataloguePurchase.create({
      data: {
        itemId: id, userId, userName, userEmail,
        totalAmount,
        paymentStatus: "PAID",
        razorpayPaymentId: "demo_" + Date.now(),
      },
    });
    return NextResponse.json({ demo: true, purchaseId: purchase.id });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const rzpOrder = await razorpay.orders.create({
    amount:   Math.round(totalAmount * 100),
    currency: "INR",
    receipt:  `cat-${id.slice(0, 8)}-${Date.now()}`,
    notes:    { itemId: id, userId, qty: String(qty) },
  });

  const purchase = await db.cataloguePurchase.create({
    data: {
      itemId: id, userId, userName, userEmail,
      totalAmount,
      paymentStatus: "PENDING",
      razorpayOrderId: rzpOrder.id,
    },
  });

  return NextResponse.json({
    key:         keyId,
    orderId:     rzpOrder.id,
    amount:      rzpOrder.amount,
    currency:    "INR",
    purchaseId:  purchase.id,
    name:        "SailX",
    description: `${item.title} × ${qty}`,
    prefill:     { name: userName, email: userEmail },
  });
}
