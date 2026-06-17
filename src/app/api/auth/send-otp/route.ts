import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { getSystemConfig } from "@/lib/system-config";
import { isAdminEmail } from "@/lib/admin-auth";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const normalizedEmail = email.toLowerCase().trim();

  // Block admin emails from user OTP signup flow
  if (isAdminEmail(normalizedEmail)) {
    return NextResponse.json({ error: "Use password to login" }, { status: 403 });
  }

  // Invalidate old codes for this email
  await prisma.otpCode.updateMany({
    where: { email: normalizedEmail, used: false },
    data: { used: true },
  });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.otpCode.create({
    data: { email: normalizedEmail, code, expiresAt },
  });

  await sendOtpEmail(normalizedEmail, code);

  const cfg = await getSystemConfig();
  const devMode = !cfg.smtpUser;
  return NextResponse.json({ ok: true, ...(devMode ? { devOtp: code } : {}) });
}
