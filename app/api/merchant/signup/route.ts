import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';
// Removed libphonenumber-js import - using flexible validation instead

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
    const { 
      businessName, 
      email, 
      phone, 
      password, 
      confirmPassword,
      contactName, 
      address,
      city,
      state,
      zipCode,
      businessType,
      cuisine,
      website,
      termsAccepted,
      newsletterOptIn
    } = body;

    // Validate required fields
    if (!businessName || !email || !phone || !password || !contactName || !address || !businessType) {
      return NextResponse.json(
        { error: 'Business name, email, phone, password, contact name, address, and business type are required' },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Normalize phone number - simple format
    let normalizedPhone = phone;
    if (phone) {
      // Remove all non-digit characters except + at the beginning
      const cleaned = phone.replace(/[^\d+]/g, '');
      // Basic validation - must be 7-15 digits or start with + and have 7-15 digits
      if (!/^(\+\d{7,15}|\d{7,15})$/.test(cleaned)) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number (7-15 digits, optionally starting with +)' },
          { status: 400 }
        );
      }
      normalizedPhone = cleaned;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user account
    const user = await prisma.user.create({
      data: {
        email,
        role: 'MERCHANT',
        password: hashedPassword,
        phone: normalizedPhone,
        firstName: contactName.split(' ')[0] || contactName,
        lastName: contactName.split(' ').slice(1).join(' ') || null
      }
    });

    // Create merchant profile
    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        businessName: businessName,
        companyName: businessName,
        contactEmail: user.email,
        approved: false // New merchants start as not approved
      }
    });


    // Note: Venues will be created separately by the merchant


    return NextResponse.json({
      success: true,
      message: 'Merchant account created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      merchant: {
        id: merchant.id,
        companyName: merchant.companyName,
        contactEmail: merchant.contactEmail,
        approved: merchant.approved
      }
    });

  } catch (error) {
    console.error('Merchant signup error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: body
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
