import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    // Find user with the verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyTokenExpiry: {
          gt: new Date() // Token hasn't expired
        }
      }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid or expired verification token' 
      }, { status: 400 });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({ 
        message: 'Email is already verified' 
      }, { status: 200 });
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerifyToken: null, // Clear the token
        emailVerifyTokenExpiry: null, // Clear the expiry
      }
    });

    return NextResponse.json({ 
      message: 'Email verified successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
  }
}
