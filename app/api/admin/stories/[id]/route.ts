import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storySchema } from "@/lib/validators";
import { sanitizeSlug } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        tags: true,
        relatedGhosts: { select: { id: true, name: true } },
        region: true,
      },
    });
    if (!story) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(story);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = storySchema.safeParse({
      ...body,
      slug: sanitizeSlug(body.slug || body.title || ""),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const story = await prisma.story.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary || null,
        content: data.content || null,
        regionId: data.regionId || null,
        coverImage: data.coverImage || null,
        status: data.status,
        featured: data.featured,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        tags: { set: data.tagIds.map((tid) => ({ id: tid })) },
        relatedGhosts: {
          set: data.relatedGhostIds.map((rid) => ({ id: rid })),
        },
      },
    });
    return NextResponse.json(story);
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.story.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
