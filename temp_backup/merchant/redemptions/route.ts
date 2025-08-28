import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the merchant ID from the authenticated session
    // For now, we'll return sample data
    const sampleRedemptions = [
      {
        id: 'red_001',
        dealId: 'deal_001',
        customerId: 'cust_001',
        redeemedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'REDEEMED',
        deal: {
          title: 'Happy Hour Special',
          percentOff: 50,
          venue: { name: 'Crown Heights Trattoria' }
        }
      },
      {
        id: 'red_002',
        dealId: 'deal_002',
        customerId: 'cust_002',
        redeemedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        status: 'REDEEMED',
        deal: {
          title: 'Lunch Rush Deal',
          percentOff: 30,
          venue: { name: 'Brooklyn Brew House' }
        }
      },
      {
        id: 'red_003',
        dealId: 'deal_003',
        customerId: 'cust_003',
        redeemedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        status: 'PENDING',
        deal: {
          title: 'Weekend Special',
          percentOff: 25,
          venue: { name: 'Sunset Diner' }
        }
      }
    ]

    return NextResponse.json({
      success: true,
      redemptions: sampleRedemptions
    })

  } catch (error) {
    console.error('Error fetching redemptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
