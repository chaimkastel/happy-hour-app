import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// Type assertion for session
type SessionWithUser = {
  user: {
    email: string;
    [key: string]: any;
  };
};

// GET /api/merchant/deals/[id] - Get specific deal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dealId = params.id;

    // Get the deal and verify ownership
    const deal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        venue: {
          merchant: {
            user: { email: session.user.email }
          }
        }
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ deal });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/merchant/deals/[id] - Update deal
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dealId = params.id;
    const body = await request.json();

    // Verify the deal belongs to this merchant
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        venue: {
          merchant: {
            user: { email: session.user.email }
          }
        }
      }
    });

    if (!existingDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Update the deal
    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: body
    });

    return NextResponse.json({ deal: updatedDeal });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/merchant/deals/[id] - Delete deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions) as SessionWithUser | null;
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dealId = params.id;

    // Verify the deal belongs to this merchant
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: dealId,
        venue: {
          merchant: {
            user: { email: session.user.email }
          }
        }
      }
    });

    if (!existingDeal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Delete the deal
    await prisma.deal.delete({
      where: { id: dealId }
    });

    return NextResponse.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
