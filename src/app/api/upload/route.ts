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

    // 1. If Cloudinary URL is configured, use Cloudinary (Preferred Production Storage)
    if (process.env.CLOUDINARY_URL) {
      const cloudinary = (await import("cloudinary")).v2;
      
      const base64Data = buffer.toString("base64");
      const fileUri = `data:${file.type};base64,${base64Data}`;
      
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: "portfolio_showcase",
        public_id: sanitizedFileName.split(".")[0] + `_${timestamp}`,
      });
      
      return NextResponse.json({ success: true, url: result.secure_url });
    }

    // 2. Fallback: If Vercel Blob token is set, use Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${uniqueFileName}`, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // 3. Fallback: Local File System (Local Development)
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filePath = join(uploadsDir, uniqueFileName);
    await writeFile(filePath, buffer);
    
    const url = `/uploads/${uniqueFileName}`;

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file." },
      { status: 500 }
    );
  }
}
