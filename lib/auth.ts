import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const providers = [];

// Add Google provider if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }));
}

// Add Apple provider if configured
if (process.env.APPLE_ID && process.env.APPLE_SECRET) {
  providers.push(AppleProvider({
    clientId: process.env.APPLE_ID,
    clientSecret: process.env.APPLE_SECRET,
  }));
}

// Always add credentials provider
providers.push(CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    })
);

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'apple') {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user for OAuth sign-in
            await prisma.user.create({
              data: {
                email: user.email!,
                role: 'USER',
                // OAuth users don't have passwords
                password: null,
              },
            });
          }
          return true;
        } catch (error) {
          console.error('OAuth sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};