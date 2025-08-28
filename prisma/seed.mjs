import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      phone: '+1234567890',
      role: 'USER',
      preferredCities: JSON.stringify(['New York', 'Brooklyn'])
    }
  });

  const merchant1 = await prisma.user.upsert({
    where: { email: 'merchant@example.com' },
    update: {},
    create: {
      email: 'merchant@example.com',
      phone: '+1234567891',
      role: 'MERCHANT',
      preferredCities: JSON.stringify(['New York', 'Brooklyn'])
    }
  });

  console.log('✅ Users created');

  // Create merchant profile
  const merchantProfile = await prisma.merchant.upsert({
    where: { userId: merchant1.id },
    update: {},
    create: {
      userId: merchant1.id,
      businessName: 'Brooklyn Hospitality Group',
      abnOrEIN: '12-3456789',
      kycStatus: 'VERIFIED'
    }
  });

  console.log('✅ Merchant profile created');

  // Create sample venues with diverse business types
  const venues = [
    {
      name: 'Crown Heights Trattoria',
      slug: 'crown-heights-trattoria',
      address: '123 Nostrand Ave, Brooklyn, NY 11216',
      latitude: 40.6681,
      longitude: -73.9442,
      businessType: JSON.stringify(['Restaurant', 'Italian', 'Mediterranean']),
      priceTier: 'MODERATE',
      hours: JSON.stringify({
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      }),
      rating: 4.5,
      photos: JSON.stringify([
        'https://picsum.photos/seed/trattoria1/800/600',
        'https://picsum.photos/seed/trattoria2/800/600'
      ]),
      isVerified: true
    },
    {
      name: 'Serenity Spa & Wellness',
      slug: 'serenity-spa',
      address: '456 Atlantic Ave, Brooklyn, NY 11217',
      latitude: 40.6782,
      longitude: -73.9442,
      businessType: JSON.stringify(['Wellness', 'Spa', 'Massage']),
      priceTier: 'PREMIUM',
      hours: JSON.stringify({
        monday: { open: '09:00', close: '20:00' },
        tuesday: { open: '09:00', close: '20:00' },
        wednesday: { open: '09:00', close: '20:00' },
        thursday: { open: '09:00', close: '20:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '10:00', close: '21:00' },
        sunday: { open: '10:00', close: '18:00' }
      }),
      rating: 4.7,
      photos: JSON.stringify([
        'https://picsum.photos/seed/spa1/800/600',
        'https://picsum.photos/seed/spa2/800/600'
      ]),
      isVerified: true
    },
    {
      name: 'Zen Fitness Studio',
      slug: 'zen-fitness',
      address: '789 Ocean Ave, Brooklyn, NY 11226',
      latitude: 40.7282,
      longitude: -73.7949,
      businessType: JSON.stringify(['Fitness', 'Wellness', 'Classes']),
      priceTier: 'MODERATE',
      hours: JSON.stringify({
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '21:00' },
        saturday: { open: '07:00', close: '20:00' },
        sunday: { open: '07:00', close: '19:00' }
      }),
      rating: 4.4,
      photos: JSON.stringify([
        'https://picsum.photos/seed/fitness1/800/600',
        'https://picsum.photos/seed/fitness2/800/600'
      ]),
      isVerified: true
    }
  ];

  const createdVenues = [];
  for (const venueData of venues) {
    const venue = await prisma.venue.create({
      data: {
        ...venueData,
        merchantId: merchantProfile.id
      }
    });
    createdVenues.push(venue);
  }

  console.log('✅ Venues created');

  // Create sample deals with diverse business types
  const now = new Date();
  const deals = [
    {
      title: 'Happy Hour Special',
      description: '50% off all drinks and appetizers during quiet hours',
      percentOff: 50,
      startAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago (already started)
      endAt: new Date(now.getTime() + 4 * 60 * 60 * 1000),   // 4 hours from now
      maxRedemptions: 20,
      minSpend: 25.0,
      inPersonOnly: true,
      tags: JSON.stringify(['happy-hour', 'drinks', 'appetizers']),
      status: 'LIVE'
    },
    {
      title: 'Midday Massage Special',
      description: '40% off 60-minute massage sessions during slow hours',
      percentOff: 40,
      startAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago (already started)
      endAt: new Date(now.getTime() + 3 * 60 * 60 * 1000),   // 3 hours from now
      maxRedemptions: 12,
      minSpend: 45.0,
      inPersonOnly: false,
      tags: JSON.stringify(['wellness', 'massage', 'relaxation']),
      status: 'LIVE'
    },
    {
      title: 'Off-Peak Fitness Class',
      description: '30% off yoga and pilates classes during non-peak hours',
      percentOff: 30,
      startAt: new Date(now.getTime() - 30 * 60 * 1000),     // 30 minutes ago (already started)
      endAt: new Date(now.getTime() + 5 * 60 * 60 * 1000),   // 5 hours from now
      maxRedemptions: 18,
      minSpend: 20.0,
      inPersonOnly: false,
      tags: JSON.stringify(['fitness', 'yoga', 'pilates']),
      status: 'LIVE'
    }
  ];

  const createdDeals = [];
  for (let i = 0; i < deals.length; i++) {
    const deal = await prisma.deal.create({
      data: {
        ...deals[i],
        venueId: createdVenues[i % createdVenues.length].id
      }
    });
    createdDeals.push(deal);
  }

  console.log('✅ Deals created');

  // Create dynamic pricing hints
  const pricingHints = [
    {
      window: 'MON 15:00-17:00',
      recommendedPercentOff: 40,
      confidence: 0.85
    },
    {
      window: 'TUE 14:00-16:00',
      recommendedPercentOff: 35,
      confidence: 0.78
    },
    {
      window: 'WED 16:00-18:00',
      recommendedPercentOff: 45,
      confidence: 0.92
    }
  ];

  for (const hintData of pricingHints) {
    await prisma.dynamicPricingHint.create({
      data: {
        ...hintData,
        venueId: createdVenues[0].id
      }
    });
  }

  console.log('✅ Dynamic pricing hints created');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`Created ${createdVenues.length} venues and ${createdDeals.length} deals`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
