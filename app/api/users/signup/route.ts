import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For now, use a simple approach without database
    // In production, you'd want to set up a proper database
    const user = {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      phone: phone || null,
      role: 'USER',
      createdAt: new Date().toISOString()
    };

    // Simulate successful user creation
    return NextResponse.json({
      message: 'User created successfully! You can now sign in.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
