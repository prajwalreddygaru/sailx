import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET() {
  const items = await db.catalogueItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || (token as any).role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, image, price, isActive, order } = await req.json();
  if (!title || !price)
    return NextResponse.json({ error: "title and price are required" }, { status: 400 });

  const item = await db.catalogueItem.create({
    data: {
      title,
      description: description ?? "",
      image: image ?? null,
      price: parseFloat(price),
      isActive: isActive !== false,
      order:   parseInt(order) || 0,
      adminId: (token as any).id,
    },
  });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest) {
  const token = await authToken(req);
  if (!token || (token as any).role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  if (data.price !== undefined) data.price = parseFloat(data.price);
  if (data.order !== undefined) data.order = parseInt(data.order);

  const item = await db.catalogueItem.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const token = await authToken(req);
  if (!token || (token as any).role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db.catalogueItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
