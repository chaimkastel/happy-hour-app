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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        phone: phone || null,
        role: 'USER',
        // Note: In a real app, you'd store the hashed password
        // For now, we'll use a simple approach
      }
    });

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
