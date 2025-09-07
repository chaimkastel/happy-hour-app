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
    const { dealId } = body;

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }

    // Check if deal exists and is live
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
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
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Check if deal is live
    const now = new Date();
    const isLive = deal.status === 'LIVE' && 
                   new Date(deal.startAt) <= now && 
                   new Date(deal.endAt) > now;

    if (!isLive) {
      return NextResponse.json(
        { error: 'Deal is not currently available' },
        { status: 400 }
      );
    }

    // Check if user has already claimed this deal
    const existingRedemption = await prisma.redemption.findFirst({
      where: {
        userId: session.user.id,
        dealId: dealId
      }
    });

    if (existingRedemption) {
      return NextResponse.json(
        { error: 'You have already claimed this deal' },
        { status: 409 }
      );
    }

    // Check if deal has remaining redemptions
    if (deal.redeemedCount >= deal.maxRedemptions) {
      return NextResponse.json(
        { error: 'This deal is no longer available' },
        { status: 400 }
      );
    }

    // Generate unique code
    const code = `HH${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Create redemption
    const redemption = await prisma.redemption.create({
      data: {
        userId: session.user.id,
        dealId: dealId,
        status: 'CLAIMED',
        code: code,
        expiresAt: new Date(deal.endAt)
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

    // Update deal redemption count
    await prisma.deal.update({
      where: { id: dealId },
      data: {
        redeemedCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      message: 'Deal claimed successfully',
      redemption: {
        id: redemption.id,
        dealId: redemption.dealId,
        code: redemption.code,
        expiresAt: redemption.expiresAt,
        status: redemption.status,
        deal: redemption.deal
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error claiming deal:', error);
    return NextResponse.json(
      { error: 'Failed to claim deal' },
      { status: 500 }
    );
  }
}
