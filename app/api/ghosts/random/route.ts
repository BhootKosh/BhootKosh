import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.ghost.count({ where: { status: "PUBLISHED" } });
    if (count === 0) {
      return NextResponse.json({ error: "No ghosts" }, { status: 404 });
    }
    const skip = Math.floor(Math.random() * count);
    const ghost = await prisma.ghost.findFirst({
      where: { status: "PUBLISHED" },
      skip,
      include: { region: { select: { name: true, slug: true } } },
    });
    return NextResponse.json(ghost);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
