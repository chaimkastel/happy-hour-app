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

    // Update merchant status
    const merchant = await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: 'APPROVED',
        approved: true,
        kycStatus: 'VERIFIED',
      },
    });

    // TODO: Send approval email to merchant

    return NextResponse.json({
      success: true,
      message: 'Merchant approved successfully',
      merchant: {
        id: merchant.id,
        businessName: merchant.businessName,
        status: merchant.status,
      },
    });
  } catch (error) {
    console.error('Error approving merchant:', error);
    return NextResponse.json(
      { error: 'Failed to approve merchant' },
      { status: 500 }
    );
  }
}

