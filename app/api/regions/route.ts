import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { ghosts: true, hauntedPlaces: true, stories: true },
        },
      },
    });
    return NextResponse.json(regions);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
