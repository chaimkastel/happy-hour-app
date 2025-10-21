import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { ok, bad, unauthorized, notFound } from '@/lib/api';
import { userRateLimit, rateLimitConfigs, createRateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const redeemSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user.role !== 'MERCHANT' && session.user.role !== 'ADMIN')) {
    return unauthorized('Merchant or admin access required');
  }

  // Rate limiting
  const redeemLimiter = userRateLimit(rateLimitConfigs.redeem);
  const rateLimitResult = await redeemLimiter(request);
  
  if (!rateLimitResult.success) {
    return createRateLimitResponse(
      rateLimitResult.remaining || 0,
      rateLimitResult.resetTime || Date.now()
    );
  }

  try {
    const body = await request.json();
    const validation = redeemSchema.safeParse(body);
    
    if (!validation.success) {
      return bad('Invalid request body', 'VALIDATION_ERROR', 400);
    }

    const { code } = validation.data;

    // Check for idempotency key
    const idempotencyKey = request.headers.get('Idempotency-Key');
    if (idempotencyKey) {
      const existingResponse = await prisma.idempotencyKey.findUnique({
        where: { key: idempotencyKey },
      });

      if (existingResponse && existingResponse.expiresAt > new Date()) {
        return new NextResponse(existingResponse.response, {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Atomic transaction for redemption
    const result = await prisma.$transaction(async (tx) => {
      // Find voucher by code with deal and venue info
      const voucher = await tx.redemption.findUnique({
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
        throw new Error('VOUCHER_NOT_FOUND');
      }

      // Check if already redeemed
      if (voucher.redeemedAt) {
        throw new Error('ALREADY_REDEEMED');
      }

      // Check if deal is active and within time window
      const now = new Date();
      if (voucher.deal.status !== 'ACTIVE') {
        throw new Error('DEAL_INACTIVE');
      }

      if (now < voucher.deal.startAt || now > voucher.deal.endAt) {
        throw new Error('DEAL_EXPIRED');
      }

      // Check if voucher is expired
      if (voucher.expiresAt && now > voucher.expiresAt) {
        throw new Error('VOUCHER_EXPIRED');
      }

      // Check if voucher is cancelled
      if (voucher.status === 'CANCELLED') {
        throw new Error('VOUCHER_CANCELLED');
      }

      // For merchants, verify they own the venue
      if (session.user.role === 'MERCHANT') {
        const merchant = await tx.merchant.findUnique({
          where: { userId: session.user.id },
        });

        if (!merchant || voucher.deal.venue.merchantId !== merchant.id) {
          throw new Error('UNAUTHORIZED_VENUE');
        }
      }

      // Update voucher as redeemed
      const updatedVoucher = await tx.redemption.update({
        where: { id: voucher.id },
        data: {
          status: 'REDEEMED',
          redeemedAt: now,
        },
      });

      // Update deal redemption count
      await tx.deal.update({
        where: { id: voucher.deal.id },
        data: {
          redeemedCount: {
            increment: 1,
          },
        },
      });

      return {
        redemptionId: updatedVoucher.id,
        redeemedAt: updatedVoucher.redeemedAt,
        dealTitle: voucher.deal.title,
        customerName: voucher.user ? `${voucher.user.firstName} ${voucher.user.lastName}` : 'Unknown',
        venueName: voucher.deal.venue.name,
      };
    });

    const response = ok({
      redemptionId: result.redemptionId,
      redeemedAt: result.redeemedAt,
      dealTitle: result.dealTitle,
      customerName: result.customerName,
      venueName: result.venueName,
    });

    // Store idempotency response if key provided
    if (idempotencyKey) {
      await prisma.idempotencyKey.upsert({
        where: { key: idempotencyKey },
        update: {
          response: await response.text(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
        create: {
          key: idempotencyKey,
          response: await response.text(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });
    }

    return response;

  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Redemption error:', error);
    }

    switch (error.message) {
      case 'VOUCHER_NOT_FOUND':
        return notFound('Invalid voucher code');
      case 'ALREADY_REDEEMED':
        return bad('This voucher has already been redeemed', 'ALREADY_REDEEMED', 400);
      case 'DEAL_INACTIVE':
        return bad('Deal is not active', 'DEAL_INACTIVE', 400);
      case 'DEAL_EXPIRED':
        return bad('Deal has expired', 'DEAL_EXPIRED', 400);
      case 'VOUCHER_EXPIRED':
        return bad('Voucher has expired', 'VOUCHER_EXPIRED', 400);
      case 'VOUCHER_CANCELLED':
        return bad('Voucher has been cancelled', 'VOUCHER_CANCELLED', 400);
      case 'UNAUTHORIZED_VENUE':
        return unauthorized('You can only redeem vouchers for your own venues');
      default:
        return bad('Internal server error', 'SERVER_ERROR', 500);
    }
  }
}
