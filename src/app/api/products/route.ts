import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const status = searchParams.get("status");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(featured === "true" ? { isFeatured: true } : {}),
      ...(status && status !== "all" ? { status: status as any } : !status ? { status: "ACTIVE" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      title: body.title,
      description: body.description,
      price: parseFloat(body.price),
      salePrice: body.salePrice ? parseFloat(body.salePrice) : null,
      chinaCost: body.chinaCost ? parseFloat(body.chinaCost) : null,
      indiaCost: body.indiaCost ? parseFloat(body.indiaCost) : null,
      category: body.category,
      tags: body.tags ?? [],
      images: body.images ?? [],
      stock: parseInt(body.stock ?? "0"),
      sku: body.sku ?? null,
      status: body.status ?? "DRAFT",
      isFeatured: body.isFeatured ?? false,
      adminId: (token.id as string) ?? token.sub!,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
