import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
  if (!q) return NextResponse.json({ events: [], catalogue: [] });

  try {
    const events = await (prisma as any).event.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { city: { contains: q } },
          { country: { contains: q } },
        ],
      },
      orderBy: { startDate: "asc" },
      take: 5,
    });

    const catalogue = await (prisma as any).catalogueItem.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
        isActive: true,
      },
      orderBy: { order: "asc" },
      take: 5,
    });

    return NextResponse.json({ events, catalogue });
  } catch (e) {
    console.error("[GET /api/search]", e);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
