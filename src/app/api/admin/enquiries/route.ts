import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

// GET /api/admin/enquiries — list all enquiries with event details (admin only)
export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await db.eventEnquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: { select: { id: true, title: true, city: true, country: true } } },
  });
  return NextResponse.json(list);
}
