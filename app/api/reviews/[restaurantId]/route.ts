import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Type assertion for session
type SessionWithUser = {
  user: {
    email: string;
    [key: string]: any;
  };
};

// GET /api/reviews/[restaurantId] - Get reviews for a restaurant
export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const restaurantId = params.restaurantId;

    // For now, return empty reviews since we don't have a reviews table
    // In production, you would implement proper reviews functionality
    const reviews: any[] = [];

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/reviews/[restaurantId] - Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurantId = params.restaurantId;
    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // For now, return a mock review since we don't have a reviews table
    // In production, you would implement proper reviews functionality
    const review = {
      id: 'mock-review-id',
      userId: user.id,
      venueId: restaurantId,
      rating: rating,
      comment: comment || '',
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.email?.split('@')[0] || 'User'
      }
    };

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
