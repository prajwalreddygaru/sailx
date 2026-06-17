import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }
    const normalizedEmail = String(email).toLowerCase().trim();

    if (isAdminEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Admin cannot sign up" }, { status: 403 });
    }

    const record = await prisma.otpCode.findFirst({
      where: {
        email: normalizedEmail,
        code: String(code).trim(),
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // Do not mark used here; registration will consume the code.
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
