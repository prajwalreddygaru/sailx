import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isAdminEmail, verifyAdminPassword } from "@/lib/admin-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
        otp:      { label: "OTP",      type: "text"     },
        mode:     { label: "Mode",     type: "text"     },
      },
      async authorize(credentials, req: any) {
        if (!credentials?.email) return null;
        const email = credentials.email.toLowerCase().trim();

        async function logAttempt(data: {
          email: string;
          mode: "ADMIN" | "OTP" | "PASSWORD";
          status: "SUCCESS" | "FAILURE";
          userId?: string | null;
          ip?: string | null;
          userAgent?: string | null;
        }) {
          try {
            await (prisma as any).loginLog.create({
              data: {
                email: data.email,
                mode: data.mode,
                status: data.status,
                userId: data.userId ?? null,
                ip: data.ip ?? null,
                userAgent: data.userAgent ?? null,
              },
            });
          } catch (err) {
            // swallow logging errors
          }
        }

        const getHeader = (name: string): string | undefined => {
          try {
            if (typeof req?.headers?.get === "function") return req.headers.get(name) || undefined;
            if (req?.headers && typeof req.headers === "object") return req.headers[name] || req.headers[name.toLowerCase()];
          } catch {}
          return undefined;
        };
        const ip = (getHeader("x-forwarded-for") || getHeader("x-real-ip") || "")?.split(",")[0]?.trim() || undefined;
        const userAgent = getHeader("user-agent");

        // ── ADMIN LOGIN ──────────────────────────────────────────
        if (credentials.mode === "admin") {
          if (!isAdminEmail(email) || !verifyAdminPassword(credentials.password || "")) {
            await logAttempt({ email, mode: "ADMIN", status: "FAILURE", ip, userAgent });
            return null;
          }

          if (!credentials.otp) {
            await logAttempt({ email, mode: "ADMIN", status: "FAILURE", ip, userAgent });
            return null;
          }

          const otpRecord = await prisma.otpCode.findFirst({
            where: {
              email,
              code:      credentials.otp.trim(),
              used:      false,
              expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
          });
          if (!otpRecord) {
            await logAttempt({ email, mode: "ADMIN", status: "FAILURE", ip, userAgent });
            return null;
          }

          await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });

          const admin = await prisma.user.upsert({
            where:  { email },
            create: { email, name: "Admin", role: "ADMIN" },
            update: { role: "ADMIN" },
          });
          await logAttempt({ email, mode: "ADMIN", status: "SUCCESS", userId: admin.id, ip, userAgent });
          return { id: admin.id, email: admin.email, name: admin.name, role: "ADMIN" } as any;
        }

        // ── USER PASSWORD LOGIN ───────────────────────────────────
        if (credentials.mode === "password") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user?.passwordHash) {
            await logAttempt({ email, mode: "PASSWORD", status: "FAILURE", ip, userAgent });
            return null;
          }
          const ok = await bcrypt.compare(credentials.password || "", user.passwordHash);
          if (!ok) {
            await logAttempt({ email, mode: "PASSWORD", status: "FAILURE", ip, userAgent });
            return null;
          }
          await logAttempt({ email, mode: "PASSWORD", status: "SUCCESS", userId: user.id, ip, userAgent });
          return { id: user.id, email: user.email, name: user.name, role: user.role, profileComplete: user.profileComplete } as any;
        }

        // ── USER OTP LOGIN ────────────────────────────────────────
        if (credentials.mode === "otp") {
          if (!credentials.otp) return null;

          const record = await prisma.otpCode.findFirst({
            where: {
              email,
              code:      credentials.otp.trim(),
              used:      false,
              expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
          });
          if (!record) {
            await logAttempt({ email, mode: "OTP", status: "FAILURE", ip, userAgent });
            return null;
          }

          // Mark OTP as used
          await prisma.otpCode.update({ where: { id: record.id }, data: { used: true } });

          // Upsert user into DB
          const user = await (prisma as any).user.upsert({
            where:  { email },
            create: { email, name: email.split("@")[0], role: "BUYER", profileComplete: false },
            update: { emailVerified: new Date() },
          });
          await logAttempt({ email, mode: "OTP", status: "SUCCESS", userId: user.id, ip, userAgent });
          return { id: user.id, email: user.email, name: user.name, role: user.role, profileComplete: user.profileComplete } as any;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role           = (user as any).role;
        (token as any).id             = (user as any).id;
        (token as any).profileComplete = (user as any).profileComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id             = (token as any).id;
        (session.user as any).role           = (token as any).role;
        (session.user as any).profileComplete = (token as any).profileComplete;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  logger: {
    error: (code: string, ...message: any[]) => {
      if (code === "CLIENT_FETCH_ERROR" && process.env.NODE_ENV === "development") return;
      console.error(`[next-auth][error][${code}]`, ...message);
    },
    warn: (code: string, ...message: any[]) => {
      console.warn(`[next-auth][warn][${code}]`, ...message);
    },
    debug: (code: string, ...message: any[]) => {
      // eslint-disable-next-line no-console
      console.log(`[next-auth][debug][${code}]`, ...message);
    },
  },
};
