import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db"

export const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token.sub && session.user) {
        (session.user as any).id = token.sub
        (session.user as any).role = token.role
      }
      return session
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id
        token.role = user.role
      }
      return token
    },
  },
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials" as const,
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // For demo purposes, allow any email with demo123 password
          // In production, you'd check against a real database
          if (credentials.password === 'demo123' || credentials.password === 'password123') {
            return {
              id: `user_${Date.now()}`,
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: 'USER'
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

export const { auth, signIn, signOut } = NextAuth(authOptions)

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}
