/** Public site URL — set NEXT_PUBLIC_APP_URL in production (e.g. https://sailxchina.com). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "") ||
  "https://sailxchina.com";

/** Build a redirect URL on the current browser origin (safe path join, no new URL() quirks). */
export function sameOriginPath(path = "/"): string {
  if (typeof window === "undefined") return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${window.location.protocol}//${window.location.host}${normalized}`;
}
