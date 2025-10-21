import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get real stats from database
    const [
      totalUsers,
      totalMerchants,
      totalVenues,
      totalDeals,
      totalVouchers,
      totalRedemptions,
      activeDeals,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.merchant.count({ where: { kycStatus: 'APPROVED' } }),
      prisma.venue.count({ where: { isVerified: true } }),
      prisma.deal.count(),
      prisma.redemption.count(),
      prisma.redemption.count({ where: { status: 'REDEEMED' } }),
      prisma.deal.count({ where: { status: 'ACTIVE' } }),
    ]);

    // Calculate total savings (estimate based on vouchers redeemed)
    const estimatedSavings = totalRedemptions * 25; // Average $25 savings per voucher

    return NextResponse.json({
      totalUsers,
      totalMerchants,
      totalVenues,
      totalDeals,
      totalVouchers,
      totalRedemptions,
      activeDeals,
      estimatedSavings,
    });
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
