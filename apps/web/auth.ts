import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account && account.provider === 'google') {
        try {
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: 'google',
              providerAccountId: account.providerAccountId
            }
          });
          if (existingAccount) {
            await prisma.account.update({
              where: { id: existingAccount.id },
              data: {
                access_token: account.access_token,
                refresh_token: account.refresh_token || undefined,
                expires_at: account.expires_at,
                scope: account.scope
              }
            });
            console.log(`[auth.ts] Successfully updated Google Account tokens in DB for user ${existingAccount.userId}`);
          }
        } catch (err) {
          console.error('[auth.ts] Failed to update Google Account tokens on sign-in:', err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      const dim = await prisma.dimension.findUnique({ where: { name: 'physical_health' }});
      await prisma.baseCommitment.create({
        data: {
          userId: user.id,
          title: 'Dormir',
          type: 'routine',
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          hoursPerDay: 8,
          commuteHours: 0,
          dimensionIds: dim?.id ? [dim.id] : []
        }
      });
    }
  }
});
