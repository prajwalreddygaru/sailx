import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

// GET /api/chat/conversations  → list all conversations for the logged-in user
export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (token as any).id as string;

  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { id: userId } } },
    include: {
      participants: { select: { id: true, name: true, role: true, avatar: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { sender: { select: { id: true, name: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Shape: add `other` participant and unread count for convenience
  const shaped = await Promise.all(
    conversations.map(async (c) => {
      const other = c.participants.find((p) => p.id !== userId);
      const unread = await prisma.message.count({
        where: { conversationId: c.id, senderId: { not: userId }, read: false },
      });
      return {
        id: c.id,
        updatedAt: c.updatedAt,
        other,
        lastMessage: c.messages[0] ?? null,
        unread,
      };
    })
  );

  return NextResponse.json(shaped);
}
