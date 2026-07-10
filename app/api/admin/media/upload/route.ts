import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  uploadImageBuffer,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Set CLOUDINARY_* environment variables.",
      },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (
      !(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)
    ) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const alt = (form.get("alt") as string) || file.name;
    const result = await uploadImageBuffer(buffer);

    const media = await prisma.media.create({
      data: {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        alt,
        folder: process.env.CLOUDINARY_FOLDER || "bhootkosh",
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (e) {
    console.error("Upload error", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
