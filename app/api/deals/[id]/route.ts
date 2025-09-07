import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;

    // Find the deal with venue information
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
            hours: true,
            merchant: {
              select: {
                businessName: true,
                user: {
                  select: {
                    phone: true
                  }
                }
              }
            }
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

    // Check if deal is still live
    const now = new Date();
    const isLive = deal.status === 'LIVE' && 
                   new Date(deal.startAt) <= now && 
                   new Date(deal.endAt) > now;

    // Format the response
    const response = {
      id: deal.id,
      title: deal.title,
      description: deal.description,
      percentOff: deal.percentOff,
      startAt: deal.startAt,
      endAt: deal.endAt,
      maxRedemptions: deal.maxRedemptions,
      redeemedCount: deal.redeemedCount,
      minSpend: deal.minSpend,
      inPersonOnly: deal.inPersonOnly,
      tags: deal.tags,
      status: deal.status,
      isLive,
      venue: {
        id: deal.venue.id,
        name: deal.venue.name,
        address: deal.venue.address,
        businessType: deal.venue.businessType,
        priceTier: deal.venue.priceTier,
        rating: deal.venue.rating,
        latitude: deal.venue.latitude,
        longitude: deal.venue.longitude,
        photos: deal.venue.photos,
        hours: deal.venue.hours,
        phone: deal.venue.merchant.user.phone,
        businessName: deal.venue.merchant.businessName
      },
      terms: `Valid ${deal.inPersonOnly ? 'for in-person dining only' : 'for both in-person and takeout'}. Cannot be combined with other offers. Subject to availability.`,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Deal API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}