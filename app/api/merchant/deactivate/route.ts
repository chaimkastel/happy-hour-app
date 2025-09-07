import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has merchant or admin role
    if (session.user.role !== 'MERCHANT' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { dealId } = body;

    if (!dealId) {
      return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
    }

    // Verify deal belongs to merchant
    const deal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        venue: {
          merchantId: session.user.id
        }
      }
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found or access denied' }, { status: 404 });
    }

    // Deactivate deal
    await prisma.deal.update({
      where: { id: dealId },
      data: { status: 'INACTIVE' }
    });

    return NextResponse.json({ message: 'Deal deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating deal:', error);
    return NextResponse.json({ error: 'Failed to deactivate deal' }, { status: 500 });
  }
}
