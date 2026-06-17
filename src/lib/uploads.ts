import { existsSync } from "fs";
import { join } from "path";

/** Production VPS path — outside the repo so uploads survive deploys. */
export const PRODUCTION_UPLOAD_DIR = "/var/www/uploads";

/** Local dev storage — outside public/ so Next static files do not shadow /uploads routes. */
export const LOCAL_UPLOAD_DIR = join(process.cwd(), ".uploads");

/**
 * Resolve the directory where uploaded files are stored.
 * Priority: UPLOAD_DIR env → /var/www/uploads (if it exists) → .uploads (dev fallback).
 */
export function getUploadDir(): string {
  if (process.env.UPLOAD_DIR) return process.env.UPLOAD_DIR;
  if (existsSync(PRODUCTION_UPLOAD_DIR)) return PRODUCTION_UPLOAD_DIR;
  return LOCAL_UPLOAD_DIR;
}

/** Directories to search when serving an upload (primary + legacy public folder). */
export function getUploadSearchDirs(): string[] {
  const dirs = [getUploadDir()];
  const legacyPublic = join(process.cwd(), "public", "uploads");
  const legacyLocal = LOCAL_UPLOAD_DIR;
  if (!dirs.includes(legacyPublic)) dirs.push(legacyPublic);
  if (!dirs.includes(legacyLocal)) dirs.push(legacyLocal);
  if (
    process.env.UPLOAD_DIR &&
    existsSync(PRODUCTION_UPLOAD_DIR) &&
    !dirs.includes(PRODUCTION_UPLOAD_DIR)
  ) {
    dirs.push(PRODUCTION_UPLOAD_DIR);
  }
  return dirs;
}

export function toUploadUrl(fileName: string): string {
  return `/uploads/${fileName}`;
}

export const UPLOAD_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};
