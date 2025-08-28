import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { redemptionId, dealId, customerId } = await request.json()

    if (!redemptionId || !dealId || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields: redemptionId, dealId, customerId' },
        { status: 400 }
      )
    }

    // Check if redemption already exists
    const existingRedemption = await prisma.redemption.findUnique({
      where: { id: redemptionId },
      include: { deal: true }
    })

    if (existingRedemption) {
      return NextResponse.json(
        { error: 'Redemption already processed', redemption: existingRedemption },
        { status: 409 }
      )
    }

    // Get the deal details
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { venue: true }
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Check if deal is still active
    const now = new Date()
    if (new Date(deal.startAt) > now || new Date(deal.endAt) < now) {
      return NextResponse.json(
        { error: 'Deal is not currently active' },
        { status: 400 }
      )
    }

    // Check if deal has reached max redemptions
    const currentRedemptions = await prisma.redemption.count({
      where: { dealId: dealId }
    })

    if (currentRedemptions >= deal.maxRedemptions) {
      return NextResponse.json(
        { error: 'Deal has reached maximum redemptions' },
        { status: 400 }
      )
    }

    // Create the redemption
    const redemption = await prisma.redemption.create({
      data: {
        id: redemptionId,
        dealId: dealId,
        userId: customerId,
        status: 'REDEEMED',
        code: redemptionId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      },
      include: {
        deal: {
          include: {
            venue: true
          }
        }
      }
    })

    // Update the deal's redeemed count
    await prisma.deal.update({
      where: { id: dealId },
      data: { redeemedCount: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      message: 'Redemption processed successfully',
      redemption: redemption
    })

  } catch (error) {
    console.error('Error processing redemption:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
