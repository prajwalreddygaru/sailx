import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const agents = await prisma.agent.findMany({
    where: status ? { onboardingStatus: status as any } : {},
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          country: true,
          phone: true,
          createdAt: true,
        },
      },
    },
    orderBy: { user: { createdAt: "desc" } },
  });

  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.name || !body.email) {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }
  try {
    const passwordHash = await bcrypt.hash(body.password || "Agent@123", 10);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: "AGENT",
        avatar: body.profileImage || null,
        country: body.country || null,
        phone: body.phone || null,
        agent: {
          create: {
            region: body.region || null,
            specialization: body.specialization ?? [],
            experience: parseInt(body.experience ?? "0"),
            bio: body.bio || null,
            languages: body.languages ?? [],
            rating: parseFloat(body.rating ?? "0"),
            profileImage: body.profileImage || null,
            responseTime: body.responseTime || null,
            onboardingStatus: "APPROVED",
            isOnline: false,
          },
        },
      },
      include: { agent: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agentId, status } = await req.json();

  if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const agent = await prisma.agent.update({
    where: { userId: agentId },
    data: { onboardingStatus: status },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json(agent);
}
