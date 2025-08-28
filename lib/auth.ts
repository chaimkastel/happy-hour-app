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
      }
      return session
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  providers: [
    {
      id: "demo",
      name: "Demo",
      type: "credentials" as const,
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        // For demo purposes, allow any login
        if (credentials?.email && typeof credentials.email === 'string') {
          return {
            id: "demo-user",
            email: credentials.email,
            name: "Demo User"
          }
        }
        return null
      }
    }
  ]
}

export const { auth, signIn, signOut } = NextAuth(authOptions)

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}
