import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q") || "";
    const region = sp.get("region") || "";
    const tag = sp.get("tag") || "";
    const page = Number(sp.get("page") || "1");
    const { skip, take, page: currentPage, pageSize } = getPagination(page, 9);

    const where: Prisma.StoryWhereInput = { status: "PUBLISHED" };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }
    if (region) where.region = { slug: region };
    if (tag) where.tags = { some: { slug: tag } };

    const [items, total] = await Promise.all([
      prisma.story.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          region: { select: { name: true, slug: true } },
          tags: true,
        },
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
