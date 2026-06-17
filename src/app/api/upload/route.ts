import { NextRequest, NextResponse } from "next/server";
import { authToken } from "@/lib/auth-token";
import { getUploadDir, toUploadUrl } from "@/lib/uploads";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req: NextRequest) {
  const token = await authToken(req);
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    console.warn("[upload] Rejected type:", file.type, "name:", file.name);
    return NextResponse.json(
      { error: `Only ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")} images are allowed` },
      { status: 400 }
    );
  }

  const maxBytes = MAX_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    console.warn("[upload] Rejected oversized:", file.name, file.size);
    return NextResponse.json(
      { error: `File too large. Max ${MAX_SIZE_MB}MB allowed.` },
      { status: 400 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = getUploadDir();
    const filePath = join(uploadDir, safeName);

    console.log("[upload] Writing to:", filePath, "size:", buffer.length);

    await mkdir(uploadDir, { recursive: true, mode: 0o755 });
    await writeFile(filePath, buffer);

    const fs = await import("fs/promises");
    const stat = await fs.stat(filePath);
    console.log("[upload] Saved:", safeName, "bytes:", stat.size);

    return NextResponse.json({ url: toUploadUrl(safeName) }, { status: 201 });
  } catch (e: any) {
    console.error("[upload] Fatal error:", e);
    return NextResponse.json(
      { error: e.message || "Upload failed. Check server logs." },
      { status: 500 }
    );
  }
}
