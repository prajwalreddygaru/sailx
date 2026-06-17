import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const order = await db.sampleOrder.findUnique({
    where: { id },
    include: {
      user:    { select: { name: true, email: true } },
      product: { select: { title: true, images: true, price: true } },
      agent:   { select: { name: true, email: true } },
    },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (token as any).role;
  const { id } = await params;
  const body = await req.json();

  const allowedFields: Record<string, unknown> = {};

  if (role === "ADMIN" || role === "AGENT") {
    if (body.quotedPrice !== undefined) allowedFields.quotedPrice = parseFloat(body.quotedPrice);
    if (body.status !== undefined) allowedFields.status = body.status;
    if (body.trackingInfo !== undefined) allowedFields.trackingInfo = body.trackingInfo;
    if (body.agentId !== undefined) allowedFields.agentId = body.agentId;
  }

  const updated = await db.sampleOrder.update({
    where: { id },
    data: allowedFields,
  });

  return NextResponse.json(updated);
}
