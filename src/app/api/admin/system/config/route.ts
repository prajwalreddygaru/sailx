import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { getSystemConfig, updateSystemConfig } from "@/lib/system-config";

function sanitize(cfg: any) {
  return {
    smtpHost: cfg.smtpHost ?? null,
    smtpPort: cfg.smtpPort ?? null,
    smtpUser: cfg.smtpUser ?? null,
    smtpFrom: cfg.smtpFrom ?? null,
    razorpayKeyId: cfg.razorpayKeyId ?? null,
    // booleans to indicate if a secret is set without revealing it
    hasSmtpPassword: !!cfg.smtpPassword,
    hasRazorpayKeySecret: !!cfg.razorpayKeySecret,
  };
}

export async function GET(req: NextRequest) {
  const token = await authToken(req);
  if (!token || (token as any).role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const cfg = await getSystemConfig();
    return NextResponse.json(sanitize(cfg));
  } catch (e) {
    return NextResponse.json({ error: "Failed to load config" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await authToken(req);
  if (!token || (token as any).role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = await req.json();
    const input = {
      smtpHost: typeof body.smtpHost === "string" ? body.smtpHost.trim() : undefined,
      smtpPort: body.smtpPort != null ? Number(body.smtpPort) : undefined,
      smtpUser: typeof body.smtpUser === "string" ? body.smtpUser.trim() : undefined,
      smtpPassword: typeof body.smtpPassword === "string" ? body.smtpPassword : undefined,
      smtpFrom: typeof body.smtpFrom === "string" ? body.smtpFrom.trim() : undefined,
      razorpayKeyId: typeof body.razorpayKeyId === "string" ? body.razorpayKeyId.trim() : undefined,
      razorpayKeySecret: typeof body.razorpayKeySecret === "string" ? body.razorpayKeySecret : undefined,
    } as any;

    const updated = await updateSystemConfig(input);
    return NextResponse.json(sanitize(updated));
  } catch (e) {
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
