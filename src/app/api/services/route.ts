import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authToken } from "@/lib/auth-token";

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  try {
    const svc = (prisma as any).service;
    if (!svc || typeof svc.findMany !== "function") {
      // Prisma client not generated for Service yet; return empty for safety
      return NextResponse.json([]);
    }
    const where = status === "all" ? {} : { isActive: true };
    const list = await svc.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to load services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const svc = (prisma as any).service;
    if (!svc || typeof svc.create !== "function") {
      return NextResponse.json({ error: "Service model not available. Please run: npx prisma migrate dev" }, { status: 500 });
    }
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const slugBase = slugify(title);
    let slug = slugBase;
    let i = 1;
    while (await svc.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${i++}`;
    }
    const created = await svc.create({
      data: {
        slug,
        title,
        short: String(body.short || "").trim() || null,
        description: String(body.description || "").trim() || null,
        imageUrl: String(body.imageUrl || "").trim() || null,
        order: Number(body.order ?? 0) || 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to create service" }, { status: 500 });
  }
}
