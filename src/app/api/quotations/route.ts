import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  rfqId: z.string(),
  supplierId: z.string(),
  unitPrice: z.number().positive(),
  moq: z.number().int().positive(),
  leadTime: z.string(),
  totalPrice: z.number().positive(),
  currency: z.string().default("USD"),
  certifications: z.array(z.string()).default([]),
  notes: z.string().optional()
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agentId = (session.user as any).id as string;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const q = await prisma.quotation.create({ data: { ...parsed.data, agentId } });
  await prisma.rFQ.update({
    where: { id: parsed.data.rfqId },
    data: { status: "QUOTATIONS_RECEIVED" }
  });
  return NextResponse.json(q);
}
