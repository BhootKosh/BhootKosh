import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Avoid hard-crashing the whole app at import time if env is missing.
  // Queries will still fail until DATABASE_URL is set correctly.
  if (!process.env.DATABASE_URL) {
    console.error(
      "[prisma] DATABASE_URL is missing. Set it in Vercel Environment Variables."
    );
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Reuse client across hot reloads + Vercel serverless invocations.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
