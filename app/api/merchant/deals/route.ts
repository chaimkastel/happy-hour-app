import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Type assertion for session
type SessionWithUser = {
  user: {
    email: string;
    [key: string]: any;
  };
};

// GET /api/merchant/deals - Get merchant's deals
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } },
      include: {
        venues: {
          include: {
            deals: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Flatten all deals from all venues
    const deals = merchant.venues.flatMap(venue => 
      venue.deals.map(deal => ({
        ...deal,
        venue: { id: venue.id, name: venue.name }
      }))
    );

    return NextResponse.json({ 
      deals,
      total: deals.length 
    });
  } catch (error) {
    console.error('Error fetching merchant deals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/merchant/deals - Create new deal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { venueId, title, description, percentOff, startAt, endAt, maxRedemptions, minSpend, tags } = body;

    // Get the merchant for this user
    const merchant = await prisma.merchant.findFirst({
      where: { user: { email: session.user.email } },
      include: { venues: { where: { id: venueId } } }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Verify the venue belongs to this merchant
    if (merchant.venues.length === 0) {
      return NextResponse.json({ error: 'Venue not found or not owned by merchant' }, { status: 404 });
    }

    // Create the deal
    const deal = await prisma.deal.create({
      data: {
        venueId,
        title,
        description: description || '',
        percentOff,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        maxRedemptions: maxRedemptions || 100,
        redeemedCount: 0,
        minSpend: minSpend || null,
        inPersonOnly: true, // Default to in-person deals
        tags: Array.isArray(tags) ? JSON.stringify(tags) : tags || '[]',
        status: 'DRAFT' // New deals start as drafts
      }
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
