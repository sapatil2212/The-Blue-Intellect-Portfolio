import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique name: timestamp + sanitized original name
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${timestamp}-${sanitizedFileName}`;

    // 1. If Vercel Blob token is set, use Vercel Blob (Production Storage)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${uniqueFileName}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // 2. Otherwise, fallback to Local File System (Local Development)
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filePath = join(uploadsDir, uniqueFileName);
    await writeFile(filePath, buffer);
    
    const url = `/uploads/${uniqueFileName}`;

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Local file upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
