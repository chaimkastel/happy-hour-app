import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { smartGeocode } from '@/lib/geocoding';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, email, phone, password, firstName, lastName } = body;

    // Validate required fields
    if (!businessName || !email || !phone || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Create user account
    const user = await prisma.user.create({
      data: {
        email,
        role: 'MERCHANT',
        password: hashedPassword,
        phone: phone
      }
    });

    // Create merchant profile
    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        businessName,
        kycStatus: 'PENDING', // New merchants start with pending KYC
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
        role: user.role
      },
      merchant: {
        id: merchant.id,
        businessName: merchant.businessName,
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
