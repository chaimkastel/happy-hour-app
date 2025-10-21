import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const venueRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20,
});

const VenueSchema = z.object({
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(200),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().default('America/New_York'),
  hours: z.record(z.string(), z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/),
    close: z.string().regex(/^\d{2}:\d{2}$/),
  })).optional(),
  priceTier: z.enum(['BUDGET', 'MID_RANGE', 'PREMIUM', 'LUXURY']).default('MID_RANGE'),
  photos: z.array(z.string().url()).optional().default([]),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'MERCHANT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    const venues = await prisma.venue.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ venues });
  } catch (error) {
    console.error('Get venues error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'MERCHANT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = await venueRateLimit(request);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(
      rateLimitResult.remaining,
      rateLimitResult.resetTime || Date.now() + 15 * 60 * 1000
    );
  }

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Check subscription status
    if (merchant.subscriptionStatus !== 'ACTIVE') {
      return NextResponse.json({ 
        error: 'Active subscription required to create venues' 
      }, { status: 403 });
    }

    const body = await request.json();
    const venueData = VenueSchema.parse(body);

    const venue = await prisma.venue.create({
      data: {
        merchantId: merchant.id,
        ...venueData,
        slug: venueData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        hours: JSON.stringify(venueData.hours || {}),
        photos: JSON.stringify(venueData.photos || []),
      },
    });

    await logAuditEvent({
      actorUserId: session.user.id,
      action: AUDIT_ACTIONS.MERCHANT_CREATE_VENUE,
      entity: 'venue',
      entityId: venue.id,
      metadata: { name: venue.name, address: venue.address },
    });

    return NextResponse.json({ venue }, { status: 201 });
  } catch (error) {
    console.error('Create venue error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid venue data', details: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    );
  }
}