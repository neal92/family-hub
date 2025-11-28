import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { loginUser } from "@/controllers/authController";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await loginUser({
            email: credentials.email,
            password: credentials.password,
          });
          if (!user) return null;
          // NextAuth attend un objet avec au moins un id
          return { id: user.id, email: user.email, name: user.name };
        } catch (error) {
          // Optionnel: log l'erreur
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token, user }) {
      // Ajoute l'id utilisateur à la session
      if (session.user && token?.sub) {
        (session.user as any).id = token.sub;
        // Récupère le rôle depuis la base de données
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true }
        });
        (session.user as any).role = dbUser?.role || 'member';
      }
      return session;
    },
  },
};