import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Lightweight health check for Vercel / ops debugging */
export async function GET() {
  const checks: Record<string, unknown> = {
    ok: true,
    siteUrl: getSiteUrl(),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasAuthSecret: Boolean(
      process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    ),
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    await prisma.$runCommandRaw({ ping: 1 });
    checks.database = "connected";
  } catch (err) {
    checks.ok = false;
    checks.database = "error";
    checks.databaseError =
      err instanceof Error ? err.message : "unknown database error";
  }

  return NextResponse.json(checks, {
    status: checks.ok ? 200 : 503,
  });
}
