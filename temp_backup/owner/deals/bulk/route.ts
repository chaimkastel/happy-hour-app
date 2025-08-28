import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireMerchant } from '@/lib/guard'

// GET /api/owner/deals/bulk?format=csv|json&status=LIVE&venueId=...
export async function GET(req: NextRequest) {
  try {
    const { merchant } = await requireMerchant()
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'json'
    const status = searchParams.get('status') || ''
    const venueId = searchParams.get('venueId') || ''

    // Restrict to merchant's venues
    const merchantVenueIds = (
      await prisma.venue.findMany({ where: { merchantId: merchant.id }, select: { id: true } })
    ).map(v => v.id)

    const where: any = { venueId: { in: merchantVenueIds } }
    if (status) where.status = status
    if (venueId) where.venueId = venueId

    const deals = await prisma.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { venue: { select: { id: true, name: true, slug: true } } },
    })

    const data = deals.map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      percentOff: d.percentOff,
      startAt: d.startAt.toISOString(),
      endAt: d.endAt.toISOString(),
      maxRedemptions: d.maxRedemptions,
      redeemedCount: d.redeemedCount,
      minSpend: d.minSpend,
      inPersonOnly: d.inPersonOnly,
      tags: JSON.parse(d.tags as string),
      status: d.status,
      venueId: d.venue.id,
      venueName: d.venue.name,
      venueSlug: d.venue.slug,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }))

    if (format === 'csv') {
      const csvHeaders = [
        'id', 'title', 'description', 'percentOff', 'startAt', 'endAt',
        'maxRedemptions', 'redeemedCount', 'minSpend', 'dineInOnly',
        'tags', 'status', 'venueId', 'venueName', 'venueSlug',
        'createdAt', 'updatedAt'
      ]
      
      const csvRows = [csvHeaders.join(',')]
      for (const deal of data) {
        const row = csvHeaders.map(header => {
          const value = deal[header as keyof typeof deal]
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`
          }
          if (Array.isArray(value)) {
            return `"${value.join(';')}"`
          }
          return value
        })
        csvRows.push(row.join(','))
      }
      
      const csv = csvRows.join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="deals-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Default JSON format
    return NextResponse.json({ 
      count: data.length,
      deals: data 
    })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to export deals' }, { status })
  }
}

// POST /api/owner/deals/bulk
export async function POST(req: NextRequest) {
  try {
    const { merchant } = await requireMerchant()
    const body = await req.json()
    const { deals, format = 'json', dryRun = false } = body

    if (!Array.isArray(deals)) {
      return NextResponse.json({ error: 'Invalid deals array' }, { status: 400 })
    }

    // Verify all venues belong to merchant
    const venueIds = [...new Set(deals.map((d: any) => d.venueId))]
    const merchantVenues = await prisma.venue.findMany({
      where: { id: { in: venueIds }, merchantId: merchant.id },
      select: { id: true }
    })
    const validVenueIds = new Set(merchantVenues.map(v => v.id))

    const invalidVenues = venueIds.filter(id => !validVenueIds.has(id))
    if (invalidVenues.length > 0) {
      return NextResponse.json({ 
        error: `Invalid venues: ${invalidVenues.join(', ')}` 
      }, { status: 400 })
    }

    const results = {
      total: deals.length,
      created: 0,
      updated: 0,
      errors: [] as string[],
      dryRun
    }

    if (dryRun) {
      // Validate all deals without creating
      for (const deal of deals) {
        try {
          // Basic validation
          if (!deal.title || !deal.venueId || !deal.startAt || !deal.endAt) {
            results.errors.push(`Deal ${deal.title || 'unknown'}: Missing required fields`)
            continue
          }
          
          if (deal.percentOff < 5 || deal.percentOff > 50) {
            results.errors.push(`Deal ${deal.title}: percentOff must be between 5-50`)
            continue
          }

          if (new Date(deal.startAt) >= new Date(deal.endAt)) {
            results.errors.push(`Deal ${deal.title}: startAt must be before endAt`)
            continue
          }

          results.created++ // Count as valid for dry run
        } catch (err: any) {
          results.errors.push(`Deal ${deal.title || 'unknown'}: ${err.message}`)
        }
      }
    } else {
      // Actually create/update deals
      for (const deal of deals) {
        try {
          const dealData = {
            venueId: String(deal.venueId),
            title: String(deal.title),
            description: String(deal.description || ''),
            percentOff: Number(deal.percentOff),
            startAt: new Date(deal.startAt),
            endAt: new Date(deal.endAt),
            maxRedemptions: Number(deal.maxRedemptions || 0),
            redeemedCount: Number(deal.redeemedCount || 0),
            minSpend: deal.minSpend != null ? Number(deal.minSpend) : null,
            dineInOnly: !!deal.dineInOnly,
            tags: JSON.stringify(Array.isArray(deal.tags) ? deal.tags : []),
            status: String(deal.status || 'DRAFT'),
          }

          if (deal.id) {
            // Update existing deal
            await prisma.deal.update({
              where: { id: deal.id, venueId: { in: Array.from(validVenueIds) } },
              data: dealData
            })
            results.updated++
          } else {
            // Create new deal
            await prisma.deal.create({ data: dealData })
            results.created++
          }
        } catch (err: any) {
          results.errors.push(`Deal ${deal.title || 'unknown'}: ${err.message}`)
        }
      }
    }

    return NextResponse.json(results)
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to bulk import deals' }, { status })
  }
}
