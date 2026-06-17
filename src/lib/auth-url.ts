import type { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/site-url";

function isLocalhostUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);
}

function envSiteUrl(): string | undefined {
  const candidates = [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
  ];
  for (const value of candidates) {
    const trimmed = value?.trim().replace(/\/$/, "");
    if (trimmed && !isLocalhostUrl(trimmed)) return trimmed;
  }
  return undefined;
}

/** Resolve the public site URL for NextAuth redirects (sign-out, callbacks, etc.). */
export function resolveAuthUrl(req?: NextRequest): string {
  if (req) {
    const host =
      req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      req.headers.get("host");

    if (host) {
      const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
      const proto =
        forwardedProto ||
        req.nextUrl.protocol.replace(":", "") ||
        (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
      return `${proto}://${host}`;
    }
  }

  const fromEnv = envSiteUrl();
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  const fallback = process.env.NEXTAUTH_URL?.trim().replace(/\/$/, "");
  if (fallback && !isLocalhostUrl(fallback)) return fallback;
  if (process.env.NODE_ENV === "production") return SITE_URL;
  return fallback || "http://localhost:3000";
}