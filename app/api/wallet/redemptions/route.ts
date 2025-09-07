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

    // Get user's redemptions
    const redemptions = await prisma.redemption.findMany({
      where: { userId: session.user.id },
      include: {
        deal: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                address: true,
                rating: true,
                latitude: true,
                longitude: true,
                photos: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      redemptions: redemptions.map(redemption => ({
        id: redemption.id,
        dealId: redemption.dealId,
        code: redemption.code,
        expiresAt: redemption.expiresAt,
        status: redemption.status,
        createdAt: redemption.createdAt,
        deal: redemption.deal
      }))
    });

  } catch (error) {
    console.error('Error fetching redemptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redemptions' },
      { status: 500 }
    );
  }
}