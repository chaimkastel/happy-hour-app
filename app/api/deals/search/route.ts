import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface SearchParams {
  q?: string;
  location?: string;
  cuisine?: string;
  distance?: number;
  priceRange?: string;
  rating?: number;
  limit?: number;
  offset?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      q = '',
      location = 'Downtown',
      cuisine,
      distance = 10,
      priceRange,
      rating,
      limit = 20,
      offset = 0
    }: SearchParams = body;

    // Build where clause for database query
    const whereClause: any = {
      status: 'ACTIVE',
      endAt: {
        gt: new Date() // Only active deals that haven't expired
      }
    };

    // Add search query filter
    if (q.trim()) {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { venue: { name: { contains: q, mode: 'insensitive' } } }
      ];
    }

    // Add cuisine filter
    if (cuisine) {
      whereClause.venue = {
        ...whereClause.venue,
        businessType: { contains: cuisine, mode: 'insensitive' }
      };
    }

    // Add rating filter
    if (rating) {
      whereClause.venue = {
        ...whereClause.venue,
        rating: { gte: rating }
      };
    }

    // Fetch deals from database
    const deals = await prisma.deal.findMany({
      where: whereClause,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            businessType: true,
            rating: true,
            latitude: true,
            longitude: true
          }
        }
      },
      orderBy: [
        { venue: { rating: 'desc' } },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    });

    // Transform deals to include calculated fields
    const transformedDeals = deals.map(deal => {
      // Calculate distance (mock calculation for now)
      const mockDistance = (Math.random() * 2 + 0.1).toFixed(1);
      
      // Determine if venue is open (mock calculation for now)
      const currentHour = new Date().getHours();
      const isOpen = currentHour >= 11 && currentHour <= 22; // 11 AM to 10 PM

      // Calculate prices (mock calculation)
      const originalPrice = Math.floor(Math.random() * 50) + 10; // $10-$60
      const discountedPrice = Math.round(originalPrice * (1 - deal.percentOff / 100) * 100) / 100;

      return {
        id: deal.id,
        title: deal.title,
        description: deal.description,
        percentOff: deal.percentOff,
        venue: {
          id: deal.venue.id,
          name: deal.venue.name,
          address: deal.venue.address,
          businessType: deal.venue.businessType,
          rating: deal.venue.rating || 4.0,
          distance: `${mockDistance} mi`,
          latitude: deal.venue.latitude,
          longitude: deal.venue.longitude
        },
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
        isOpen,
        endTime: new Date(deal.endAt).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        originalPrice,
        discountedPrice,
        startAt: deal.startAt,
        endAt: deal.endAt
      };
    });

    // Apply price range filter after transformation
    let filteredDeals = transformedDeals;
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filteredDeals = filteredDeals.filter(deal => {
        const price = deal.discountedPrice;
        return price >= min && (max ? price <= max : true);
      });
    }

    // Get total count for pagination
    const totalCount = await prisma.deal.count({
      where: whereClause
    });

    return NextResponse.json({
      deals: filteredDeals,
      total: totalCount,
      hasMore: offset + limit < totalCount,
      filters: {
        q,
        location,
        cuisine,
        distance,
        priceRange,
        rating
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search deals' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const q = searchParams.get('q') || '';
  const location = searchParams.get('location') || 'Downtown';
  const cuisine = searchParams.get('cuisine') || undefined;
  const distance = Number(searchParams.get('distance')) || 10;
  const priceRange = searchParams.get('priceRange') || undefined;
  const rating = Number(searchParams.get('rating')) || undefined;
  const limit = Number(searchParams.get('limit')) || 20;
  const offset = Number(searchParams.get('offset')) || 0;

  // Create a new request with the parsed parameters
  const body = {
    q,
    location,
    cuisine,
    distance,
    priceRange,
    rating,
    limit,
    offset
  };

  const newRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  return POST(newRequest);
}