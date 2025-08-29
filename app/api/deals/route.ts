import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { validateRequest, schemas } from '@/lib/validation';

// Force dynamic rendering for deals API
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, rateLimitConfigs.api);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Validate input parameters
    const validation = validateRequest(schemas.dealSearch, {
      search: searchParams.get('search'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      cuisine: searchParams.get('cuisine'),
      maxDistance: searchParams.get('maxDistance'),
      minDiscount: searchParams.get('minDiscount'),
      openNow: searchParams.get('openNow')
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validation.errors },
        { status: 400 }
      );
    }

    const { search, limit, offset, cuisine, maxDistance, minDiscount, openNow } = validation.data;

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
