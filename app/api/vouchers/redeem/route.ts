import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const redeemSchema = z.object({
  voucherId: z.string().min(1, 'Voucher ID is required'),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { voucherId } = redeemSchema.parse(body);

    // Find the voucher
    const voucher = await prisma.redemption.findUnique({
      where: { id: voucherId },
      include: {
        deal: {
          include: {
            venue: true,
          },
        },
      },
    });

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    }

    // Check if voucher belongs to user
    if (voucher.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if voucher is already redeemed
    if (voucher.status === 'REDEEMED') {
      return NextResponse.json({ error: 'Voucher already redeemed' }, { status: 400 });
    }

    // Check if voucher is expired
    if (voucher.expiresAt && voucher.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Voucher has expired' }, { status: 400 });
    }

    // Check if deal is still active
    if (!voucher.deal.active) {
      return NextResponse.json({ error: 'Deal is no longer active' }, { status: 400 });
    }

    // Update voucher status
    const updatedVoucher = await prisma.redemption.update({
      where: { id: voucherId },
      data: {
        status: 'REDEEMED',
        redeemedAt: new Date(),
      },
    });

    // Log the redemption
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: 'VOUCHER_REDEEMED',
        entity: 'voucher',
        entityId: voucherId,
        metadata: {
          dealId: voucher.dealId,
          venueId: voucher.deal.venueId,
          dealTitle: voucher.deal.title,
        },
      },
    });

    return NextResponse.json({
      success: true,
      voucher: {
        id: updatedVoucher.id,
        code: updatedVoucher.code,
        status: updatedVoucher.status,
        redeemedAt: updatedVoucher.redeemedAt,
        deal: voucher.deal,
      },
    });
  } catch (error) {
    console.error('Voucher redemption error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to redeem voucher' },
      { status: 500 }
    );
  }
}
