import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: session.user.id },
      select: { status: true },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: merchant.status,
    });
  } catch (error) {
    console.error('Error fetching merchant status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchant status' },
      { status: 500 }
    );
  }
}

