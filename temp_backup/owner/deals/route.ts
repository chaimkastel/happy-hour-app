import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireMerchant } from '@/lib/guard'
import { logAuditEvent } from '@/lib/audit'
import { withStrictValidation, withAuthAndRateLimit } from '@/lib/middleware'
import { dealSchema } from '@/lib/validation'

// GET /api/owner/deals?page=1&pageSize=20&status=LIVE&venueId=...&q=...
export const GET = withAuthAndRateLimit(async (req: NextRequest) => {
  try {
    const { merchant } = await requireMerchant()
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '20')))
    const q = (searchParams.get('q') || '').trim()
    const status = (searchParams.get('status') || '').trim()
    const venueId = (searchParams.get('venueId') || '').trim()

    // Restrict to merchant's venues
    const merchantVenueIds = (
      await prisma.venue.findMany({ where: { merchantId: merchant.id }, select: { id: true } })
    ).map(v => v.id)

    const where: any = { venueId: { in: merchantVenueIds } }
    if (q) where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
    if (status) where.status = status
    if (venueId) where.venueId = venueId

    const [total, items] = await Promise.all([
      prisma.deal.count({ where }),
      prisma.deal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { venue: { select: { id: true, name: true } } },
      }),
    ])

    const data = items.map(d => ({ ...d, tags: JSON.parse(d.tags as string) }))

    return NextResponse.json({ page, pageSize, total, items: data })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to fetch deals' }, { status })
  }
})

// POST /api/owner/deals
export const POST = withStrictValidation(async (req: NextRequest) => {
  try {
    const { merchant } = await requireMerchant()
    const body = await req.json()

    // Verify venue ownership
    const venue = await prisma.venue.findFirst({ where: { id: body.venueId, merchantId: merchant.id } })
    if (!venue) return NextResponse.json({ error: 'Invalid venue' }, { status: 400 })

    const created = await prisma.deal.create({
      data: {
        venueId: String(body.venueId),
        title: String(body.title),
        description: String(body.description || ''),
        percentOff: Number(body.percentOff),
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        maxRedemptions: Number(body.maxRedemptions || 0),
        redeemedCount: 0,
        minSpend: body.minSpend != null ? Number(body.minSpend) : null,
        inPersonOnly: !!body.inPersonOnly,
        tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
        status: String(body.status || 'DRAFT'),
      },
      include: { venue: { select: { id: true, name: true } } },
    })

    // Log audit event
    await logAuditEvent({
      merchantId: merchant.id,
      entityType: 'DEAL',
      entityId: created.id,
      action: 'CREATE',
      changes: { deal: created },
      metadata: { userAgent: req.headers.get('user-agent') }
    })

    const data = { ...created, tags: JSON.parse(created.tags as string) }
    return NextResponse.json({ deal: data }, { status: 201 })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to create deal' }, { status })
  }
}, dealSchema)

