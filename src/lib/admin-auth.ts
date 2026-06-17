/** Primary admin login email */
export const PRIMARY_ADMIN_EMAIL = "admin@rippleport.com";

/** Default admin password when ADMIN_PASSWORD env is unset */
const DEFAULT_ADMIN_PASSWORD = "Admin@Rippleport2026";

/** Verification code recipients (both receive the same code) */
export const ADMIN_VERIFICATION_RECIPIENTS = [
  "prajwaldomains@gmail.com",
  "saahilhussain735@gmail.com",
] as const;

/**
 * Admin login emails. Uses ADMIN_EMAILS (comma-separated) when set;
 * otherwise ADMIN_EMAIL or admin@rippleport.com.
 */
export function getAdminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS
    ?.split(",")
    .map((e) => e.toLowerCase().trim())
    .filter(Boolean);

  if (fromEnv?.length) return [...new Set(fromEnv)];

  const primary = process.env.ADMIN_EMAIL?.toLowerCase().trim() || PRIMARY_ADMIN_EMAIL;
  return [primary];
}

/** Emails that receive admin verification codes after password check */
export function getAdminVerificationEmails(): string[] {
  const fromEnv = process.env.ADMIN_VERIFICATION_EMAILS
    ?.split(",")
    .map((e) => e.toLowerCase().trim())
    .filter(Boolean);

  if (fromEnv?.length) return [...new Set(fromEnv)];

  return [...ADMIN_VERIFICATION_RECIPIENTS];
}

export function isAdminEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  return getAdminEmails().includes(normalized);
}

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return password === adminPassword;
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  return isAdminEmail(email) && verifyAdminPassword(password);
}
