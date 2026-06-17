import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/** Drop-in replacement for getToken that always passes NEXTAUTH_SECRET explicitly */
export function authToken(req: NextRequest) {
  return getToken({ req, secret: process.env.NEXTAUTH_SECRET });
}
