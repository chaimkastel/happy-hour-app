import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get real featured deals from database
    const deals = await prisma.deal.findMany({
      where: { 
        status: 'ACTIVE',
        startAt: { lte: new Date() },
        endAt: { gte: new Date() }
      },
      include: {
        venue: {
          include: {
            merchant: {
              include: {
                user: true
              }
            }
          }
        },
        redemptions: {
          where: { status: 'CLAIMED' },
          take: 1
        },
        // favorites field removed as it doesn't exist in current schema
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      take: 6
    });

    const featuredDeals = deals.map(deal => ({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      restaurant: deal.venue.name,
      address: deal.venue.address,
      city: deal.venue.address, // Using address since city field doesn't exist
      state: 'Unknown', // Using placeholder since state field doesn't exist
      rating: deal.venue.rating || 4.5,
      // originalPrice and discountedPrice fields removed as they don't exist in current schema
      percentOff: deal.percentOff,
      timeLeft: calculateTimeLeft(deal.endAt),
      image: Array.isArray(deal.venue.photos) && deal.venue.photos.length > 0 
        ? JSON.parse(deal.venue.photos || '[]')[0] 
        : 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center',
      tags: extractTags(deal.description),
      isNew: isNew(deal.createdAt),
      isTrending: false, // Simplified since favorites field doesn't exist
      vouchersIssued: deal.redemptions?.length || 0,
      favorites: 0, // Simplified since favorites field doesn't exist
    }));

    return NextResponse.json({ deals: featuredDeals });
  } catch (error) {
    console.error('Error fetching featured deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured deals' },
      { status: 500 }
    );
  }
}

function calculateTimeLeft(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function extractTags(description: string): string[] {
  const commonTags = ['Italian', 'Pizza', 'Dinner', 'Bar', 'Cocktails', 'Happy Hour', 'Japanese', 'Sushi', 'Fine Dining', 'Lunch', 'Brunch'];
  const foundTags: string[] = [];
  
  commonTags.forEach(tag => {
    if (description.toLowerCase().includes(tag.toLowerCase())) {
      foundTags.push(tag);
    }
  });
  
  return foundTags.length > 0 ? foundTags.slice(0, 3) : ['Deal', 'Special'];
}

function isNew(createdAt: Date): boolean {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= 7; // New if created within last 7 days
}
