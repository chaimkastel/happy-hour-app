import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const paramsSchema = z.object({
  id: z.string().min(1),
});

const updateVenueSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  hours: z.string().optional(),
  priceTier: z.enum(['BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY']).optional(),
  isVerified: z.boolean().optional(),
  rating: z.number().optional(),
  photos: z.string().optional()
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
      where: { userId: session.user.id }
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    const venue = await db.venue.findFirst({
      where: {
        id,
        merchantId: merchant.id
      },
      include: {
        deals: {
          where: { active: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ venue });
  } catch (error) {
    console.error('Error fetching venue:', error);
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
      where: { userId: session.user.id }
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Verify venue belongs to merchant
    const existingVenue = await db.venue.findFirst({
      where: {
        id,
        merchantId: merchant.id
      }
    });

    if (!existingVenue) {
      return NextResponse.json(
        { error: 'Venue not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateVenueSchema.parse(body);

    const venue = await db.venue.update({
      where: { id },
      data: validatedData,
      include: {
        deals: {
          where: { active: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json({ venue });
  } catch (error) {
    console.error('Error updating venue:', error);
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
      where: { userId: session.user.id }
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Verify venue belongs to merchant
    const existingVenue = await db.venue.findFirst({
      where: {
        id,
        merchantId: merchant.id
      }
    });

    if (!existingVenue) {
      return NextResponse.json(
        { error: 'Venue not found or access denied' },
        { status: 404 }
      );
    }

    // Check if venue has active deals
    const activeDeals = await db.deal.count({
      where: {
        venueId: id,
        active: true
      }
    });

    if (activeDeals > 0) {
      return NextResponse.json(
        { error: 'Cannot delete venue with active deals' },
        { status: 400 }
      );
    }

    await db.venue.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting venue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
