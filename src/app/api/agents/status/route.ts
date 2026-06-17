import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { isOnline } = await req.json();

  const agent = await prisma.agent.update({
    where: { userId: (token.id as string) ?? token.sub },
    data: {
      isOnline: Boolean(isOnline),
      onlineAt: isOnline ? new Date() : null,
    },
    include: { user: { select: { name: true, email: true, avatar: true } } },
  });

  return NextResponse.json({ isOnline: agent.isOnline, onlineAt: agent.onlineAt });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  // Authenticated agent fetching their own status
  if (!all) {
    const token = await authToken(req);
    if (token && token.role === "AGENT") {
      const agent = await prisma.agent.findUnique({
        where: { userId: (token.id as string) ?? token.sub },
        select: { isOnline: true, onlineAt: true },
      });
      return NextResponse.json(agent ?? { isOnline: false });
    }
  }

  // Public: all approved agents (used by marketing page)
  const agents = await prisma.agent.findMany({
    where: {
      onboardingStatus: "APPROVED",
      ...(all ? {} : { isOnline: true }),
    },
    include: {
      user: {
        select: { id: true, name: true, avatar: true, country: true },
      },
    },
    orderBy: [{ isOnline: "desc" }, { onlineAt: "desc" }],
  });

  return NextResponse.json(agents);
}
