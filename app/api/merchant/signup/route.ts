import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { smartGeocode } from '@/lib/geocoding';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, ownerName, email, phone, address, cuisine, password } = body;

    // Validate required fields
    if (!businessName || !ownerName || !email || !phone || !address || !cuisine || !password) {
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

    // Geocode the address to get coordinates
    const geocodeResult = await smartGeocode(address);
    let latitude = 0;
    let longitude = 0;

    if ('latitude' in geocodeResult && 'longitude' in geocodeResult) {
      latitude = geocodeResult.latitude;
      longitude = geocodeResult.longitude;
    }

    // Create user account
    const user = await prisma.user.create({
      data: {
        email,
        role: 'MERCHANT',
        // Note: In production, you'd hash the password
        // For demo purposes, we'll store it as-is
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

    // Create default venue
    const venue = await prisma.venue.create({
      data: {
        merchantId: merchant.id,
        name: businessName,
        slug: businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        address,
        latitude,
        longitude,
        businessType: [cuisine],
        priceTier: 'MODERATE',
        hours: JSON.stringify({
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '11:00', close: '23:00' },
          sunday: { open: '11:00', close: '22:00' }
        }),
        photos: JSON.stringify([]),
        isVerified: false,
        rating: 0,
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
      },
      venue: {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        latitude: venue.latitude,
        longitude: venue.longitude
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
