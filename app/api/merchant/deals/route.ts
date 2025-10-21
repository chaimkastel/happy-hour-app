import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createDealSchema = z.object({
  venueId: z.string().min(1),
  type: z.enum(['HAPPY_HOUR', 'INSTANT']),
  title: z.string().min(1),
  description: z.string().min(1),
  percentOff: z.number().optional(),
  originalPrice: z.number().optional(),
  discountedPrice: z.number().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  daysOfWeek: z.array(z.string()).optional(),
  timeWindows: z.array(z.object({
    start: z.string(),
    end: z.string()
  })).optional(),
  conditions: z.array(z.string()).optional(),
  maxRedemptions: z.number().optional(),
  perUserLimit: z.number().default(1),
  priority: z.number().default(1),
  active: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get merchant
    const merchant = await db.merchant.findUnique({
      where: { userId: session.user.id },
      include: {
        venues: {
          select: { id: true }
        }
      }
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    const venueIds = merchant.venues.map(venue => venue.id);

    const deals = await db.deal.findMany({
      where: {
        venueId: {
          in: venueIds
        }
      },
      include: {
        venue: true,
        _count: {
          select: {
            vouchers: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate redemption counts
    const dealsWithRedemptions = await Promise.all(
      deals.map(async (deal) => {
        const redemptionCount = await db.voucher.count({
          where: {
            dealId: deal.id,
            status: 'REDEEMED'
          }
        });
        return {
          ...deal,
          redemptionCount
        };
      })
    );

    return NextResponse.json({ deals: dealsWithRedemptions });
  } catch (error) {
    console.error('Error fetching merchant deals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get merchant
    const merchant = await db.merchant.findUnique({
      where: { userId: session.user.id }
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Check subscription status
    if (merchant.subscriptionStatus !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Active subscription required to create deals' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createDealSchema.parse(body);

    // Verify venue belongs to merchant
    const venue = await db.venue.findFirst({
      where: {
        id: validatedData.venueId,
        merchantId: merchant.id
      }
    });

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found or access denied' },
        { status: 404 }
      );
    }

    const deal = await db.deal.create({
      data: {
        ...validatedData,
        startAt: new Date(validatedData.startsAt),
        endAt: new Date(validatedData.endsAt),
        percentOff: validatedData.percentOff || 0,
        conditions: JSON.stringify(validatedData.conditions || []),
      },
      include: {
        venue: true
      }
    });

    return NextResponse.json({ deal });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}