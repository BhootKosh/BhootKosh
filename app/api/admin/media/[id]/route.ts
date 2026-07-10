import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteCloudinaryImage, isCloudinaryConfigured } from "@/lib/cloudinary";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (isCloudinaryConfigured()) {
      try {
        await deleteCloudinaryImage(media.publicId);
      } catch {
        // continue deleting DB row even if cloudinary fails
      }
    }

    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
