import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPagination } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sp = req.nextUrl.searchParams;
    const status = sp.get("status") || "";
    const page = Number(sp.get("page") || "1");
    const { skip, take, page: currentPage, pageSize } = getPagination(page, 20);

    const where: Prisma.SubmissionWhereInput = {};
    if (
      status === "PENDING" ||
      status === "APPROVED" ||
      status === "REJECTED"
    ) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.submission.count({ where }),
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
