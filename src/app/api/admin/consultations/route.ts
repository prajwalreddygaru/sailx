import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";
const db = prisma as any;

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const list = await db.consultation.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(list);
}

export async function PATCH(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, status } = body || {};
    if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    await db.consultation.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
