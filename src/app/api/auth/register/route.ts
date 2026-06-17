import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  otp: z.string().min(4).max(8),
  role: z.enum(["BUYER", "AGENT", "SUPPLIER"]).default("BUYER"),
  address: z.string().optional(),
  occupation: z.string().optional(),
  dob: z.string().optional(),
  mobile: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  gstNumber: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const { name, email, password, otp, role, address, occupation, dob, mobile, company, phone, country, gstNumber } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Validate OTP before proceeding
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        code: otp.trim(),
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        address: address || null,
        occupation: occupation || null,
        dob: dob ? new Date(dob) : null,
        mobile: mobile || null,
        companyName: company,
        phone,
        country,
        gstNumber,
        // Provide required JSON defaults for role-specific profiles
        ...(role === "BUYER" && { buyer: { create: { sourcingCategories: [] } } }),
        ...(role === "AGENT" && { agent: { create: { specialization: [], languages: [] } } }),
        ...(role === "SUPPLIER" && { supplier: { create: { certifications: [] } } })
      }
    });

    // Mark OTP as used after successful creation
    await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
