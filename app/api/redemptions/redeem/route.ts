import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const redeemRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20,
});

const redeemSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user.role !== 'MERCHANT' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = await redeemRateLimit(request);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(
      rateLimitResult.remaining,
      rateLimitResult.resetTime || Date.now()
    );
  }

  try {
    const body = await request.json();
    const validation = redeemSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { code } = validation.data;

    // Find the voucher
    const voucher = await prisma.redemption.findUnique({
      where: { code },
      include: {
        deal: {
          include: {
            venue: {
              include: {
                merchant: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!voucher) {
      return NextResponse.json({ 
        error: 'Invalid voucher code' 
      }, { status: 404 });
    }

    // Check if voucher is already redeemed
    if (voucher.status === 'REDEEMED') {
      return NextResponse.json({ 
        error: 'This voucher has already been redeemed',
        details: {
          redeemedAt: voucher.redeemedAt,
          dealTitle: voucher.deal.title,
          customerName: voucher.user ? `${voucher.user.firstName} ${voucher.user.lastName}` : 'Unknown',
        }
      }, { status: 400 });
    }

    // Check if voucher is expired
    if (voucher.status === 'EXPIRED' || (voucher.expiresAt && new Date() > voucher.expiresAt)) {
      return NextResponse.json({ 
        error: 'This voucher has expired' 
      }, { status: 400 });
    }

    // Check if voucher is cancelled
    if (voucher.status === 'CANCELLED') {
      return NextResponse.json({ 
        error: 'This voucher has been cancelled' 
      }, { status: 400 });
    }

    // For merchants, verify they own the venue
    if (session.user.role === 'MERCHANT') {
      const merchant = await prisma.merchant.findUnique({
        where: { userId: session.user.id },
      });

      if (!merchant || voucher.deal.venue.merchantId !== merchant.id) {
        return NextResponse.json({ 
          error: 'You can only redeem vouchers for your own venues' 
        }, { status: 403 });
      }
    }

    // Check if deal is still active
    if (!voucher.deal.active) {
      return NextResponse.json({ 
        error: 'This deal is no longer active' 
      }, { status: 400 });
    }

    // Check if deal is within time window
    const now = new Date();
    if (now < voucher.deal.startAt || now > voucher.deal.endAt) {
      return NextResponse.json({ 
        error: 'This deal is not currently available' 
      }, { status: 400 });
    }

    // Redeem the voucher
    const redeemedVoucher = await prisma.redemption.update({
      where: { id: voucher.id },
      data: {
        status: 'REDEEMED',
        redeemedAt: new Date(),
      },
      include: {
        deal: {
          include: {
            venue: true,
          },
        },
        user: true,
      },
    });

    // Log audit event
    await logAuditEvent({
      actorUserId: session.user.id,
      action: AUDIT_ACTIONS.VOUCHER_REDEEMED,
      entity: 'voucher',
      entityId: voucher.id,
      metadata: { 
        code: voucher.code,
        dealId: voucher.deal.id,
        dealTitle: voucher.deal.title,
        venueName: voucher.deal.venue.name,
        customerEmail: voucher.user?.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Voucher redeemed successfully',
      voucher: {
        id: redeemedVoucher.id,
        code: redeemedVoucher.code,
        status: redeemedVoucher.status,
        redeemedAt: redeemedVoucher.redeemedAt,
        deal: {
          id: redeemedVoucher.deal.id,
          title: redeemedVoucher.deal.title,
          description: redeemedVoucher.deal.description,
          percentOff: redeemedVoucher.deal.percentOff,
          originalPrice: redeemedVoucher.deal.originalPrice,
          discountedPrice: redeemedVoucher.deal.discountedPrice,
          venue: {
            id: redeemedVoucher.deal.venue.id,
            name: redeemedVoucher.deal.venue.name,
            address: redeemedVoucher.deal.venue.address,
          },
        },
        customer: voucher.user ? {
          id: voucher.user.id,
          name: `${voucher.user.firstName} ${voucher.user.lastName}`,
          email: voucher.user.email,
        } : null,
      },
    });
  } catch (error) {
    console.error('Voucher redemption error:', error);
    return NextResponse.json(
      { error: 'Failed to redeem voucher' },
      { status: 500 }
    );
  }
}