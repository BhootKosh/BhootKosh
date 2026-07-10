import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validators";

/**
 * Prefer AUTH_SECRET; fall back to NEXTAUTH_SECRET for older setups.
 * Must be stable across restarts or existing session cookies will fail to decode.
 */
const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "bhootkosh-dev-secret-change-me-in-production-32chars";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? token.email;
        token.name = user.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.email = (token.email as string) || session.user.email || "";
        session.user.name = (token.name as string) || session.user.name;
      }
      return session;
    },
  },
  secret: authSecret,
  trustHost: true,
  // Avoid noisy JWT decode failures becoming uncaught page errors when cookies are stale
  logger: {
    error(error) {
      // JWTSessionError is common after secret rotation or corrupt cookies — log briefly
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
