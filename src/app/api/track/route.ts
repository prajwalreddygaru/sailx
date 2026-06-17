import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  const order = await db.sampleOrder.findUnique({
    where: { code: code.toUpperCase() },
    select: {
      code: true,
      status: true,
      productTitle: true,
      quantity: true,
      isBulk: true,
      trackingInfo: true,
      createdAt: true,
      quotedPrice: true,
    },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(order);
}
