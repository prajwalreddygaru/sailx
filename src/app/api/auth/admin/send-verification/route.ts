import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAdminVerificationEmail } from "@/lib/email";
import { getSystemConfig } from "@/lib/system-config";
import { getAdminVerificationEmails, verifyAdminCredentials } from "@/lib/admin-auth";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!verifyAdminCredentials(normalizedEmail, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await prisma.otpCode.updateMany({
    where: { email: normalizedEmail, used: false },
    data: { used: true },
  });

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otpCode.create({
    data: { email: normalizedEmail, code, expiresAt },
  });

  const recipients = getAdminVerificationEmails();
  await Promise.all(
    recipients.map((to) => sendAdminVerificationEmail(to, code, normalizedEmail))
  );

  const cfg = await getSystemConfig();
  const devMode = !cfg.smtpUser;
  return NextResponse.json({ ok: true, ...(devMode ? { devOtp: code } : {}) });
}
