import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            latitude: true,
            longitude: true,
            businessType: true,
            priceTier: true,
            rating: true,
            photos: true,
            hours: true
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

    // Parse JSON fields
    const processedDeal = {
      ...deal,
      tags: deal.tags ? JSON.parse(deal.tags) : [],
      venue: {
        ...deal.venue,
        businessType: deal.venue.businessType ? JSON.parse(deal.venue.businessType) : [],
        photos: deal.venue.photos ? JSON.parse(deal.venue.photos) : [],
        hours: deal.venue.hours ? JSON.parse(deal.venue.hours) : {}
      }
    };

    return NextResponse.json(processedDeal);
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}
