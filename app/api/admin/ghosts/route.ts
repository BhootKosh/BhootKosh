import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ghostSchema } from "@/lib/validators";
import { sanitizeSlug, getPagination } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q") || "";
    const status = sp.get("status") || "";
    const page = Number(sp.get("page") || "1");
    const { skip, take, page: currentPage, pageSize } = getPagination(page, 20);

    const where: Prisma.GhostWhereInput = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
      ];
    }
    if (status === "DRAFT" || status === "PUBLISHED") {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.ghost.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take,
        include: {
          region: { select: { name: true } },
          tags: true,
        },
      }),
      prisma.ghost.count({ where }),
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
    const parsed = ghostSchema.safeParse({
      ...body,
      slug: sanitizeSlug(body.slug || body.name || ""),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const ghost = await prisma.ghost.create({
      data: {
        name: data.name,
        slug: data.slug,
        otherNames: data.otherNames,
        type: data.type,
        regionId: data.regionId || null,
        state: data.state || null,
        dangerLevel: data.dangerLevel,
        habitat: data.habitat || null,
        appearance: data.appearance || null,
        behavior: data.behavior || null,
        origin: data.origin || null,
        summary: data.summary || null,
        fullDescription: data.fullDescription || null,
        culturalNotes: data.culturalNotes || null,
        sources: data.sources || null,
        image: data.image || null,
        gallery: data.gallery,
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

    return NextResponse.json(ghost, { status: 201 });
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
