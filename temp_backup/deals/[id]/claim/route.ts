import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await req.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get the deal
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: { venue: true }
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Check if deal is live
    if (deal.status !== 'LIVE') {
      return NextResponse.json(
        { error: 'Deal is not available for claiming' },
        { status: 400 }
      )
    }

    // Check if deal has expired
    if (new Date() > new Date(deal.endAt)) {
      return NextResponse.json(
        { error: 'Deal has expired' },
        { status: 400 }
      )
    }

    // Check if user already has an active claim for this deal
    const existingClaim = await prisma.redemption.findFirst({
      where: {
        dealId: params.id,
        userId: userId,
        status: { in: ['CLAIMED', 'SCANNED'] },
        expiresAt: { gt: new Date() }
      }
    })

    if (existingClaim) {
      return NextResponse.json(
        { error: 'You already have an active claim for this deal' },
        { status: 400 }
      )
    }

    // Check if deal has available redemptions
    if (deal.redeemedCount >= deal.maxRedemptions) {
      return NextResponse.json(
        { error: 'Deal is fully claimed' },
        { status: 400 }
      )
    }

    // Generate unique claim code
    const claimCode = `HH-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Date.now().toString(36)}`

    // Calculate expiry time (2 hours from now or deal end time, whichever is sooner)
    const now = new Date()
    const dealEnd = new Date(deal.endAt)
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    const expiresAt = dealEnd < twoHoursFromNow ? dealEnd : twoHoursFromNow

    // Create redemption
    const redemption = await prisma.redemption.create({
      data: {
        dealId: params.id,
        userId: userId,
        status: 'CLAIMED',
        code: claimCode,
        expiresAt: expiresAt
      }
    })

    // Increment redeemed count
    await prisma.deal.update({
      where: { id: params.id },
      data: { redeemedCount: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      redemption: {
        id: redemption.id,
        code: redemption.code,
        expiresAt: redemption.expiresAt,
        status: redemption.status
      },
      deal: {
        id: deal.id,
        title: deal.title,
        venue: deal.venue.name,
        address: deal.venue.address
      }
    })

  } catch (error) {
    console.error('Claim error:', error)
    return NextResponse.json(
      { error: 'Failed to claim deal' },
      { status: 500 }
    )
  }
}

