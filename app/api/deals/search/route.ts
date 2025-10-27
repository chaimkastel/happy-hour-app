import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Rate limit: 100 requests per 15 minutes
const searchRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

const searchSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await searchRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const location = searchParams.get('location') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate input
    const validationResult = searchSchema.safeParse({
      q: query,
      location,
      limit,
      offset,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {
      status: 'ACTIVE',
      startAt: { lte: new Date() },
      endAt: { gte: new Date() },
    };

    // Add search conditions
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { venue: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }

    // Add location filter if provided
    if (location) {
      where.venue = {
        ...where.venue,
        OR: [
          { city: { contains: location, mode: 'insensitive' } },
          { state: { contains: location, mode: 'insensitive' } },
          { address: { contains: location, mode: 'insensitive' } },
        ],
      };
    }

    // Get total count for pagination
    const total = await prisma.deal.count({ where });

    // Fetch deals with pagination
    const deals = await prisma.deal.findMany({
      where,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            // city, state, zip fields don't exist in current schema
            latitude: true,
            longitude: true,
            rating: true,
            photos: true,
          },
        },
        _count: {
          select: {
            redemptions: true,
            favorites: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      deals: deals.map(deal => ({
        id: deal.id,
        // type field removed as it doesn't exist in current schema
        title: deal.title,
        description: deal.description,
        percentOff: deal.percentOff,
        // originalPrice and discountedPrice fields removed as they don't exist in current schema
        startAt: deal.startAt,
        endAt: deal.endAt,
        // conditions field removed as it doesn't exist in current schema
        maxRedemptions: deal.maxRedemptions,
        // perUserLimit field removed as it doesn't exist in current schema
        // priority field removed as it doesn't exist in current schema
        venue: deal.venue,
        redemptionsCount: deal._count.redemptions,
        // favoritesCount removed as favorites field doesn't exist in current schema
      })),
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search deals' },
      { status: 500 }
    );
  }
}