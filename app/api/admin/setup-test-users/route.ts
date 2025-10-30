import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Secure endpoint to create test users for QA. Requires x-setup-secret header matching SETUP_SECRET.
export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-setup-secret');
    if (!process.env.SETUP_SECRET || secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/db');

    // Customer test user
    const userPassword = await bcrypt.hash('user123!', 12);
    const user = await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        password: userPassword,
        role: 'USER',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567892',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // Merchant test user
    const merchantPassword = await bcrypt.hash('merchant123!', 12);
    const merchantUser = await prisma.user.upsert({
      where: { email: 'merchant@test.com' },
      update: {},
      create: {
        email: 'merchant@test.com',
        password: merchantPassword,
        role: 'MERCHANT',
        firstName: 'Test',
        lastName: 'Merchant',
        phone: '+1234567891',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    const merchant = await prisma.merchant.upsert({
      where: { userId: merchantUser.id },
      update: {
        approved: true,
        subscriptionStatus: 'ACTIVE',
      },
      create: {
        userId: merchantUser.id,
        businessName: 'QA Test Restaurant',
        companyName: 'QA Test Restaurant',
        contactEmail: 'merchant@test.com',
        approved: true,
        subscriptionStatus: 'ACTIVE',
        stripeCustomerId: 'cus_test_merchant',
      },
    });

    // Ensure at least one venue for the merchant (needed for flows)
    const venue = await prisma.venue.upsert({
      where: { id: 'venue_test_qa_1' },
      update: { merchantId: merchant.id },
      create: {
        id: 'venue_test_qa_1',
        merchantId: merchant.id,
        name: 'QA Test Venue',
        slug: 'qa-test-venue',
        address: '123 QA Street',
        latitude: 40.7128,
        longitude: -74.0060,
        hours: JSON.stringify({
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '10:00', close: '22:00' },
          sunday: { open: '10:00', close: '20:00' },
        }),
        priceTier: 'MID_RANGE',
        isVerified: true,
        rating: 4.5,
        photos: JSON.stringify([]),
      },
    });

    return NextResponse.json({
      success: true,
      users: [
        { email: 'user@test.com', password: 'user123!' },
        { email: 'merchant@test.com', password: 'merchant123!' },
      ],
      venueId: venue.id,
    });
  } catch (error: any) {
    console.error('setup-test-users error', error);
    return NextResponse.json({ error: 'Failed to create test users' }, { status: 500 });
  }
}


