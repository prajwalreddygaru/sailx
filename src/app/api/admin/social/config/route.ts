import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authToken } from "@/lib/auth-token";

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const cfg = await prisma.socialConfig.findFirst();
    return NextResponse.json(cfg ?? null);
  } catch (e) {
    console.error("social config GET error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const exists = await prisma.socialConfig.findFirst();
    const data = {
      youtubeVideoUrl: (body.youtubeVideoUrl ?? "").trim() || null,
      youtubeAltVideoUrl: (body.youtubeAltVideoUrl ?? "").trim() || null,
      instagramReelUrl: (body.instagramReelUrl ?? "").trim() || null,
      adminId: (token as any).id,
    } as any;
    const cfg = exists
      ? await prisma.socialConfig.update({ where: { id: exists.id }, data })
      : await prisma.socialConfig.create({ data });
    return NextResponse.json(cfg);
  } catch (e) {
    console.error("social config PUT error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
