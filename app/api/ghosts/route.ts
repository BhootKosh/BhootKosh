import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPagination,
  DANGER_LEVELS,
  GHOST_TYPES,
} from "@/lib/utils";
import type { DangerLevel, GhostType, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q") || "";
    const type = sp.get("type") || "";
    const region = sp.get("region") || "";
    const danger = sp.get("danger") || "";
    const habitat = sp.get("habitat") || "";
    const sort = sp.get("sort") || "newest";
    const page = Number(sp.get("page") || "1");
    const { skip, take, page: currentPage, pageSize } = getPagination(page, 12);

    const where: Prisma.GhostWhereInput = { status: "PUBLISHED" };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ];
    }
    if (type && (GHOST_TYPES as readonly string[]).includes(type)) {
      where.type = type as GhostType;
    }
    if (danger && (DANGER_LEVELS as readonly string[]).includes(danger)) {
      where.dangerLevel = danger as DangerLevel;
    }
    if (habitat) where.habitat = { contains: habitat, mode: "insensitive" };
    if (region) where.region = { slug: region };

    let orderBy: Prisma.GhostOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "name") orderBy = { name: "asc" };
    if (sort === "popularity") orderBy = { viewCount: "desc" };

    const [items, total] = await Promise.all([
      prisma.ghost.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { region: { select: { name: true, slug: true } } },
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
