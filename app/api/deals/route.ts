import { NextRequest, NextResponse } from 'next/server';
import { fetchDeals, DealFilters } from '@/lib/server/deals';
import { checkRateLimit } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimitError = checkRateLimit(request);
    if (rateLimitError) return rateLimitError;

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const filters: DealFilters = {
      search: searchParams.get('search') || searchParams.get('q') || '',
      cuisine: searchParams.get('cuisine') || '',
      minDiscount: searchParams.get('minDiscount') || '',
      openNow: searchParams.get('openNow') === 'true' || searchParams.get('openNow') === '1',
      sortBy: (searchParams.get('sortBy') || searchParams.get('sort') || 'newest') as any,
      limit: parseInt(searchParams.get('limit') || searchParams.get('take') || '20'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    // Fetch deals using server-side function
    const result = await fetchDeals(filters);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in deals API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch deals',
        deals: [],
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false
      },
      { status: 500 }
    );
  }
}