import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's favorite deals
    const favorites = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        favorites: {
          include: {
            deal: {
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
              }
            }
          }
        }
      }
    });

    if (!favorites) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favorites: favorites.favorites.map(fav => ({
        id: fav.id,
        dealId: fav.dealId,
        addedAt: fav.addedAt,
        deal: fav.deal
      }))
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { dealId } = body;

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // Check if deal exists
    const deal = await prisma.deal.findUnique({
      where: { id: dealId }
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        dealId: dealId
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Deal already in favorites' },
        { status: 409 }
      );
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        dealId: dealId,
        addedAt: new Date()
      },
      include: {
        deal: {
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
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Deal added to favorites',
      favorite: {
        id: favorite.id,
        dealId: favorite.dealId,
        addedAt: favorite.addedAt,
        deal: favorite.deal
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get('dealId');

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // Remove from favorites
    const deleted = await prisma.favorite.deleteMany({
      where: {
        userId: session.user.id,
        dealId: dealId
      }
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Deal removed from favorites'
    });

  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}
