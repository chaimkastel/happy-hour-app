import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        deal: {
          include: {
            venue: {
              select: {
                name: true,
                address: true,
                rating: true,
                photos: true,
              },
            },
          },
        },
      },
      orderBy: {
        addedAt: 'desc',
      },
    });

    return NextResponse.json({
      favorites: favorites.map(favorite => ({
        id: favorite.id,
        deal: {
          id: favorite.deal.id,
          title: favorite.deal.title,
          description: favorite.deal.description,
          percentOff: favorite.deal.percentOff,
          originalPrice: favorite.deal.originalPrice,
          discountedPrice: favorite.deal.discountedPrice,
          startAt: favorite.deal.startAt,
          endAt: favorite.deal.endAt,
          venue: favorite.deal.venue,
        },
        createdAt: favorite.addedAt,
      })),
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}