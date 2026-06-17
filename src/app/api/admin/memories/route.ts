import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

// GET /api/admin/memories — list all memories
export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const memories = await db.memory.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(memories);
  } catch (e: any) {
    console.error("[GET /api/admin/memories]", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

// POST /api/admin/memories — create memory
export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, imageUrl, order } = body;

  if (!imageUrl || typeof imageUrl !== "string") {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  try {
    const memory = await db.memory.create({
      data: {
        title: title || null,
        imageUrl,
        order: typeof order === "number" ? order : 0,
      },
    });
    return NextResponse.json(memory);
  } catch (e: any) {
    console.error("[POST /api/admin/memories]", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}
