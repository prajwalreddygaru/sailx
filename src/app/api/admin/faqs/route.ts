import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

/* Admin — all FAQs including unanswered */
export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const unanswered = searchParams.get("unanswered") === "true";
    const where = unanswered ? { isAnswered: false } : {};
    const faqs = await prisma.faq.findMany({
      where,
      orderBy: [{ isAnswered: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

/* Admin — bulk reorder */
export async function PATCH(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    await prisma.$transaction(
      items.map((it: { id: string; order: number }) =>
        prisma.faq.update({ where: { id: it.id }, data: { order: it.order } })
      )
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reorder FAQs" }, { status: 500 });
  }
}
