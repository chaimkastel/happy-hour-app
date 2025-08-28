import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireMerchant } from '@/lib/guard'
import { withBulkOperationLimit } from '@/lib/middleware'

// GET /api/owner/bulk?format=csv|json&type=venues|deals|all
export const GET = withBulkOperationLimit(async (req: NextRequest) => {
  try {
    const { merchant } = await requireMerchant()
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'json'
    const type = searchParams.get('type') || 'all'

    const result: any = {}

    if (type === 'venues' || type === 'all') {
      const venues = await prisma.venue.findMany({
        where: { merchantId: merchant.id },
        orderBy: { createdAt: 'desc' },
      })

      result.venues = venues.map(v => ({
        id: v.id,
        name: v.name,
        slug: v.slug,
        address: v.address,
        latitude: v.latitude,
        longitude: v.longitude,
        businessType: JSON.parse(v.businessType as string),
        priceTier: v.priceTier,
        hours: JSON.parse(v.hours as string),
        rating: v.rating,
        photos: JSON.parse(v.photos as string),
        isVerified: v.isVerified,
        createdAt: v.createdAt.toISOString(),
        updatedAt: v.updatedAt.toISOString(),
      }))
    }

    if (type === 'deals' || type === 'all') {
      const merchantVenueIds = (
        await prisma.venue.findMany({ where: { merchantId: merchant.id }, select: { id: true } })
      ).map(v => v.id)

      const deals = await prisma.deal.findMany({
        where: { venueId: { in: merchantVenueIds } },
        orderBy: { createdAt: 'desc' },
        include: { venue: { select: { id: true, name: true, slug: true } } },
      })

      result.deals = deals.map(d => ({
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
    }

    if (format === 'csv') {
      // For CSV, we'll create separate files or combine them
      const csvData: string[] = []
      
      if (result.venues) {
        csvData.push('=== VENUES ===')
        const venueHeaders = [
          'id', 'name', 'slug', 'address', 'latitude', 'longitude',
          'businessType', 'priceTier', 'hours', 'rating', 'photos',
          'isVerified', 'createdAt', 'updatedAt'
        ]
        csvData.push(venueHeaders.join(','))
        
        for (const venue of result.venues) {
          const row = venueHeaders.map(header => {
            const value = venue[header as keyof typeof venue]
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value.replace(/"/g, '""')}"`
            }
            if (Array.isArray(value)) {
              return `"${value.join(';')}"`
            }
            if (typeof value === 'object') {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`
            }
            return value
          })
          csvData.push(row.join(','))
        }
        csvData.push('') // Empty line separator
      }

      if (result.deals) {
        csvData.push('=== DEALS ===')
        const dealHeaders = [
          'id', 'title', 'description', 'percentOff', 'startAt', 'endAt',
          'maxRedemptions', 'redeemedCount', 'minSpend', 'inPersonOnly',
          'tags', 'status', 'venueId', 'venueName', 'venueSlug',
          'createdAt', 'updatedAt'
        ]
        csvData.push(dealHeaders.join(','))
        
        for (const deal of result.deals) {
          const row = dealHeaders.map(header => {
            const value = deal[header as keyof typeof deal]
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value.replace(/"/g, '""')}"`
            }
            if (Array.isArray(value)) {
              return `"${value.join(';')}"`
            }
            return value
          })
          csvData.push(row.join(','))
        }
      }
      
      const csv = csvData.join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="bulk-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Default JSON format
    return NextResponse.json({
      count: {
        venues: result.venues?.length || 0,
        deals: result.deals?.length || 0,
      },
      ...result
    })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to export data' }, { status })
  }
})

// POST /api/owner/bulk
export const POST = withBulkOperationLimit(async (req: NextRequest) => {
  try {
    const { merchant } = await requireMerchant()
    const body = await req.json()
    const { venues, deals, dryRun = false } = body

    const results = {
      venues: { total: 0, created: 0, updated: 0, errors: [] as string[] },
      deals: { total: 0, created: 0, updated: 0, errors: [] as string[] },
      dryRun
    }

    // Process venues if provided
    if (Array.isArray(venues)) {
      results.venues.total = venues.length
      
      if (dryRun) {
        // Validate venues without creating
        for (const venue of venues) {
          try {
            if (!venue.name || !venue.slug || !venue.address) {
              results.venues.errors.push(`Venue ${venue.name || 'unknown'}: Missing required fields`)
              continue
            }
            
            if (venue.latitude < -90 || venue.latitude > 90) {
              results.venues.errors.push(`Venue ${venue.name}: latitude must be between -90 and 90`)
              continue
            }

            if (venue.longitude < -180 || venue.longitude > 180) {
              results.venues.errors.push(`Venue ${venue.name}: longitude must be between -180 and 180`)
              continue
            }

            if (venue.priceTier && !['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'].includes(venue.priceTier)) {
              results.venues.errors.push(`Venue ${venue.name}: invalid priceTier`)
              continue
            }

            results.venues.created++
          } catch (err: any) {
            results.venues.errors.push(`Venue ${venue.name || 'unknown'}: ${err.message}`)
          }
        }
      } else {
        // Create/update venues
        for (const venue of venues) {
          try {
            const venueData = {
              merchantId: merchant.id,
              name: String(venue.name),
              slug: String(venue.slug),
              address: String(venue.address),
              latitude: Number(venue.latitude),
              longitude: Number(venue.longitude),
              businessType: JSON.stringify(Array.isArray(venue.businessType) ? venue.businessType : []),
              priceTier: String(venue.priceTier || 'MODERATE'),
              hours: JSON.stringify(venue.hours || {}),
              rating: typeof venue.rating === 'number' ? venue.rating : 0,
              photos: JSON.stringify(Array.isArray(venue.photos) ? venue.photos : []),
              isVerified: !!venue.isVerified,
            }

            if (venue.id) {
              await prisma.venue.update({
                where: { id: venue.id, merchantId: merchant.id },
                data: venueData
              })
              results.venues.updated++
            } else {
              await prisma.venue.create({ data: venueData })
              results.venues.created++
            }
          } catch (err: any) {
            results.venues.errors.push(`Venue ${venue.name || 'unknown'}: ${err.message}`)
          }
        }
      }
    }

    // Process deals if provided
    if (Array.isArray(deals)) {
      results.deals.total = deals.length
      
      // Get valid venue IDs for deal validation
      const merchantVenueIds = (
        await prisma.venue.findMany({ where: { merchantId: merchant.id }, select: { id: true } })
      ).map(v => v.id)
      const validVenueIds = new Set(merchantVenueIds)

      if (dryRun) {
        // Validate deals without creating
        for (const deal of deals) {
          try {
            if (!deal.title || !deal.venueId || !deal.startAt || !deal.endAt) {
              results.deals.errors.push(`Deal ${deal.title || 'unknown'}: Missing required fields`)
              continue
            }
            
            if (!validVenueIds.has(deal.venueId)) {
              results.deals.errors.push(`Deal ${deal.title}: Invalid venue ID`)
              continue
            }
            
            if (deal.percentOff < 5 || deal.percentOff > 50) {
              results.deals.errors.push(`Deal ${deal.title}: percentOff must be between 5-50`)
              continue
            }

            if (new Date(deal.startAt) >= new Date(deal.endAt)) {
              results.deals.errors.push(`Deal ${deal.title}: startAt must be before endAt`)
              continue
            }

            results.deals.created++
          } catch (err: any) {
            results.deals.errors.push(`Deal ${deal.title || 'unknown'}: ${err.message}`)
          }
        }
      } else {
        // Create/update deals
        for (const deal of deals) {
          try {
            if (!validVenueIds.has(deal.venueId)) {
              results.deals.errors.push(`Deal ${deal.title}: Invalid venue ID`)
              continue
            }

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
              await prisma.deal.update({
                where: { id: deal.id, venueId: { in: Array.from(validVenueIds) } },
                data: dealData
              })
              results.deals.updated++
            } else {
              await prisma.deal.create({ data: dealData })
              results.deals.created++
            }
          } catch (err: any) {
            results.deals.errors.push(`Deal ${deal.title || 'unknown'}: ${err.message}`)
          }
        }
      }
    }

    return NextResponse.json(results)
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to bulk import data' }, { status })
  }
})
