import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { slug } = await params;
    const place = await prisma.hauntedPlace.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        region: true,
        tags: true,
        relatedGhosts: { where: { status: "PUBLISHED" }, take: 6 },
        relatedStories: { where: { status: "PUBLISHED" }, take: 3 },
      },
    });
    if (!place) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(place);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
