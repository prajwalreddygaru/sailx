import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

// POST /api/enquiries — create a general enquiry (not tied to any event)
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();
    if (!name || (!email && !phone)) {
      return NextResponse.json({ error: "Provide your name and at least one contact (email or phone)" }, { status: 400 });
    }
    const created = await db.eventEnquiry.create({
      data: {
        eventId: null,
        name: String(name),
        email: email ?? null,
        phone: phone ?? null,
        message: message ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 });
  }
}
