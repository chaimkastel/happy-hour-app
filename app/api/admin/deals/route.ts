import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const deals = await prisma.deal.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data for admin display
    const transformedDeals = deals.map(deal => ({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      percentOff: deal.percentOff,
      status: deal.status,
      startAt: deal.startAt,
      endAt: deal.endAt,
      maxRedemptions: deal.maxRedemptions,
      redeemedCount: deal.redeemedCount,
      minSpend: deal.minSpend,
      inPersonOnly: deal.inPersonOnly,
      tags: deal.tags,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
      venue: {
        id: deal.venue.id,
        name: deal.venue.name,
        address: deal.venue.address,
        businessType: deal.venue.businessType,
        rating: deal.venue.rating,
        isVerified: deal.venue.isVerified
      },
      merchant: {
        id: deal.venue.merchant.id,
        businessName: deal.venue.merchant.businessName,
        email: deal.venue.merchant.user.email,
        kycStatus: deal.venue.merchant.kycStatus
      }
    }));

    return NextResponse.json({
      deals: transformedDeals,
      total: transformedDeals.length
    });
  } catch (error) {
    console.error('Error fetching admin deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealId, status, adminNotes } = body;

    if (!dealId || !status) {
      return NextResponse.json(
        { error: 'Deal ID and status are required' },
        { status: 400 }
      );
    }

    // Update the deal status
    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: {
        status: status,
        updatedAt: new Date()
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

    // Log the admin action (you could create an audit log table)
    console.log(`Admin action: Deal ${dealId} status changed to ${status}`, {
      adminNotes,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: `Deal ${status.toLowerCase()} successfully`,
      deal: {
        id: updatedDeal.id,
        title: updatedDeal.title,
        status: updatedDeal.status
      }
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}