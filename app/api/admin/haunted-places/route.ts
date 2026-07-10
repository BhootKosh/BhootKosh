import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hauntedPlaceSchema } from "@/lib/validators";
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
    const page = Number(sp.get("page") || "1");
    const { skip, take, page: currentPage, pageSize } = getPagination(page, 20);

    const where: Prisma.HauntedPlaceWhereInput = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.hauntedPlace.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take,
        include: { region: { select: { name: true } } },
      }),
      prisma.hauntedPlace.count({ where }),
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
    const parsed = hauntedPlaceSchema.safeParse({
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
    const place = await prisma.hauntedPlace.create({
      data: {
        name: data.name,
        slug: data.slug,
        location: data.location || null,
        state: data.state || null,
        regionId: data.regionId || null,
        history: data.history || null,
        legend: data.legend || null,
        reportedActivity: data.reportedActivity || null,
        warning: data.warning || null,
        images: data.images,
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

    return NextResponse.json(place, { status: 201 });
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
