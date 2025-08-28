import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireMerchant } from '@/lib/guard'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { merchant } = await requireMerchant()
    const deal = await prisma.deal.findFirst({
      where: { id: params.id, venue: { merchantId: merchant.id } },
      include: { venue: { select: { id: true, name: true } } },
    })
    if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const data = { ...deal, tags: JSON.parse(deal.tags as string) }
    return NextResponse.json({ deal: data })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to fetch deal' }, { status })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { merchant } = await requireMerchant()
    const body = await req.json()
    const existing = await prisma.deal.findFirst({ where: { id: params.id, venue: { merchantId: merchant.id } } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Optionally move to another owned venue
    let venueId = existing.venueId
    if (body.venueId) {
      const v = await prisma.venue.findFirst({ where: { id: body.venueId, merchantId: merchant.id } })
      if (!v) return NextResponse.json({ error: 'Invalid venue' }, { status: 400 })
      venueId = v.id
    }

    const updated = await prisma.deal.update({
      where: { id: params.id },
      data: {
        venueId,
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        percentOff: typeof body.percentOff === 'number' ? body.percentOff : existing.percentOff,
        startAt: body.startAt ? new Date(body.startAt) : existing.startAt,
        endAt: body.endAt ? new Date(body.endAt) : existing.endAt,
        maxRedemptions: typeof body.maxRedemptions === 'number' ? body.maxRedemptions : existing.maxRedemptions,
        minSpend: body.minSpend != null ? Number(body.minSpend) : existing.minSpend,
        inPersonOnly: typeof body.inPersonOnly === 'boolean' ? body.inPersonOnly : existing.inPersonOnly,
        tags: body.tags ? JSON.stringify(body.tags) : existing.tags,
        status: body.status ?? existing.status,
      },
      include: { venue: { select: { id: true, name: true } } },
    })

    const data = { ...updated, tags: JSON.parse(updated.tags as string) }
    return NextResponse.json({ deal: data })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to update deal' }, { status })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { merchant } = await requireMerchant()
    const existing = await prisma.deal.findFirst({ where: { id: params.id, venue: { merchantId: merchant.id } } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.deal.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to delete deal' }, { status })
  }
}

