import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* Public — visible + answered FAQs */
export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isVisible: true, isAnswered: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

/* Public — submit a question */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const faq = await prisma.faq.create({
      data: {
        question: body.question,
        askedBy: body.askedBy ?? null,
        askedByEmail: body.askedByEmail ?? null,
        isAnswered: false,
        isVisible: false,
      },
    });
    return NextResponse.json(faq, { status: 201 });
  } catch (e) {
    console.error("FAQ create error:", e);
    return NextResponse.json({ error: "Failed to submit question" }, { status: 500 });
  }
}
