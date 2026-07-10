import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storySchema } from "@/lib/validators";
import { sanitizeSlug, getPagination } from "@/lib/utils";
import { revalidateArchive } from "@/lib/cache";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q") || "";
    const page = Number(sp.get("page") || "1");
    const { skip, take, page: currentPage, pageSize } = getPagination(page, 20);
    const where: Prisma.StoryWhereInput = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
      ];
    }
    const [items, total] = await Promise.all([
      prisma.story.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take,
        include: { region: { select: { name: true } } },
      }),
      prisma.story.count({ where }),
    ]);
    return NextResponse.json({
      items,
      total,
      page: currentPage,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
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
    const story = await prisma.story.create({
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
        tags: data.tagIds.length
          ? { connect: data.tagIds.map((id) => ({ id })) }
          : undefined,
        relatedGhosts: data.relatedGhostIds.length
          ? { connect: data.relatedGhostIds.map((id) => ({ id })) }
          : undefined,
      },
    });
    revalidateArchive("home", "stories", "regions");
    return NextResponse.json(story, { status: 201 });
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
