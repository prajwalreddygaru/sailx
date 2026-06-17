import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

function parseBool(v: string | null | undefined): boolean | undefined {
  if (v == null) return undefined;
  return v === "1" || v.toLowerCase() === "true" ? true : v.toLowerCase() === "false" ? false : undefined;
}

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get("pageSize") || "25", 10)));
  const q = (searchParams.get("q") || "").trim();
  const status = (searchParams.get("status") || "").toUpperCase();
  const mode = (searchParams.get("mode") || "").toUpperCase();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = { AND: [] };
  if (q) {
    where.AND.push({ OR: [
      { email: { contains: q } },
      { ip:    { contains: q } },
      { userAgent: { contains: q } },
    ]});
  }
  if (status === "SUCCESS" || status === "FAILURE") {
    where.AND.push({ status });
  }
  if (mode === "ADMIN" || mode === "OTP" || mode === "PASSWORD") {
    where.AND.push({ mode });
  }
  if (from || to) {
    where.AND.push({ createdAt: {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }});
  }

  if (!where.AND.length) delete where.AND;

  try {
    const [items, total] = await Promise.all([
      (prisma as any).loginLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      (prisma as any).loginLog.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
