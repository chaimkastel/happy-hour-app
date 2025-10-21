import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get merchant's venues
    const merchant = await db.merchant.findUnique({
      where: { userId: session.user.id },
      include: {
        venues: {
          select: { id: true },
        },
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    const venueIds = merchant.venues.map(venue => venue.id);

    // Get recent vouchers for merchant's deals
    const vouchers = await db.voucher.findMany({
      where: {
        deal: {
          venueId: {
            in: venueIds,
          },
        },
      },
      include: {
        deal: {
          include: {
            venue: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error('Error fetching recent vouchers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
