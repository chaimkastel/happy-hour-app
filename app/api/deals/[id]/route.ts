import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            businessType: true,
            priceTier: true,
            rating: true,
            latitude: true,
            longitude: true,
            photos: true,
            hours: true
          }
        }
      }
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(deal);

  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}
