import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      // Update existing user to opt into newsletter
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { newsletterOptIn: true }
      });

      return NextResponse.json({
        message: 'Successfully subscribed to newsletter',
        alreadySubscribed: true
      });
    }

    // Create new newsletter subscriber
    const subscriber = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName: name || null,
        newsletterOptIn: true,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        newsletterOptIn: true
      }
    });

    // TODO: Send welcome email
    // await sendWelcomeEmail(subscriber.email, subscriber.firstName);

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        firstName: subscriber.firstName
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter. Please try again.' },
      { status: 500 }
    );
  }
}
