import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { getSystemConfig } from "@/lib/system-config";

const db = prisma as any;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  void id;

  const { purchaseId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

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

  const purchase = await db.cataloguePurchase.findUnique({ where: { id: purchaseId } });
  if (!purchase) return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  if (purchase.paymentStatus === "PAID") return NextResponse.json({ message: "Already confirmed" });

  await db.cataloguePurchase.update({
    where: { id: purchaseId },
    data: { paymentStatus: "PAID", razorpayPaymentId, razorpaySignature },
  });

  return NextResponse.json({ success: true, purchaseId });
}
