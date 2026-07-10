import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q") || "";
    const region = sp.get("region") || "";
    const page = Number(sp.get("page") || "1");
    const { skip, take, page: currentPage, pageSize } = getPagination(page, 12);

    const where: Prisma.HauntedPlaceWhereInput = { status: "PUBLISHED" };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ];
    }
    if (region) where.region = { slug: region };

    const [items, total] = await Promise.all([
      prisma.hauntedPlace.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take,
        include: { region: { select: { name: true, slug: true } } },
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
