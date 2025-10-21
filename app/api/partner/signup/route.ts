import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { smartGeocode } from '@/lib/geocoding';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      restaurantName, 
      contactName, 
      email, 
      phone, 
      address, 
      cuisine, 
      description 
    } = body;

    // Validate required fields
    if (!restaurantName || !contactName || !email || !phone || !address || !cuisine) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A partner account with this email already exists' },
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
        phone,
        role: 'MERCHANT', // Partners are merchants in the system
      }
    });

    // Create merchant/partner profile
    const merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        businessName: restaurantName,
        companyName: restaurantName,
        contactEmail: email,
      }
    });

    // Create default venue
    const venue = await prisma.venue.create({
      data: {
        merchantId: merchant.id,
        name: restaurantName,
        slug: restaurantName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        address,
        latitude,
        longitude,
        priceTier: 'MID_RANGE',
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

    // Send welcome email (in production, you'd use a service like SendGrid)
    console.log(`Welcome email sent to ${email} for restaurant ${restaurantName}`);

    return NextResponse.json({
      success: true,
      message: 'Partner application submitted successfully! We\'ll review your application and get back to you within 24 hours.',
      partner: {
        id: merchant.id,
        email: user.email,
      },
      venue: {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        cuisine: cuisine
      }
    });

  } catch (error) {
    console.error('Partner signup error:', error);
    return NextResponse.json(
      { error: 'Failed to submit partner application. Please try again.' },
      { status: 500 }
    );
  }
}