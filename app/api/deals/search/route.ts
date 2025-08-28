import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/db';

// Force dynamic rendering for search API
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const search = searchParams.get('search') || '';
    const distance = Number(searchParams.get('distance')) || 3;
    const minPercentOff = Number(searchParams.get('minPercentOff')) || 0;
    const businessType = searchParams.get('businessType') || searchParams.get('cuisine') || 'all';
    const openNow = searchParams.get('openNow') === 'true';
    const sortBy = searchParams.get('sortBy') || 'ending-soon';
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const lat = latParam ? Number(latParam) : null;
    const lng = lngParam ? Number(lngParam) : null;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;

    // Build the query
    let whereClause: any = {
      status: 'LIVE', // Only show live deals
      startAt: { lte: new Date() }, // Only show deals that have started
      endAt: { gt: new Date() }, // Only show deals that haven't expired
    };

    // Add search filter
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Add minimum percent off filter
    if (minPercentOff > 0) {
      whereClause.percentOff = {
        gte: minPercentOff
      };
    }

    // Add business type filter
    if (businessType !== 'all') {
      whereClause.venue = {
        ...(whereClause.venue || {}),
        businessType: { contains: businessType },
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const deals = await prisma.deal.findMany({
      where: whereClause,
      include: { venue: true },
      orderBy: getOrderBy(sortBy),
      skip,
      take: limit,
    });
    
    const totalCount = await prisma.deal.count({ where: whereClause });

    // Filter by distance if coordinates provided
    let filteredDeals = deals;
    if (lat !== null && lng !== null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      filteredDeals = deals.filter((deal: any) => {
        try {
          const distanceInKm = getDistance(lat, lng, deal.venue.latitude, deal.venue.longitude);
          return distanceInKm <= distance;
        } catch (error) {
          return true; // Include deal if distance calculation fails
        }
      });
    }

    // Parse JSON fields and transform data structure
    const processedDeals = filteredDeals.map((deal: any) => {
      try {
        return {
          ...deal,
          tags: parseJsonField(deal.tags),
          venue: {
            ...deal.venue,
            businessType: parseJsonField(deal.venue.businessType),
            photos: parseJsonField(deal.venue.photos),
            hours: parseJsonField(deal.venue.hours)
          }
        };
      } catch (error) {
        return deal; // Return unprocessed deal if processing fails
      }
    });

    return NextResponse.json({
      deals: processedDeals,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      filters: {
        search,
        distance,
        minPercentOff,
        businessType,
        openNow,
        sortBy
      }
    });
  } catch (error) {
    console.error('Error searching deals:', error);
    return NextResponse.json(
      { error: 'Failed to search deals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function getOrderBy(sortBy: string) {
  switch (sortBy) {
    case 'percent-off':
      return { percentOff: 'desc' as const };
    case 'ending-soon':
      return { endAt: 'asc' as const };
    case 'newest':
      return { createdAt: 'desc' as const };
    case 'rating':
      return { venue: { rating: 'desc' as const } };
    case 'distance':
      return { venue: { latitude: 'asc' as const } };
    default:
      return { endAt: 'asc' as const };
  }
}

function parseJsonField(field: string | null): any {
  if (!field) return field;
  try {
    return JSON.parse(field);
  } catch {
    return field;
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
