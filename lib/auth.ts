import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validators";
import { authConfig } from "./auth.config";

/**
 * Full Auth.js instance (Node runtime only — uses Prisma + bcrypt).
 * Middleware must import authConfig / edge auth, not this file's providers graph.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name || "Admin",
        };
      },
    }),
  ],
  logger: {
    error(error) {
      const name = error?.name || "AuthError";
      if (name === "JWTSessionError") {
        console.warn(
          "[auth] Stale or invalid session cookie (JWTSessionError). Clear site cookies or sign in again."
        );
        return;
      }
      console.error("[auth]", error);
    },
  },
});

/** Session helper that never throws on bad JWT cookies */
export async function getSessionSafe() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSessionSafe();
  if (!session?.user?.email) {
    return null;
  }
  return session;
}
