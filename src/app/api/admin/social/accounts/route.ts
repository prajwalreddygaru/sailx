import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authToken } from "@/lib/auth-token";

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const list = await (prisma as any).socialAccount.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(list);
  } catch (e) {
    console.error("social accounts GET error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const acc = await (prisma as any).socialAccount.create({
      data: {
        platform: body.platform === "INSTAGRAM" ? "INSTAGRAM" : "YOUTUBE",
        name: body.name,
        url: body.url,
        order: Number(body.order) || 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(acc, { status: 201 });
  } catch (e) {
    console.error("social accounts POST error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
