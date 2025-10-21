import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const RedeemSchema = z.object({
  code: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = RedeemSchema.parse(await request.json());

    // Find the voucher
    const voucher = await prisma.redemption.findFirst({
      where: {
        code: code,
        userId: session.user.id,
        status: 'ISSUED'
      },
      include: {
        deal: {
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
        }
      }
    });

    if (!voucher) {
      return NextResponse.json(
        { error: 'Invalid or expired voucher code' },
        { status: 404 }
      );
    }

    // Check if voucher is expired
    if (voucher.expiresAt && new Date() > new Date(voucher.expiresAt)) {
      return NextResponse.json(
        { error: 'Voucher has expired' },
        { status: 400 }
      );
    }

    // Update voucher status to redeemed
    await prisma.redemption.update({
      where: { id: voucher.id },
      data: { 
        status: 'REDEEMED',
        redeemedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Voucher redeemed successfully!',
      voucher: {
        id: voucher.id,
        code: voucher.code,
        deal: {
          id: voucher.deal.id,
          title: voucher.deal.title,
          description: voucher.deal.description,
          percentOff: voucher.deal.percentOff,
          originalPrice: voucher.deal.originalPrice,
          discountedPrice: voucher.deal.discountedPrice,
          venue: voucher.deal.venue
        },
        redeemedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Redeem voucher error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to redeem voucher' },
      { status: 500 }
    );
  }
}