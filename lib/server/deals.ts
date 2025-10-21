import { prisma } from '@/lib/db';

export interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  startAt: string;
  endAt: string;
  maxRedemptions: number;
  redeemedCount: number;
  minSpend?: number;
  venue: {
    id: string;
    name: string;
    address: string;
    businessType: string[];
    priceTier: string;
    rating: number;
    latitude: number;
    longitude: number;
    photos: string[];
  };
}

export interface DealsResponse {
  deals: Deal[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface DealFilters {
  search?: string;
  cuisine?: string;
  minDiscount?: string;
  openNow?: boolean;
  sortBy?: 'newest' | 'discount' | 'rating' | 'distance';
  limit?: number;
  offset?: number;
}

export async function fetchDeals(filters: DealFilters = {}): Promise<DealsResponse> {
  try {
    const {
      search = '',
      cuisine = '',
      minDiscount = '',
      openNow = false,
      sortBy = 'newest',
      limit = 20,
      offset = 0
    } = filters;

    // Build where clause
    const where: any = {
      status: 'ACTIVE',
      startAt: { lte: new Date() },
      endAt: { gte: new Date() }
    };

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Cuisine filter
    if (cuisine) {
      where.venue = {
        ...where.venue,
        businessType: { has: cuisine }
      };
    }

    // Min discount filter
    if (minDiscount) {
      where.percentOff = { gte: parseInt(minDiscount) };
    }

    // Open now filter (simplified - just check if venue is verified)
    if (openNow) {
      where.venue = {
        ...where.venue,
        isVerified: true
      };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'discount':
        orderBy = { percentOff: 'desc' };
        break;
      case 'rating':
        orderBy = { venue: { rating: 'desc' } };
        break;
      case 'distance':
        // For now, just sort by newest since we don't have user location
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Fetch deals
    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              address: true,
              priceTier: true,
              rating: true,
              latitude: true,
              longitude: true,
              photos: true
            }
          }
        }
      }),
      prisma.deal.count({ where })
    ]);

    // Transform the data
    const transformedDeals: Deal[] = deals.map(deal => ({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      percentOff: deal.percentOff || 0,
      startAt: deal.startAt.toISOString(),
      endAt: deal.endAt.toISOString(),
      maxRedemptions: deal.maxRedemptions || 0,
      redeemedCount: 0, // Placeholder since redeemedCount doesn't exist
      minSpend: undefined, // Placeholder since minSpend doesn't exist
      venue: {
        id: deal.venue.id,
        name: deal.venue.name,
        address: deal.venue.address,
        businessType: [], // Placeholder since businessType doesn't exist
        priceTier: deal.venue.priceTier,
        rating: deal.venue.rating || 0,
        latitude: deal.venue.latitude,
        longitude: deal.venue.longitude,
        photos: Array.isArray(deal.venue.photos) ? deal.venue.photos.filter((photo): photo is string => typeof photo === 'string') : []
      }
    }));

    return {
      deals: transformedDeals,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    };

  } catch (error) {
    console.error('Error fetching deals:', error);
    return {
      deals: [],
      total: 0,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      hasMore: false
    };
  }
}
