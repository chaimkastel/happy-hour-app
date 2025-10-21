import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '5'; // km
    const cuisine = searchParams.get('cuisine');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query filters
    const where: any = {
      status: 'ACTIVE',
      startAt: { lte: new Date() },
      endAt: { gte: new Date() },
    };

    if (cuisine) {
      where.venue = {
        businessType: {
          contains: cuisine,
        },
      };
    }

    // Get deals with venue info
    const deals = await prisma.deal.findMany({
      where,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            priceTier: true,
            rating: true,
            isVerified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Calculate distances if coordinates provided
    let dealsWithDistance = deals;
    if (lat && lng) {
      dealsWithDistance = deals.map(deal => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          deal.venue.latitude || 0,
          deal.venue.longitude || 0
        );
        return {
          ...deal,
          distance: distance,
        };
      }).filter(deal => deal.distance <= parseFloat(radius));
    }

    return NextResponse.json({
      success: true,
      data: dealsWithDistance,
      pagination: {
        limit,
        offset,
        total: dealsWithDistance.length,
        hasMore: dealsWithDistance.length === limit,
      },
    });

  } catch (error) {
    console.error('Mobile deals API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
