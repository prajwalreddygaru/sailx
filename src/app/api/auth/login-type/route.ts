import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get("email")?.toLowerCase().trim() ?? "";
  return NextResponse.json({ isAdmin: isAdminEmail(email) });
}
