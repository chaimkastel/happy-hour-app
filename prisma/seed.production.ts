import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting production seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.redemption.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.venue.deleteMany()
  await prisma.merchant.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  console.log('👥 Creating sample users...')
  const merchantUser = await prisma.user.create({
    data: {
      email: 'merchant@happyhour.com',
      phone: '+1234567890',
      role: 'MERCHANT'
    }
  })

  const customer1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      phone: '+1234567891',
      role: 'USER'
    }
  })

  // Create merchant
  console.log('🏪 Creating merchant...')
  const merchant = await prisma.merchant.create({
    data: {
      userId: merchantUser.id,
      businessName: 'Brooklyn Eats Collective',
      companyName: 'Brooklyn Eats Collective',
      contactEmail: 'merchant@happyhour.com'
    }
  })

  // Create venue
  console.log('📍 Creating venue...')
  const venue = await prisma.venue.create({
    data: {
      merchantId: merchant.id,
      name: 'The Local Tavern',
      slug: 'the-local-tavern',
      address: '123 Bedford Ave, Brooklyn, NY 11211',
      latitude: 40.7182,
      longitude: -73.9581,
      priceTier: 'MID_RANGE',
      hours: JSON.stringify({
        monday: { open: '11:00', close: '23:00' },
        tuesday: { open: '11:00', close: '23:00' },
        wednesday: { open: '11:00', close: '23:00' },
        thursday: { open: '11:00', close: '23:00' },
        friday: { open: '11:00', close: '01:00' },
        saturday: { open: '10:00', close: '01:00' },
        sunday: { open: '10:00', close: '22:00' }
      }),
      rating: 4.2,
      photos: JSON.stringify(["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"]),
      isVerified: true
    }
  })

  // Create deals
  console.log('🎯 Creating deals...')
  const deal1 = await prisma.deal.create({
    data: {
      venueId: venue.id,
      type: 'HAPPY_HOUR',
      title: 'Happy Hour Special',
      description: '50% off all drinks and appetizers',
      percentOff: 50,
      originalPrice: 2000,
      discountedPrice: 1000,
      startAt: new Date(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      conditions: JSON.stringify(['Valid for dine-in only']),
      maxRedemptions: 100,
      perUserLimit: 1,
      active: true,
      priority: 1
    }
  })

  console.log('✅ Production seed completed!')
  console.log(`Created ${await prisma.user.count()} users`)
  console.log(`Created ${await prisma.merchant.count()} merchants`)
  console.log(`Created ${await prisma.venue.count()} venues`)
  console.log(`Created ${await prisma.deal.count()} deals`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })