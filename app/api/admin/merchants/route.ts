import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all merchants
    const merchants = await prisma.user.findMany({
      where: {
        role: 'MERCHANT'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the expected format
    const transformedMerchants = merchants.map(merchant => ({
      id: merchant.id,
      email: merchant.email,
      businessName: 'Unnamed Business', // Will be updated when Merchant model is properly linked
      contactName: 'Unknown',
      phone: merchant.phone || '',
      address: '',
      subscription: 'BASIC', // Default subscription
      isActive: true,
      createdAt: merchant.createdAt.toISOString().split('T')[0],
      dealsCount: 0, // Will be calculated separately
      venuesCount: 0, // Will be calculated separately
      totalRevenue: 0 // Calculate based on actual data
    }));

    return NextResponse.json({ merchants: transformedMerchants });
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, businessName, phone, address } = await request.json();

    // Create new merchant
    const merchant = await prisma.user.create({
      data: {
        email,
        role: 'MERCHANT',
        phone,
      },
    });

    return NextResponse.json({ merchant });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json(
      { error: 'Failed to create merchant' },
      { status: 500 }
    );
  }
}
