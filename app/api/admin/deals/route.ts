import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/deals - Get all deals with pending approval
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING_APPROVAL';

    const deals = await prisma.deal.findMany({
      where: { status },
      include: {
        venue: {
          include: {
            merchant: {
              include: {
                user: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      deals,
      total: deals.length 
    });
  } catch (error) {
    console.error('Error fetching admin deals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/deals - Update deal status (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const { dealId, status, adminNotes } = await request.json();

    if (!dealId || !status) {
      return NextResponse.json({ error: 'Deal ID and status are required' }, { status: 400 });
    }

    const deal = await prisma.deal.update({
      where: { id: dealId },
      data: { 
        status
        // Note: Admin notes could be stored in tags or a separate field
      },
      include: {
        venue: {
          include: {
            merchant: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ 
      deal,
      message: `Deal ${status === 'LIVE' ? 'approved' : 'rejected'} successfully!`
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}