import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [ghosts, places, stories] = await Promise.all([
      prisma.ghost.findMany({
        where: { status: "PUBLISHED", featured: true },
        take: 6,
        include: { region: { select: { name: true, slug: true } } },
      }),
      prisma.hauntedPlace.findMany({
        where: { status: "PUBLISHED", featured: true },
        take: 3,
      }),
      prisma.story.findMany({
        where: { status: "PUBLISHED", featured: true },
        take: 3,
      }),
    ]);
    return NextResponse.json({ ghosts, places, stories });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
