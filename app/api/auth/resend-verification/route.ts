import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find user with the verification token (even if expired)
    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token
      }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid verification token' 
      }, { status: 400 });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({ 
        message: 'Email is already verified' 
      }, { status: 200 });
    }

    // Generate new verification token
    const newEmailVerifyToken = crypto.randomBytes(32).toString('hex');
    const newEmailVerifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: newEmailVerifyToken,
        emailVerifyTokenExpiry: newEmailVerifyTokenExpiry,
      }
    });

    // Generate new verification link
    const verificationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${newEmailVerifyToken}`;
    console.log(`New email verification link for ${user.email}: ${verificationLink}`);
    
    // In a real app, you would send an email here
    // await sendVerificationEmail(user.email, verificationLink);

    return NextResponse.json({ 
      message: 'Verification email sent successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Failed to resend verification email' }, { status: 500 });
  }
}
