import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const db = prisma as any;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const c = await db.consultation.create({
      data: {
        firstName: String(body.firstName || "").trim(),
        lastName: String(body.lastName || "").trim(),
        email: String(body.email || "").trim(),
        phone: String(body.phone || "").trim(),
        country: String(body.country || "").trim(),
        businessStage: String(body.businessStage || "").trim(),
        message: (body.message ?? "").slice(0, 5000),
        mode: body.mode === "MANAGE" ? "MANAGE" : "FIND",
        service: body.service ? String(body.service).slice(0, 120) : null,
      },
    });
    return NextResponse.json({ id: c.id }, { status: 201 });
  } catch (e) {
    console.error("Consultation create error", e);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
