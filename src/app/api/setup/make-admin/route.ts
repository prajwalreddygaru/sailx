import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * One-time endpoint to promote a user to ADMIN.
 * Only works when NO admin exists yet in the database.
 * POST /api/setup/make-admin  { "email": "you@example.com" }
 */
export async function POST(req: NextRequest) {
  // Block if an admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  if (existingAdmin) {
    return NextResponse.json(
      { error: "An admin already exists. This endpoint is disabled." },
      { status: 403 }
    );
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json({
    success: true,
    message: `${user.email} is now ADMIN. Sign out and sign back in to apply the new role.`,
    user,
  });
}
