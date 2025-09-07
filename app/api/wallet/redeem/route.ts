import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

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
    const { redemptionId } = body;

    if (!redemptionId) {
      return NextResponse.json(
        { error: 'Redemption ID is required' },
        { status: 400 }
      );
    }

    // Find the redemption
    const redemption = await prisma.redemption.findFirst({
      where: {
        id: redemptionId,
        userId: session.user.id
      },
      include: {
        deal: true
      }
    });

    if (!redemption) {
      return NextResponse.json(
        { error: 'Redemption not found' },
        { status: 404 }
      );
    }

    if (redemption.status !== 'CLAIMED') {
      return NextResponse.json(
        { error: 'This deal has already been used or is expired' },
        { status: 400 }
      );
    }

    // Check if deal is still valid
    const now = new Date();
    const isExpired = new Date(redemption.expiresAt) < now;

    if (isExpired) {
      // Mark as expired
      await prisma.redemption.update({
        where: { id: redemptionId },
        data: { status: 'EXPIRED' }
      });

      return NextResponse.json(
        { error: 'This deal has expired' },
        { status: 400 }
      );
    }

    // Mark as used
    const updatedRedemption = await prisma.redemption.update({
      where: { id: redemptionId },
      data: {
        status: 'USED'
      },
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
      }
    });

    return NextResponse.json({
      message: 'Deal redeemed successfully',
      redemption: {
        id: updatedRedemption.id,
        dealId: updatedRedemption.dealId,
        code: updatedRedemption.code,
        expiresAt: updatedRedemption.expiresAt,
        status: updatedRedemption.status,
        deal: updatedRedemption.deal
      }
    });

  } catch (error) {
    console.error('Error redeeming deal:', error);
    return NextResponse.json(
      { error: 'Failed to redeem deal' },
      { status: 500 }
    );
  }
}
