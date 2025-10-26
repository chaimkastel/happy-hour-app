import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ClaimSchema = z.object({
  dealId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dealId } = ClaimSchema.parse(await request.json());

    // Find the deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            rating: true,
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
    const isLive = deal.status === 'ACTIVE' && 
                    new Date(deal.startAt) <= now &&
                    new Date(deal.endAt) > now;

    if (!isLive) {
      return NextResponse.json(
        { error: 'Deal is not currently available' },
        { status: 400 }
      );
    }

    // Generate unique voucher code
    const code = `HH${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Create voucher
    const voucher = await prisma.redemption.create({
      data: {
        code,
        dealId: deal.id,
        userId: session.user.id,
        status: 'ISSUED',
        expiresAt: new Date(deal.endAt),
        qrData: JSON.stringify({
          code,
          dealId: deal.id,
          venueId: deal.venueId,
          userId: session.user.id,
          timestamp: new Date().toISOString()
        })
      }
    });

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        deal: {
          id: deal.id,
          title: deal.title,
          description: deal.description,
          percentOff: deal.percentOff,
          minSpend: deal.minSpend,
          venue: deal.venue
        },
        expiresAt: voucher.expiresAt,
        qrData: voucher.qrData
      }
    });

  } catch (error) {
    console.error('Claim deal error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to claim deal' },
      { status: 500 }
    );
  }
}