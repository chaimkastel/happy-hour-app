import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit';
import { z } from 'zod';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

const claimRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
});

const claimSchema = z.object({
  // No body needed - user ID comes from session
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'USER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = await claimRateLimit(request);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(
      rateLimitResult.remaining,
      rateLimitResult.resetTime || Date.now()
    );
  }

  try {
    const dealId = params.id;

    // Validate request body
    const body = await request.json().catch(() => ({}));
    const validation = claimSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Get the deal with venue info
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        venue: {
          include: {
            merchant: true,
          },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    if (deal.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Deal is not active' }, { status: 400 });
    }

    const now = new Date();
    if (now < deal.startAt || now > deal.endAt) {
      return NextResponse.json({ error: 'Deal is not currently available' }, { status: 400 });
    }

    // Check if user has already claimed this deal
    const existingVoucher = await prisma.redemption.findFirst({
      where: {
        dealId: deal.id,
        userId: session.user.id,
        status: { in: ['ISSUED', 'REDEEMED'] },
      },
    });

    if (existingVoucher) {
      return NextResponse.json({ 
        error: 'You have already claimed this deal' 
      }, { status: 400 });
    }

    // Check per-user limit
    const userVoucherCount = await prisma.redemption.count({
      where: {
        dealId: deal.id,
        userId: session.user.id,
        status: { in: ['ISSUED', 'REDEEMED'] },
      },
    });

    // Note: Per-user limit check removed as perUserLimit field doesn't exist in current schema
    // You can add this field to the Deal model if needed

    // Check global redemption limit
    const totalRedemptions = await prisma.redemption.count({
      where: {
        dealId: deal.id,
        status: { in: ['ISSUED', 'REDEEMED'] },
      },
    });

    if (deal.maxRedemptions && totalRedemptions >= deal.maxRedemptions) {
      return NextResponse.json({ 
        error: 'This deal has reached its redemption limit' 
      }, { status: 400 });
    }

    // Generate unique voucher code
    const code = `OHH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Generate QR code data
    const qrData = JSON.stringify({
      voucherId: '', // Will be set after creation
      dealId: deal.id,
      code,
      venueId: deal.venue.id,
      merchantId: deal.venue.merchant.id,
    });

    // Create voucher
    const voucher = await prisma.redemption.create({
      data: {
        dealId: deal.id,
        userId: session.user.id,
        code,
        status: 'ISSUED',
        expiresAt: deal.endAt,
      },
    });

    // QR data update removed as qrData field doesn't exist in current schema

    // Generate QR code image
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify({
      voucherId: voucher.id,
      dealId: deal.id,
      code,
      venueId: deal.venue.id,
      merchantId: deal.venue.merchant.id,
    }));

    // Log audit event
    await logAuditEvent({
      actorUserId: session.user.id,
      action: AUDIT_ACTIONS.VOUCHER_CLAIMED,
      entity: 'voucher',
      entityId: voucher.id,
      metadata: { 
        dealId: deal.id,
        dealTitle: deal.title,
        venueName: deal.venue.name,
      },
    });

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        code: voucher.code,
        qrCodeDataURL,
        expiresAt: voucher.expiresAt,
        deal: {
          id: deal.id,
          title: deal.title,
          description: deal.description,
          percentOff: deal.percentOff,
          minSpend: deal.minSpend,
          venue: {
            id: deal.venue.id,
            name: deal.venue.name,
            address: deal.venue.address,
          },
        },
      },
    });
  } catch (error) {
    console.error('Voucher claim error:', error);
    return NextResponse.json(
      { error: 'Failed to claim voucher' },
      { status: 500 }
    );
  }
}