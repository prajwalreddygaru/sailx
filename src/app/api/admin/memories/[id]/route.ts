import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

const db = prisma as any;

// PATCH /api/admin/memories/[id] — update memory
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, imageUrl, order, active } = body;

  try {
    const memory = await db.memory.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });
    return NextResponse.json(memory);
  } catch (e: any) {
    console.error("[PATCH /api/admin/memories/[id]]", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/memories/[id] — delete memory
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await db.memory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[DELETE /api/admin/memories/[id]]", e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}
