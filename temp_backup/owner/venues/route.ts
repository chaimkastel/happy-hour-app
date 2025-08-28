import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireMerchant } from '@/lib/guard'
import { logAuditEvent } from '@/lib/audit'
import { withStrictValidation, withAuthAndRateLimit } from '@/lib/middleware'
import { venueSchema } from '@/lib/validation'

// GET /api/owner/venues?page=1&pageSize=20&search=term
export const GET = withAuthAndRateLimit(async (req: NextRequest) => {
  try {
    const { merchant } = await requireMerchant()
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '20')))
    const search = (searchParams.get('search') || '').trim()

    const where: any = { merchantId: merchant.id }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [total, items] = await Promise.all([
      prisma.venue.count({ where }),
      prisma.venue.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    const data = items.map(v => ({
      ...v,
      businessType: JSON.parse(v.businessType as string),
      photos: JSON.parse(v.photos as string),
      hours: JSON.parse(v.hours as string),
    }))

    return NextResponse.json({ page, pageSize, total, items: data })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to fetch venues' }, { status })
  }
})

// POST /api/owner/venues
export const POST = withStrictValidation(async (req: NextRequest) => {
  try {
    const { merchant } = await requireMerchant()
    const body = await req.json()

    const created = await prisma.venue.create({
      data: {
        merchantId: merchant.id,
        name: String(body.name),
        slug: String(body.slug),
        address: String(body.address),
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        businessType: Array.isArray(body.businessType) ? body.businessType : [],
        priceTier: String(body.priceTier || 'MODERATE'),
        hours: JSON.stringify(body.hours || {}),
        rating: typeof body.rating === 'number' ? body.rating : 0,
        photos: JSON.stringify(Array.isArray(body.photos) ? body.photos : []),
        isVerified: !!body.isVerified,
      },
    })

    // Log audit event
    await logAuditEvent({
      merchantId: merchant.id,
      entityType: 'VENUE',
      entityId: created.id,
      action: 'CREATE',
      changes: { venue: created },
      metadata: { userAgent: req.headers.get('user-agent') }
    })

    const data = {
      ...created,
      businessType: created.businessType,
      photos: JSON.parse(created.photos as string),
      hours: JSON.parse(created.hours as string),
    }

    return NextResponse.json({ venue: data }, { status: 201 })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to create venue' }, { status })
  }
}, venueSchema)

