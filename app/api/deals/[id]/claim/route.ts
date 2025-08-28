import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if deal exists and is still valid
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        venue: {
          select: {
            name: true,
            address: true
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

    // Check if deal is still active
    const now = new Date();
    if (now > new Date(deal.endAt)) {
      return NextResponse.json(
        { error: 'Deal has expired' },
        { status: 400 }
      );
    }

    if (deal.status !== 'LIVE') {
      return NextResponse.json(
        { error: 'Deal is not currently active' },
        { status: 400 }
      );
    }

    // Check if user has already claimed this deal
    const existingRedemption = await prisma.redemption.findFirst({
      where: {
        dealId: dealId,
        userId: userId,
        status: { in: ['CLAIMED', 'REDEEMED'] }
      }
    });

    if (existingRedemption) {
      return NextResponse.json(
        { error: 'You have already claimed this deal' },
        { status: 400 }
      );
    }

    // Check if deal is fully claimed
    if (deal.redeemedCount >= deal.maxRedemptions) {
      return NextResponse.json(
        { error: 'Deal is fully claimed' },
        { status: 400 }
      );
    }

    // Generate unique redemption code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let redemptionCode;
    let isUnique = false;
    let attempts = 0;

    // Ensure code is unique
    while (!isUnique && attempts < 10) {
      redemptionCode = generateCode();
      const existingCode = await prisma.redemption.findUnique({
        where: { code: redemptionCode }
      });
      if (!existingCode) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique redemption code' },
        { status: 500 }
      );
    }

    // Create redemption with expiration time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const redemption = await prisma.redemption.create({
      data: {
        dealId: dealId,
        userId: userId,
        code: redemptionCode!,
        status: 'CLAIMED',
        expiresAt: expiresAt
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

    // Return redemption details
    return NextResponse.json({
      success: true,
      redemption: {
        id: redemption.id,
        code: redemption.code,
        status: redemption.status,
        expiresAt: redemption.expiresAt,
        createdAt: redemption.createdAt
      },
      deal: {
        id: deal.id,
        title: deal.title,
        percentOff: deal.percentOff,
        venue: deal.venue
      }
    });

  } catch (error) {
    console.error('Error claiming deal:', error);
    return NextResponse.json(
      { error: 'Failed to claim deal' },
      { status: 500 }
    );
  }
}
