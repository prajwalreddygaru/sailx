import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.price !== undefined && { price: parseFloat(body.price) }),
      ...(body.salePrice !== undefined && { salePrice: body.salePrice ? parseFloat(body.salePrice) : null }),
      ...(body.chinaCost !== undefined && { chinaCost: body.chinaCost ? parseFloat(body.chinaCost) : null }),
      ...(body.indiaCost !== undefined && { indiaCost: body.indiaCost ? parseFloat(body.indiaCost) : null }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.images !== undefined && { images: body.images }),
      ...(body.stock !== undefined && { stock: parseInt(body.stock) }),
      ...(body.sku !== undefined && { sku: body.sku }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
