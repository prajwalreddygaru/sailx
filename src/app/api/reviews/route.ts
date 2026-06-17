import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

/* Public — visible reviews only */
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

/* Admin only */
export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json();
    const review = await prisma.review.create({
      data: {
        name: body.name,
        subtitle: body.subtitle ?? null,
        email: body.email ?? null,
        rating: Math.max(1, Math.min(5, Number(body.rating) || 5)),
        text: body.text,
        profileImage: body.profileImage ?? null,
        isVisible: body.isVisible ?? true,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (e) {
    console.error("Review create error:", e);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
