import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const memories = await (prisma as any).memory.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: { imageUrl: true },
    });
    const urls = memories.map((m: any) => m.imageUrl).filter(Boolean);
    return NextResponse.json(urls);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}
