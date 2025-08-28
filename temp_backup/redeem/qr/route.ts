import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import QRCode from 'qrcode';

// Force dynamic rendering for QR generation
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get('dealId');
    
    if (!dealId) {
      return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
    }

    // Fetch deal with venue information
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
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

    if (deal.status !== 'LIVE') {
      return NextResponse.json({ error: 'Deal is not active' }, { status: 400 });
    }

    if (new Date() > deal.endAt) {
      return NextResponse.json({ error: 'Deal has expired' }, { status: 400 });
    }

    // Create redemption data
    const redemptionData = {
      dealId: deal.id,
      venueId: deal.venue.id,
      venueName: deal.venue.name,
      dealTitle: deal.title,
      percentOff: deal.percentOff,
      expiresAt: deal.endAt
    };

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(redemptionData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      redemptionData,
      deal: {
        id: deal.id,
        title: deal.title,
        description: deal.description,
        percentOff: deal.percentOff,
        endAt: deal.endAt,
        venue: deal.venue
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
