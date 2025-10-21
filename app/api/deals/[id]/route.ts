import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = paramsSchema.parse(params);

    const deal = await db.deal.findUnique({
      where: { id },
      include: {
        venue: {
          include: {
            merchant: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            redemptions: true
          }
        }
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Calculate redemption count
    const redemptionCount = await db.redemption.count({
      where: {
        dealId: deal.id,
        status: 'REDEEMED'
      }
    });

    return NextResponse.json({ 
      deal: {
        ...deal,
        redemptionCount
      }
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}