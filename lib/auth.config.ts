import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no Prisma, no bcrypt, no Node APIs).
 * Used by middleware. Full providers live in lib/auth.ts.
 */
export const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "bhootkosh-dev-secret-change-me-in-production-32chars";

export const authConfig = {
  providers: [],
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
        session.user.email =
          (token.email as string) || session.user.email || "";
        session.user.name = (token.name as string) || session.user.name;
      }
      return session;
    },
  },
  secret: authSecret,
  trustHost: true,
} satisfies NextAuthConfig;
