import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const redemption = await prisma.redemption.findUnique({
      where: { id: params.id },
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            venue: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!redemption) {
      return NextResponse.json(
        { error: 'Redemption not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(redemption);
  } catch (error) {
    console.error('Error fetching redemption:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redemption' },
      { status: 500 }
    );
  }
}
