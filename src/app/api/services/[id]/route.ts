import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authToken } from "@/lib/auth-token";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const svc = (prisma as any).service;
    if (!svc || typeof svc.findUnique !== "function") {
      return NextResponse.json({ error: "Service model not available. Run prisma migrate." }, { status: 500 });
    }
    const item = await svc.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to load service" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const svc = (prisma as any).service;
    if (!svc || typeof svc.update !== "function") {
      return NextResponse.json({ error: "Service model not available. Run prisma migrate." }, { status: 500 });
    }
    const updated = await svc.update({
      where: { id },
      data: {
        title: body.title !== undefined ? String(body.title) : undefined,
        short: body.short !== undefined ? (String(body.short).trim() || null) : undefined,
        description: body.description !== undefined ? (String(body.description).trim() || null) : undefined,
        imageUrl: body.imageUrl !== undefined ? (String(body.imageUrl).trim() || null) : undefined,
        order: body.order !== undefined ? Number(body.order) : undefined,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const svc = (prisma as any).service;
    if (!svc || typeof svc.delete !== "function") {
      return NextResponse.json({ error: "Service model not available. Run prisma migrate." }, { status: 500 });
    }
    await svc.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to delete service" }, { status: 500 });
  }
}
