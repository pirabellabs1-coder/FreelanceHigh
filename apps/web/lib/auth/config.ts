import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "./rate-limiter";

// Types etendus pour le JWT et la session
declare module "next-auth" {
  interface User {
    role?: string;
    kyc?: number;
    plan?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      kyc: number;
      plan: string;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    kyc: number;
    plan: string;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    // Google OAuth — methode principale
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Email/Password — methode secondaire
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        // Rate limiting — verifie AVANT le mot de passe
        const rateCheck = checkRateLimit(email);
        if (!rateCheck.allowed) {
          throw new Error("Trop de tentatives. Reessayez dans 15 minutes.");
        }

        try {
          // Prisma lookup — importe dynamiquement pour eviter les erreurs si DB non configuree
          const { prisma } = await import("@freelancehigh/db");
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              passwordHash: true,
              role: true,
              kyc: true,
              plan: true,
              status: true,
            },
          });

          if (!user || !user.passwordHash) {
            recordFailedAttempt(email);
            return null;
          }

          // Compte suspendu ou banni
          if (user.status !== "ACTIF") {
            throw new Error("Votre compte est desactive. Contactez le support.");
          }

          // Verifier le mot de passe
          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) {
            recordFailedAttempt(email);
            return null;
          }

          // Succes — reset les tentatives
          resetAttempts(email);

          // Mettre a jour lastLoginAt
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date(), loginCount: { increment: 1 } },
          }).catch(() => {}); // Non bloquant

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.toLowerCase(),
            kyc: user.kyc,
            plan: user.plan.toLowerCase(),
          };
        } catch (err) {
          // Si la DB n'est pas configuree, laisser l'erreur remonter
          if (err instanceof Error && err.message.includes("tentatives")) throw err;
          if (err instanceof Error && err.message.includes("desactive")) throw err;
          console.error("[AUTH] Database error:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24h
  },
  pages: {
    signIn: "/connexion",
    newUser: "/inscription",
    error: "/connexion",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Pour les connexions Google, creer ou mettre a jour l'utilisateur en DB
      if (account?.provider === "google" && user.email) {
        try {
          const { prisma } = await import("@freelancehigh/db");
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Mettre a jour lastLoginAt
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                lastLoginAt: new Date(),
                loginCount: { increment: 1 },
                avatar: user.image || existingUser.avatar,
              },
            });
            // Injecter les donnees dans l'objet user pour les callbacks
            user.id = existingUser.id;
            user.role = existingUser.role.toLowerCase();
            user.kyc = existingUser.kyc;
            user.plan = existingUser.plan.toLowerCase();
          } else {
            // Creer un nouveau compte depuis Google
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "Utilisateur",
                passwordHash: "", // Pas de mot de passe pour les comptes Google
                avatar: user.image || null,
                role: "FREELANCE",
                plan: "GRATUIT",
                kyc: 1,
              },
            });
            user.id = newUser.id;
            user.role = "freelance";
            user.kyc = 1;
            user.plan = "gratuit";
          }
        } catch (err) {
          console.error("[AUTH] Google sign-in DB error:", err);
          // Permettre la connexion meme si la DB echoue (mode degrade)
          user.role = "freelance";
          user.kyc = 1;
          user.plan = "gratuit";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user.role as string) ?? "freelance";
        token.kyc = (user.kyc as number) ?? 1;
        token.plan = (user.plan as string) ?? "gratuit";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.kyc = token.kyc;
      session.user.plan = token.plan;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl) || url.startsWith("/")) {
        return url;
      }
      return baseUrl;
    },
  },
};
