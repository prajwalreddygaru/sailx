import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

// POST /api/events/[id]/enquiries — public create enquiry
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, email, phone, message } = await req.json();
  if (!name || (!email && !phone))
    return NextResponse.json({ error: "Provide your name and at least one contact (email or phone)" }, { status: 400 });

  const e = await db.eventEnquiry.create({
    data: { eventId: id, name: String(name), email: email ?? null, phone: phone ?? null, message: message ?? null },
  });
  return NextResponse.json(e, { status: 201 });
}

// GET /api/events/[id]/enquiries — admin view enquiries for an event
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const list = await db.eventEnquiry.findMany({ where: { eventId: id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(list);
}
