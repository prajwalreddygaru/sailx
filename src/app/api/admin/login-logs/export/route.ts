import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
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
    const items: any[] = await (prisma as any).loginLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 5000, // hard-limit export size
    });

    const header = ["timestamp","email","userId","mode","status","ip","userAgent"];
    const rows = items.map((it) => [
      new Date(it.createdAt).toISOString(),
      it.email ?? "",
      it.userId ?? "",
      it.mode ?? "",
      it.status ?? "",
      it.ip ?? "",
      (it.userAgent || "").replace(/\"/g, '"').replace(/\n|\r/g, ' ')
    ]);

    const csv = [header, ...rows]
      .map(cols => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const filename = `login-logs-${new Date().toISOString().slice(0,10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=${filename}`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to export logs" }, { status: 500 });
  }
}
