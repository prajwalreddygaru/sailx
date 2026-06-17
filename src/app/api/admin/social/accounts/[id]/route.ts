import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authToken } from "@/lib/auth-token";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  try {
    const body = await req.json();
    const acc = await (prisma as any).socialAccount.update({
      where: { id },
      data: {
        platform: body.platform === "INSTAGRAM" ? "INSTAGRAM" : body.platform === "YOUTUBE" ? "YOUTUBE" : undefined,
        name: body.name,
        url: body.url,
        order: body.order !== undefined ? Number(body.order) : undefined,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(acc);
  } catch (e) {
    console.error("social accounts PATCH error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  try {
    await (prisma as any).socialAccount.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("social accounts DELETE error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
