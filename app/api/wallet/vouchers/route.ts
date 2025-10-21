import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vouchers = await prisma.redemption.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        deal: {
          include: {
            venue: {
              select: {
                name: true,
                address: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      vouchers: vouchers.map(voucher => ({
        id: voucher.id,
        code: voucher.code,
        qrData: voucher.code, // Use code as QR data
        status: voucher.status,
        issuedAt: voucher.createdAt.toISOString(),
        expiresAt: voucher.expiresAt?.toISOString(),
        redeemedAt: voucher.status === 'REDEEMED' ? voucher.updatedAt.toISOString() : null,
        deal: {
          id: voucher.deal.id,
          title: voucher.deal.title,
          description: voucher.deal.description,
          percentOff: voucher.deal.percentOff,
          originalPrice: voucher.deal.originalPrice,
          discountedPrice: voucher.deal.discountedPrice,
          venue: voucher.deal.venue,
        },
      })),
    });

  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
