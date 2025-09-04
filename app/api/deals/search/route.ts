import { NextRequest, NextResponse } from 'next/server';

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

    // Mock data for now - replace with actual database queries
    const mockDeals = [
      {
        id: '1',
        title: 'Happy Hour Special',
        description: '50% off all drinks and appetizers during our quiet hours',
        percentOff: 50,
        venue: { 
          name: 'The Golden Spoon', 
          address: '123 Main St, Downtown',
          cuisine: 'American',
          rating: 4.7,
          distance: '0.3 mi'
        },
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '10:00 PM',
        originalPrice: 25,
        discountedPrice: 12.50
      },
      {
        id: '2',
        title: 'Lunch Rush Relief',
        description: '30% off lunch entrees when we need to fill tables',
        percentOff: 30,
        venue: { 
          name: 'Bella Vista', 
          address: '456 Oak Ave, Midtown',
          cuisine: 'Italian',
          rating: 4.4,
          distance: '0.8 mi'
        },
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '2:00 PM',
        originalPrice: 20,
        discountedPrice: 14
      },
      {
        id: '3',
        title: 'Dinner for Two',
        description: '25% off dinner for two during our slowest hours',
        percentOff: 25,
        venue: { 
          name: 'Le Petit Bistro', 
          address: '789 Pine St, Uptown',
          cuisine: 'French',
          rating: 4.9,
          distance: '1.2 mi'
        },
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '9:00 PM',
        originalPrice: 80,
        discountedPrice: 60
      },
      {
        id: '4',
        title: 'Late Night Bites',
        description: '40% off late night menu items',
        percentOff: 40,
        venue: { 
          name: 'Midnight Diner', 
          address: '321 Elm St, Night District',
          cuisine: 'Comfort Food',
          rating: 4.2,
          distance: '0.6 mi'
        },
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '2:00 AM',
        originalPrice: 15,
        discountedPrice: 9
      },
      {
        id: '5',
        title: 'Brunch Boost',
        description: '35% off brunch items on slow weekend mornings',
        percentOff: 35,
        venue: { 
          name: 'Sunny Side Up', 
          address: '555 Sunrise Blvd, Eastside',
          cuisine: 'Breakfast',
          rating: 4.6,
          distance: '1.0 mi'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '11:00 AM',
        originalPrice: 18,
        discountedPrice: 11.70
      },
      {
        id: '6',
        title: 'Cocktail Hour',
        description: 'Buy one get one free on all cocktails',
        percentOff: 50,
        venue: { 
          name: 'The Mixing Room', 
          address: '777 Bar St, Entertainment District',
          cuisine: 'Cocktails',
          rating: 4.8,
          distance: '0.4 mi'
        },
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop&crop=center&auto=format&q=80',
        isOpen: true,
        endTime: '8:00 PM',
        originalPrice: 16,
        discountedPrice: 8
      }
    ];

    // Filter deals based on search criteria
    let filteredDeals = mockDeals;

    // Filter by search query
    if (q.trim()) {
      const query = q.toLowerCase();
      filteredDeals = filteredDeals.filter(deal => 
        deal.title.toLowerCase().includes(query) ||
        deal.description.toLowerCase().includes(query) ||
        deal.venue.name.toLowerCase().includes(query) ||
        deal.venue.cuisine.toLowerCase().includes(query)
      );
    }

    // Filter by cuisine
    if (cuisine) {
      filteredDeals = filteredDeals.filter(deal => 
        deal.venue.cuisine.toLowerCase() === cuisine.toLowerCase()
      );
    }

    // Filter by rating
    if (rating) {
      filteredDeals = filteredDeals.filter(deal => 
        deal.venue.rating >= rating
      );
    }

    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filteredDeals = filteredDeals.filter(deal => {
        const price = deal.discountedPrice;
        return price >= min && (max ? price <= max : true);
      });
    }

    // Sort by relevance (for now, just by rating)
    filteredDeals.sort((a, b) => b.venue.rating - a.venue.rating);

    // Apply pagination
    const paginatedDeals = filteredDeals.slice(offset, offset + limit);

    return NextResponse.json({
      deals: paginatedDeals,
      total: filteredDeals.length,
      hasMore: offset + limit < filteredDeals.length,
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