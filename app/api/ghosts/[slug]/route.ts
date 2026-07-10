import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { slug } = await params;
    const ghost = await prisma.ghost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        region: true,
        tags: true,
        relatedGhosts: {
          where: { status: "PUBLISHED" },
          take: 6,
        },
      },
    });
    if (!ghost) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(ghost);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
