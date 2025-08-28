import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const kycStatus = searchParams.get('kycStatus');
    
    let whereClause: any = {};
    if (kycStatus) {
      whereClause.kycStatus = kycStatus;
    }

    const merchants = await prisma.merchant.findMany({
      where: whereClause,
      include: {
        user: true,
        venues: {
          include: {
            deals: true
          }
        },
        subscription: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data for admin display
    const transformedMerchants = merchants.map(merchant => ({
      id: merchant.id,
      email: merchant.user.email,
      businessName: merchant.businessName,
      contactName: merchant.user.email.split('@')[0], // Fallback since we don't have contactName in User model
      phone: merchant.user.phone,
      address: merchant.venues[0]?.address || 'Not provided',
      subscription: merchant.subscription?.plan || 'FREE',
      isActive: merchant.kycStatus === 'APPROVED',
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
      kycStatus: merchant.kycStatus,
      dealsCount: merchant.venues.reduce((total, venue) => total + venue.deals.length, 0),
      venuesCount: merchant.venues.length,
      totalRevenue: 0, // You might want to calculate this from actual transactions
      venues: merchant.venues.map(venue => ({
        id: venue.id,
        name: venue.name,
        address: venue.address,
        businessType: venue.businessType,
        rating: venue.rating,
        isVerified: venue.isVerified,
        dealsCount: venue.deals.length
      }))
    }));

    return NextResponse.json({
      merchants: transformedMerchants,
      total: transformedMerchants.length
    });
  } catch (error) {
    console.error('Error fetching admin merchants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchants' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantId, kycStatus, adminNotes } = body;

    if (!merchantId || !kycStatus) {
      return NextResponse.json(
        { error: 'Merchant ID and KYC status are required' },
        { status: 400 }
      );
    }

    // Update the merchant KYC status
    const updatedMerchant = await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        kycStatus: kycStatus,
        updatedAt: new Date()
      },
      include: {
        user: true,
        venues: true
      }
    });

    // Log the admin action
    console.log(`Admin action: Merchant ${merchantId} KYC status changed to ${kycStatus}`, {
      adminNotes,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: `Merchant ${kycStatus.toLowerCase()} successfully`,
      merchant: {
        id: updatedMerchant.id,
        businessName: updatedMerchant.businessName,
        kycStatus: updatedMerchant.kycStatus,
        email: updatedMerchant.user.email
      }
    });
  } catch (error) {
    console.error('Error updating merchant:', error);
    return NextResponse.json(
      { error: 'Failed to update merchant' },
      { status: 500 }
    );
  }
}