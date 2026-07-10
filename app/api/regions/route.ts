import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: "asc" },
    });

    const items = await Promise.all(
      regions.map(async (region) => {
        const [ghosts, hauntedPlaces, stories] = await Promise.all([
          prisma.ghost.count({
            where: { status: "PUBLISHED", regionId: region.id },
          }),
          prisma.hauntedPlace.count({
            where: { status: "PUBLISHED", regionId: region.id },
          }),
          prisma.story.count({
            where: { status: "PUBLISHED", regionId: region.id },
          }),
        ]);

        return {
          ...region,
          _count: { ghosts, hauntedPlaces, stories },
        };
      })
    );

    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
