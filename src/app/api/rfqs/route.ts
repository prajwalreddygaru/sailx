import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  quantity: z.number().int().positive(),
  moq: z.number().int().nonnegative().optional(),
  budget: z.number().nonnegative(),
  currency: z.string().default("USD"),
  deliveryTimeline: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM")
});

function code() {
  const n = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return `RFQ-${new Date().getFullYear()}-${n}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;

  const rfqs = await prisma.rFQ.findMany({
    where: role === "AGENT" ? { agentId: userId } : { buyerId: userId },
    orderBy: { updatedAt: "desc" },
    include: { quotations: true, attachments: true }
  });
  return NextResponse.json(rfqs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });

  const rfq = await prisma.rFQ.create({
    data: { ...parsed.data, code: code(), buyerId: userId, status: "PENDING" }
  });
  return NextResponse.json(rfq);
}
