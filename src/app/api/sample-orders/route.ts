import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

function genCode() {
  return "SO-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (token as any).role;
  const userId = (token as any).id;

  const db = prisma as any;
  let orders;
  if (role === "ADMIN") {
    orders = await db.sampleOrder.findMany({
      include: { user: { select: { name: true, email: true } }, product: { select: { title: true, images: true } }, agent: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "AGENT") {
    const buyerId = new URL(req.url).searchParams.get("buyerId");
    orders = await db.sampleOrder.findMany({
      where: {
        OR: [{ agentId: userId }, { agentId: null }],
        ...(buyerId ? { userId: buyerId } : {}),
      },
      include: { user: { select: { name: true, email: true } }, product: { select: { title: true, images: true } }, agent: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  } else {
    orders = await db.sampleOrder.findMany({
      where: { userId },
      include: { product: { select: { title: true, images: true } }, agent: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (token as any).id as string;
  const body = await req.json();
  const { productId, quantity, notes, isBulk } = body;

  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const db = prisma as any;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const agentUser = await prisma.user.findFirst({ where: { role: "AGENT" } });

  let code = genCode();
  while (await db.sampleOrder.findUnique({ where: { code } })) {
    code = genCode();
  }

  const order = await db.sampleOrder.create({
    data: {
      code,
      userId,
      productId,
      productTitle: product.title,
      quantity: Number(quantity) || 1,
      notes: notes || null,
      isBulk: Boolean(isBulk),
      agentId: agentUser?.id ?? null,
    },
    include: { product: { select: { title: true } } },
  });

  return NextResponse.json(order, { status: 201 });
}
