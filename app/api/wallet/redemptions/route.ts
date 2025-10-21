import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const walletRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 30,
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'USER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = await walletRateLimit(request);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(
      rateLimitResult.remaining,
      rateLimitResult.resetTime || Date.now()
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    // Build where clause based on status filter
    let statusFilter = {};
    if (status !== 'all') {
      statusFilter = { status: status.toUpperCase() };
    }

    const vouchers = await prisma.redemption.findMany({
      where: {
        userId: session.user.id,
        ...statusFilter,
      },
      include: {
        deal: {
          include: {
            venue: {
              include: {
                merchant: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the data for the frontend
    const transformedVouchers = vouchers.map(voucher => ({
      id: voucher.id,
      code: voucher.code,
      status: voucher.status,
      createdAt: voucher.createdAt,
      expiresAt: voucher.expiresAt,
      redeemedAt: voucher.redeemedAt,
      deal: {
        id: voucher.deal.id,
        title: voucher.deal.title,
        description: voucher.deal.description,
        type: voucher.deal.type,
        percentOff: voucher.deal.percentOff,
        minSpend: voucher.deal.minSpend,
        startAt: voucher.deal.startAt,
        endAt: voucher.deal.endAt,
        conditions: voucher.deal.conditions,
        venue: {
          id: voucher.deal.venue.id,
          name: voucher.deal.venue.name,
          address: voucher.deal.venue.address,
          hours: voucher.deal.venue.hours,
          photos: voucher.deal.venue.photos,
          rating: voucher.deal.venue.rating,
          priceTier: voucher.deal.venue.priceTier,
        },
      },
    }));

    return NextResponse.json({
      vouchers: transformedVouchers,
      total: transformedVouchers.length,
      statusCounts: {
        issued: vouchers.filter(v => v.status === 'ISSUED').length,
        redeemed: vouchers.filter(v => v.status === 'REDEEMED').length,
        expired: vouchers.filter(v => v.status === 'EXPIRED').length,
        cancelled: vouchers.filter(v => v.status === 'CANCELLED').length,
      },
    });
  } catch (error) {
    console.error('Wallet redemptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    );
  }
}