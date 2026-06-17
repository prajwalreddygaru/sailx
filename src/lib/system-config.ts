import { prisma } from "@/lib/prisma";

export type SystemConfig = {
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpUser?: string | null;
  smtpPassword?: string | null; // never returned from API; used internally
  smtpFrom?: string | null;
  razorpayKeyId?: string | null;
  razorpayKeySecret?: string | null; // never returned from API; used internally
};

const db = prisma as any;

// In-memory fallback store (used if Prisma model isn't available). This will persist
// for the life of the server process. In production, create a SystemConfig table.
let memoryConfig: SystemConfig | null = null;

export async function getSystemConfig(): Promise<SystemConfig> {
  let row: any = null;
  try {
    if (db.systemConfig && typeof db.systemConfig.findFirst === "function") {
      row = await db.systemConfig.findFirst();
    }
  } catch {
    // Table or model may not exist yet; fall back to env
  }

  const fromDb: SystemConfig = row
    ? {
        smtpHost: row.smtpHost ?? null,
        smtpPort: row.smtpPort ?? null,
        smtpUser: row.smtpUser ?? null,
        smtpPassword: row.smtpPassword ?? null,
        smtpFrom: row.smtpFrom ?? null,
        razorpayKeyId: row.razorpayKeyId ?? null,
        razorpayKeySecret: row.razorpayKeySecret ?? null,
      }
    : {};

  return {
    smtpHost: (memoryConfig?.smtpHost ?? fromDb.smtpHost) ?? process.env.SMTP_HOST ?? "smtp.gmail.com",
    smtpPort: (memoryConfig?.smtpPort ?? fromDb.smtpPort) ?? (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587),
    smtpUser: (memoryConfig?.smtpUser ?? fromDb.smtpUser) ?? process.env.SMTP_USER ?? null,
    smtpPassword: (memoryConfig?.smtpPassword ?? fromDb.smtpPassword) ?? process.env.SMTP_PASSWORD ?? null,
    smtpFrom: (memoryConfig?.smtpFrom ?? fromDb.smtpFrom) ?? process.env.SMTP_FROM ?? "sailxchina <no-reply@sailxchina.com>",
    razorpayKeyId: (memoryConfig?.razorpayKeyId ?? fromDb.razorpayKeyId) ?? process.env.RAZORPAY_KEY_ID ?? null,
    razorpayKeySecret: (memoryConfig?.razorpayKeySecret ?? fromDb.razorpayKeySecret) ?? process.env.RAZORPAY_KEY_SECRET ?? null,
  };
}

export async function updateSystemConfig(input: SystemConfig): Promise<SystemConfig> {
  // Update in-memory fallback immediately (only provided keys)
  memoryConfig = { ...(memoryConfig ?? {}) };
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) (memoryConfig as any)[k] = v;
  }

  // Try to persist to DB if model exists
  try {
    if (db.systemConfig && typeof db.systemConfig.findFirst === "function") {
      const exists = await db.systemConfig.findFirst();
      const data: any = {};
      for (const [k, v] of Object.entries(input)) {
        if (v !== undefined) data[k] = v;
      }
      if (exists) {
        if (Object.keys(data).length) await db.systemConfig.update({ where: { id: exists.id }, data });
      } else {
        // On first create, write whatever fields were provided; others will be NULL by default
        await db.systemConfig.create({ data });
      }
    }
  } catch {
    // Silently ignore if table doesn't exist
  }

  return getSystemConfig();
}
