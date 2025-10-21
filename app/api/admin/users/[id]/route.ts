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
            }
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
        total + venue.deals.filter(deal => deal.status === 'ACTIVE').length, 0) || 0,
      totalVouchers: user.merchant?.venues?.reduce((total, venue) => 
        total + venue.deals.reduce((dealTotal, deal) => dealTotal + deal.redemptions.length, 0), 0) || 0,
      totalRevenue: 0, // You might want to calculate this from actual transactions
      venuesCount: user.merchant?.venues?.length || 0,
      subscription: 'INCOMPLETE', // Simplified for now
      approved: user.merchant?.kycStatus === 'APPROVED' || false
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
              active: deal.status === 'ACTIVE'
            }
          });
        }
      }
    }

    // Add voucher activity
    if (user.merchant?.venues) {
      for (const venue of user.merchant.venues) {
        for (const deal of venue.deals) {
          for (const voucher of deal.redemptions) {
            recentActivity.push({
              type: 'voucher_issued',
              description: `Voucher issued: ${deal.title}`,
              timestamp: voucher.createdAt,
              details: {
                dealId: deal.id,
                venueName: venue.name,
                userEmail: voucher.user?.email || 'Anonymous',
                status: voucher.status
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
        companyName: user.merchant.businessName,
        contactEmail: user.email,
        approved: user.merchant.kycStatus === 'APPROVED',
        subscriptionStatus: 'INCOMPLETE', // Simplified for now
        venues: user.merchant.venues.map(venue => ({
          id: venue.id,
          name: venue.name,
          address: venue.address,
          city: venue.address, // Using address since city field doesn't exist
          state: 'Unknown', // Using placeholder since state field doesn't exist
          rating: venue.rating,
          isVerified: venue.isVerified,
          dealsCount: venue.deals.length,
          deals: venue.deals.map(deal => ({
            id: deal.id,
            title: deal.title,
            percentOff: deal.percentOff,
            active: deal.status === 'ACTIVE',
            createdAt: deal.createdAt,
            vouchersCount: deal.redemptions.length
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
