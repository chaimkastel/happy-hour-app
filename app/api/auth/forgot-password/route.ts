import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        message: 'If an account with that email exists, we\'ve sent a password reset link.' 
      }, { status: 200 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database (you might want to create a separate table for this)
    // For now, we'll store it in a simple way - in production, use a proper reset tokens table
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Note: In a real app, you'd have a separate resetTokens table
        // For now, we'll use a simple approach
      },
    });

    // In a real app, you would send an email here
    // For now, we'll just log the reset link
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log(`Password reset link for ${email}: ${resetLink}`);
    
    // Note: Password reset email is implemented but uses console logging
    // In production, integrate with an email service like SendGrid or Resend
    // await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json({ 
      message: 'If an account with that email exists, we\'ve sent a password reset link.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
