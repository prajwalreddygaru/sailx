import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (token as any).id as string;
  const body = await req.json();

  const { name, surname, mobile, age, occupation, dob } = body;

  const updated = await (prisma as any).user.update({
    where: { id: userId },
    data: {
      name:            name?.trim()       || undefined,
      surname:         surname?.trim()    || undefined,
      mobile:          mobile?.trim()     || undefined,
      age:             age ? parseInt(age) : undefined,
      occupation:      occupation?.trim() || undefined,
      dob:             dob ? new Date(dob) : undefined,
      profileComplete: true,
    },
  });

  return NextResponse.json({ ok: true, name: updated.name });
}

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (token as any).id as string;
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, surname: true, email: true,
      mobile: true, age: true, occupation: true, dob: true,
      profileComplete: true, avatar: true,
    },
  });

  return NextResponse.json(user);
}
