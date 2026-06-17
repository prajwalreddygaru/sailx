import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getUploadSearchDirs, UPLOAD_MIME } from "@/lib/uploads";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const fileName = path.join("/");

  if (fileName.includes("..") || fileName.includes("\\")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const contentType = UPLOAD_MIME[ext] || "application/octet-stream";

  for (const dir of getUploadSearchDirs()) {
    try {
      const buffer = await readFile(join(dir, fileName));
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // try next directory (e.g. legacy public/uploads)
    }
  }

  return new NextResponse("Not found", { status: 404 });
}
