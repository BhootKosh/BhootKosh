import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GHOST_TYPES, ghostTypeLabel, ghostTypeSlug } from "@/lib/utils";

export async function GET() {
  try {
    const groups = await prisma.ghost.groupBy({
      by: ["type"],
      where: { status: "PUBLISHED" },
      _count: true,
    });
    const counts = Object.fromEntries(groups.map((g) => [g.type, g._count]));
    const types = GHOST_TYPES.map((t) => ({
      type: t,
      slug: ghostTypeSlug(t),
      label: ghostTypeLabel(t),
      count: counts[t] || 0,
    }));
    return NextResponse.json(types);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
