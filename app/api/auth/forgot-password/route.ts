import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

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

    // Send password reset email
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    try {
      const emailResult = await sendEmail(
        email,
        'PASSWORD_RESET',
        {
          firstName: user.firstName,
          resetUrl: resetLink
        }
      );

      if (!emailResult.success) {
        console.error('Failed to send password reset email:', emailResult.error);
        // Still return success to not reveal if user exists
      }
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Still return success to not reveal if user exists
    }

    return NextResponse.json({ 
      message: 'If an account with that email exists, we\'ve sent a password reset link.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
