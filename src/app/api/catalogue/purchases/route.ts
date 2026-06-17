import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (token as any).id as string;

  const purchases = await db.cataloguePurchase.findMany({
    where: { userId },
    include: { item: { select: { title: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(purchases);
}
