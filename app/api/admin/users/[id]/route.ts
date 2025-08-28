import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Get detailed user information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchant: {
          include: {
            venues: {
              include: {
                deals: {
                  include: {
                    redemptions: {
                      include: {
                        user: {
                          select: {
                            email: true,
                            role: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            subscription: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate user contributions and statistics
    const contributions = {
      totalDeals: user.merchant?.venues?.reduce((total, venue) => total + venue.deals.length, 0) || 0,
      activeDeals: user.merchant?.venues?.reduce((total, venue) => 
        total + venue.deals.filter(deal => deal.status === 'LIVE').length, 0) || 0,
      totalRedemptions: user.merchant?.venues?.reduce((total, venue) => 
        total + venue.deals.reduce((dealTotal, deal) => dealTotal + deal.redemptions.length, 0), 0) || 0,
      totalRevenue: 0, // You might want to calculate this from actual transactions
      venuesCount: user.merchant?.venues?.length || 0,
      subscription: user.merchant?.subscription?.plan || 'FREE',
      kycStatus: user.merchant?.kycStatus || 'N/A'
    };

    // Get recent activity
    const recentActivity = [];
    
    // Add deal creation activity
    if (user.merchant?.venues) {
      for (const venue of user.merchant.venues) {
        for (const deal of venue.deals) {
          recentActivity.push({
            type: 'deal_created',
            description: `Created deal: ${deal.title}`,
            timestamp: deal.createdAt,
            details: {
              dealId: deal.id,
              venueName: venue.name,
              percentOff: deal.percentOff,
              status: deal.status
            }
          });
        }
      }
    }

    // Add redemption activity
    if (user.merchant?.venues) {
      for (const venue of user.merchant.venues) {
        for (const deal of venue.deals) {
          for (const redemption of deal.redemptions) {
            recentActivity.push({
              type: 'redemption',
              description: `Deal redeemed: ${deal.title}`,
              timestamp: redemption.createdAt,
              details: {
                dealId: deal.id,
                venueName: venue.name,
                redeemerEmail: redemption.user.email,
                amount: deal.percentOff
              }
            });
          }
        }
      }
    }

    // Sort by timestamp (most recent first)
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Transform the data for admin display
    const userDetails = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: true, // You might want to add this field to your User model
      merchant: user.merchant ? {
        id: user.merchant.id,
        businessName: user.merchant.businessName,
        kycStatus: user.merchant.kycStatus,
        subscription: user.merchant.subscription?.plan || 'FREE',
        venues: user.merchant.venues.map(venue => ({
          id: venue.id,
          name: venue.name,
          address: venue.address,
          businessType: venue.businessType,
          rating: venue.rating,
          isVerified: venue.isVerified,
          dealsCount: venue.deals.length,
          deals: venue.deals.map(deal => ({
            id: deal.id,
            title: deal.title,
            percentOff: deal.percentOff,
            status: deal.status,
            createdAt: deal.createdAt,
            redemptionsCount: deal.redemptions.length
          }))
        }))
      } : null,
      contributions,
      recentActivity: recentActivity.slice(0, 20) // Last 20 activities
    };

    return NextResponse.json({
      user: userDetails
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}
