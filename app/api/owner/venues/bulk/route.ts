import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireMerchant } from '@/lib/guard'

// GET /api/owner/venues/bulk?format=csv|json&verified=true|false
export async function GET(req: NextRequest) {
  try {
    const { merchant } = await requireMerchant()
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'json'
    const verified = searchParams.get('verified')

    const where: any = { merchantId: merchant.id }
    if (verified !== null) {
      where.isVerified = verified === 'true'
    }

    const venues = await prisma.venue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const data = venues.map(v => ({
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

    if (format === 'csv') {
      const csvHeaders = [
        'id', 'name', 'slug', 'address', 'latitude', 'longitude',
        'businessType', 'priceTier', 'hours', 'rating', 'photos',
        'isVerified', 'createdAt', 'updatedAt'
      ]
      
      const csvRows = [csvHeaders.join(',')]
      for (const venue of data) {
        const row = csvHeaders.map(header => {
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
        csvRows.push(row.join(','))
      }
      
      const csv = csvRows.join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="venues-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Default JSON format
    return NextResponse.json({ 
      count: data.length,
      venues: data 
    })
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to export venues' }, { status })
  }
}

// POST /api/owner/venues/bulk
export async function POST(req: NextRequest) {
  try {
    const { merchant } = await requireMerchant()
    const body = await req.json()
    const { venues, dryRun = false } = body

    if (!Array.isArray(venues)) {
      return NextResponse.json({ error: 'Invalid venues array' }, { status: 400 })
    }

    const results = {
      total: venues.length,
      created: 0,
      updated: 0,
      errors: [] as string[],
      dryRun
    }

    if (dryRun) {
      // Validate all venues without creating
      for (const venue of venues) {
        try {
          // Basic validation
          if (!venue.name || !venue.slug || !venue.address) {
            results.errors.push(`Venue ${venue.name || 'unknown'}: Missing required fields`)
            continue
          }
          
          if (venue.latitude < -90 || venue.latitude > 90) {
            results.errors.push(`Venue ${venue.name}: latitude must be between -90 and 90`)
            continue
          }

          if (venue.longitude < -180 || venue.longitude > 180) {
            results.errors.push(`Venue ${venue.name}: longitude must be between -180 and 180`)
            continue
          }

          if (venue.priceTier && !['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'].includes(venue.priceTier)) {
            results.errors.push(`Venue ${venue.name}: invalid priceTier`)
            continue
          }

          results.created++ // Count as valid for dry run
        } catch (err: any) {
          results.errors.push(`Venue ${venue.name || 'unknown'}: ${err.message}`)
        }
      }
    } else {
      // Actually create/update venues
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
            // Update existing venue
            await prisma.venue.update({
              where: { id: venue.id, merchantId: merchant.id },
              data: venueData
            })
            results.updated++
          } else {
            // Create new venue
            await prisma.venue.create({ data: venueData })
            results.created++
          }
        } catch (err: any) {
          results.errors.push(`Venue ${venue.name || 'unknown'}: ${err.message}`)
        }
      }
    }

    return NextResponse.json(results)
  } catch (err: any) {
    const status = err?.status || 500
    return NextResponse.json({ error: err?.message || 'Failed to bulk import venues' }, { status })
  }
}
