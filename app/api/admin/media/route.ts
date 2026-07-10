import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const items = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
