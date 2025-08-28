import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireMerchant } from '@/lib/guard'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { merchant } = await requireMerchant()
    const venue = await prisma.venue.findFirst({ where: { id: params.id, merchantId: merchant.id } })
    if (!venue) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const data = {
      ...venue,
      businessType: JSON.parse(venue.businessType as string),
      photos: JSON.parse(venue.photos as string),
      hours: JSON.parse(venue.hours as string),
    }
    return NextResponse.json({ venue: data })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to fetch venue' }, { status })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { merchant } = await requireMerchant()
    const body = await req.json()

    const existing = await prisma.venue.findFirst({ where: { id: params.id, merchantId: merchant.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = await prisma.venue.update({
      where: { id: params.id },
      data: {
        name: body.name ?? existing.name,
        slug: body.slug ?? existing.slug,
        address: body.address ?? existing.address,
        latitude: typeof body.latitude === 'number' ? body.latitude : existing.latitude,
        longitude: typeof body.longitude === 'number' ? body.longitude : existing.longitude,
        businessType: body.businessType ? body.businessType : existing.businessType,
        priceTier: body.priceTier ?? existing.priceTier,
        hours: body.hours ? JSON.stringify(body.hours) : existing.hours,
        rating: typeof body.rating === 'number' ? body.rating : existing.rating,
        photos: body.photos ? JSON.stringify(body.photos) : existing.photos,
        isVerified: typeof body.isVerified === 'boolean' ? body.isVerified : existing.isVerified,
      },
    })

    const data = {
      ...updated,
      businessType: JSON.parse(updated.businessType as string),
      photos: JSON.parse(updated.photos as string),
      hours: JSON.parse(updated.hours as string),
    }

    return NextResponse.json({ venue: data })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to update venue' }, { status })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { merchant } = await requireMerchant()
    const existing = await prisma.venue.findFirst({ where: { id: params.id, merchantId: merchant.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.venue.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to delete venue' }, { status })
  }
}

