import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

// GET /api/chat?agentId=xxx  → get or create conversation + messages (buyer flow)
// GET /api/chat?convoId=xxx  → fetch existing conversation by ID (agent flow)
export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId  = (token as any).id as string;
  const { searchParams } = new URL(req.url);
  const agentId  = searchParams.get("agentId");
  const convoId  = searchParams.get("convoId");

  // Agent opens an existing conversation by ID
  if (convoId) {
    const convo = await prisma.conversation.findFirst({
      where: { id: convoId, participants: { some: { id: userId } } },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
        participants: { select: { id: true, name: true, role: true, avatar: true } },
      },
    });
    if (!convo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.message.updateMany({
      where: { conversationId: convo.id, senderId: { not: userId }, read: false },
      data: { read: true },
    });
    return NextResponse.json(convo);
  }

  if (!agentId) return NextResponse.json({ error: "agentId or convoId required" }, { status: 400 });

  // Find existing conversation between user and agent
  let convo = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: userId } } },
        { participants: { some: { id: agentId } } },
      ],
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, role: true } } },
      },
      participants: { select: { id: true, name: true, role: true, avatar: true } },
    },
  });

  if (!convo) {
    convo = await prisma.conversation.create({
      data: { participants: { connect: [{ id: userId }, { id: agentId }] } },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
        participants: { select: { id: true, name: true, role: true, avatar: true } },
      },
    });
  }

  // Mark messages as read
  await prisma.message.updateMany({
    where: { conversationId: convo.id, senderId: { not: userId }, read: false },
    data: { read: true },
  });

  return NextResponse.json(convo);
}

// POST /api/chat  → send a message
export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const senderId = (token as any).id as string;
  const { conversationId, content, attachments } = await req.json();

  if (!conversationId || !content?.trim()) {
    return NextResponse.json({ error: "conversationId and content required" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content: content.trim(),
      attachments: attachments || null,
    },
    include: { sender: { select: { id: true, name: true, role: true } } },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(message, { status: 201 });
}
