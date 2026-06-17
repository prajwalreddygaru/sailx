import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle ?? null,
        ctaLabel: body.ctaLabel ?? "Shop Now",
        ctaHref: body.ctaHref ?? "/categories",
        badge: body.badge ?? null,
        imageUrl: body.imageUrl ?? null,
        gradient: body.gradient ?? "from-blue-900 via-blue-800 to-indigo-900",
        isActive: body.isActive ?? true,
        order: body.order ?? 1,
      },
    });
    return NextResponse.json(banner, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
