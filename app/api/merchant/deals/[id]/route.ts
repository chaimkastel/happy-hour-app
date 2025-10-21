import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const paramsSchema = z.object({
  id: z.string().min(1),
});

const updateDealSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  percentOff: z.number().optional(),
  originalPrice: z.number().optional(),
  discountedPrice: z.number().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  daysOfWeek: z.array(z.string()).optional(),
  timeWindows: z.array(z.object({
    start: z.string(),
    end: z.string()
  })).optional(),
  conditions: z.array(z.string()).optional(),
  maxRedemptions: z.number().optional(),
  perUserLimit: z.number().optional(),
  priority: z.number().optional(),
  active: z.boolean().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = paramsSchema.parse(params);

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

    const deal = await db.deal.findFirst({
      where: {
        id,
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
      }
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Calculate redemption count
    const redemptionCount = await db.voucher.count({
      where: {
        dealId: deal.id,
        status: 'REDEEMED'
      }
    });

    return NextResponse.json({ 
      deal: {
        ...deal,
        redemptionCount
      }
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = paramsSchema.parse(params);

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

    // Verify deal belongs to merchant
    const existingDeal = await db.deal.findFirst({
      where: {
        id,
        venueId: {
          in: venueIds
        }
      }
    });

    if (!existingDeal) {
      return NextResponse.json(
        { error: 'Deal not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateDealSchema.parse(body);

    const deal = await db.deal.update({
      where: { id },
      data: {
        ...validatedData,
        conditions: validatedData.conditions ? JSON.stringify(validatedData.conditions) : undefined,
      },
      include: {
        venue: true
      }
    });

    return NextResponse.json({ deal });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = paramsSchema.parse(params);

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

    // Verify deal belongs to merchant
    const existingDeal = await db.deal.findFirst({
      where: {
        id,
        venueId: {
          in: venueIds
        }
      }
    });

    if (!existingDeal) {
      return NextResponse.json(
        { error: 'Deal not found or access denied' },
        { status: 404 }
      );
    }

    // Soft delete by setting active to false
    await db.deal.update({
      where: { id },
      data: { active: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}