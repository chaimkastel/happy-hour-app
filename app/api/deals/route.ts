import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Force dynamic rendering for deals API
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine') || '';
    const maxDistance = parseFloat(searchParams.get('maxDistance') || '10');
    const minDiscount = parseInt(searchParams.get('minDiscount') || '0');
    const openNow = searchParams.get('openNow') === 'true';

    // Build where clause
    const where: any = {
      status: 'LIVE'
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (cuisine) {
      where.venue = {
        ...where.venue,
        businessType: { has: cuisine }
      };
    }

    if (minDiscount > 0) {
      where.percentOff = { gte: minDiscount };
    }

    // Get deals with pagination
    const deals = await prisma.deal.findMany({
      where,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            businessType: true,
            priceTier: true,
            rating: true,
            latitude: true,
            longitude: true,
            photos: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    });

    // Get total count
    const total = await prisma.deal.count({ where });

    return NextResponse.json({
      deals,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}
