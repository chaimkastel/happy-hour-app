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
      if (token && typeof token.sub === 'string' && session.user) {
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
          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            return null;
          }

          // For demo purposes, allow demo123 password for any user
          // In production, you'd hash and compare passwords properly
          const validPasswords = process.env.DEMO_PASSWORDS?.split(',') || ['demo123', 'password123'];
          if (validPasswords.includes(credentials.password)) {
            return {
              id: user.id,
              email: user.email,
              name: user.email.split('@')[0],
              role: user.role
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
