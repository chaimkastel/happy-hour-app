import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
    const { 
      businessName, 
      email, 
      phone, 
      password, 
      firstName, 
      lastName, 
      businessAddress, 
      cuisineType, 
      website,
      acceptTerms 
    } = body;

    // Validate required fields
    if (!businessName || !email || !phone || !password || !firstName || !lastName || !businessAddress || !cuisineType) {
      return NextResponse.json(
        { error: 'Business name, email, phone, password, first name, last name, business address, and cuisine type are required' },
        { status: 400 }
      );
    }

    // Validate terms acceptance
    if (!acceptTerms) {
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
        phone: phone,
        firstName: firstName,
        lastName: lastName
      }
    });

    // Create merchant profile
    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        businessName,
        firstName: firstName,
        lastName: lastName,
        businessAddress: businessAddress,
        cuisineType: cuisineType,
        website: website || null,
        kycStatus: 'PENDING', // New merchants start with pending KYC
        termsAcceptedAt: acceptTerms ? new Date() : null,
      }
    });

    // Create subscription for trial
    const subscription = await prisma.subscription.create({
      data: {
        merchantId: merchant.id,
        plan: 'TRIAL',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        trialStartedAt: new Date(),
      }
    });

    // Note: Venues will be created separately by the merchant

    // Create admin notification for new merchant application
    await prisma.adminNotification.create({
      data: {
        type: 'merchant_application',
        title: 'New Merchant Application',
        message: `New merchant application: ${businessName} (${email})`,
        priority: 'high',
        data: JSON.stringify({
          merchantId: merchant.id,
          businessName: merchant.businessName,
          email: user.email,
          firstName: merchant.firstName,
          lastName: merchant.lastName,
          businessAddress: merchant.businessAddress,
          cuisineType: merchant.cuisineType,
          kycStatus: merchant.kycStatus,
          timestamp: new Date().toISOString()
        })
      }
    });

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
        businessName: merchant.businessName,
        businessAddress: merchant.businessAddress,
        cuisineType: merchant.cuisineType,
        website: merchant.website,
        kycStatus: merchant.kycStatus
      },
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd
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
