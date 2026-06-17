import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cfg = await (prisma as any).socialConfig.findFirst();
    const accounts = await (prisma as any).socialAccount.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    const youtubeChannels = accounts.filter((a: any) => a.platform === "YOUTUBE");
    const instagramAccounts = accounts.filter((a: any) => a.platform === "INSTAGRAM");
    return NextResponse.json({
      youtubeVideoUrl: cfg?.youtubeVideoUrl ?? null,
      youtubeAltVideoUrl: cfg?.youtubeAltVideoUrl ?? null,
      instagramReelUrl: cfg?.instagramReelUrl ?? null,
      youtubeChannels,
      instagramAccounts,
    });
  } catch (e) {
    console.error("social GET error", e);
    return NextResponse.json({ error: "Failed to fetch social media data" }, { status: 500 });
  }
}
