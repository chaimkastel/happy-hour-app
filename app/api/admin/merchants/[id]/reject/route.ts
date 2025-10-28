import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchantId = params.id;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // Update merchant status
    const merchant = await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: 'REJECTED',
        approved: false,
        rejectionReason: reason,
      },
    });

    // TODO: Send rejection email to merchant

    return NextResponse.json({
      success: true,
      message: 'Merchant rejected successfully',
      merchant: {
        id: merchant.id,
        businessName: merchant.businessName,
        status: merchant.status,
      },
    });
  } catch (error) {
    console.error('Error rejecting merchant:', error);
    return NextResponse.json(
      { error: 'Failed to reject merchant' },
      { status: 500 }
    );
  }
}

