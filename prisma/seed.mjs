import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // Create comprehensive user base with realistic locations
  const users = [
    // Crown Heights residents
    { email: 'sarah.johnson@email.com', phone: '+17185551234', role: 'USER', location: 'Crown Heights, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    { email: 'mike.chen@email.com', phone: '+17185551235', role: 'USER', location: 'Crown Heights, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    { email: 'jessica.rodriguez@email.com', phone: '+17185551236', role: 'USER', location: 'Crown Heights, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    
    // East Flatbush residents
    { email: 'david.williams@email.com', phone: '+17185551237', role: 'USER', location: 'East Flatbush, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    { email: 'amanda.brown@email.com', phone: '+17185551238', role: 'USER', location: 'East Flatbush, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    
    // Park Slope residents
    { email: 'robert.davis@email.com', phone: '+17185551239', role: 'USER', location: 'Park Slope, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    { email: 'lisa.miller@email.com', phone: '+17185551240', role: 'USER', location: 'Park Slope, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    
    // Williamsburg residents
    { email: 'james.wilson@email.com', phone: '+17185551241', role: 'USER', location: 'Williamsburg, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    { email: 'maria.garcia@email.com', phone: '+17185551242', role: 'USER', location: 'Williamsburg, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    
    // Manhattan residents
    { email: 'thomas.moore@email.com', phone: '+17185551243', role: 'USER', location: 'East Village, Manhattan, NY', preferredCities: ['Manhattan', 'New York'] },
    { email: 'jennifer.taylor@email.com', phone: '+17185551244', role: 'USER', location: 'Upper East Side, Manhattan, NY', preferredCities: ['Manhattan', 'New York'] },
    { email: 'christopher.anderson@email.com', phone: '+17185551245', role: 'USER', location: 'SoHo, Manhattan, NY', preferredCities: ['Manhattan', 'New York'] },
    
    // Queens residents
    { email: 'daniel.thomas@email.com', phone: '+17185551246', role: 'USER', location: 'Astoria, Queens, NY', preferredCities: ['Queens', 'New York'] },
    { email: 'michelle.jackson@email.com', phone: '+17185551247', role: 'USER', location: 'Long Island City, Queens, NY', preferredCities: ['Queens', 'New York'] },
    
    // Bronx residents
    { email: 'anthony.white@email.com', phone: '+17185551248', role: 'USER', location: 'South Bronx, Bronx, NY', preferredCities: ['Bronx', 'New York'] },
    
    // Merchants
    { email: 'merchant@example.com', phone: '+1234567891', role: 'MERCHANT', location: 'Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    { email: 'restaurant.owner@email.com', phone: '+17185551249', role: 'MERCHANT', location: 'Crown Heights, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] },
    { email: 'spa.manager@email.com', phone: '+17185551250', role: 'MERCHANT', location: 'Park Slope, Brooklyn, NY', preferredCities: ['Brooklyn', 'New York'] }
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        preferredCities: JSON.stringify(userData.preferredCities),
        location: userData.location
      }
    });
    createdUsers.push(user);
  }

  console.log(`✅ Created ${createdUsers.length} users with diverse locations`);

  // Create merchant profiles for all merchant users
  const merchantUsers = createdUsers.filter(user => user.role === 'MERCHANT');
  const merchantProfiles = [];
  
  for (let i = 0; i < merchantUsers.length; i++) {
    const merchantUser = merchantUsers[i];
    const businessNames = [
      'Brooklyn Hospitality Group',
      'Crown Heights Eatery',
      'Park Slope Wellness Center'
    ];
    
    const merchantProfile = await prisma.merchant.upsert({
      where: { userId: merchantUser.id },
      update: {},
      create: {
        userId: merchantUser.id,
        businessName: businessNames[i] || `Business ${i + 1}`,
        abnOrEIN: `12-345678${i}`,
        kycStatus: 'VERIFIED'
      }
    });
    merchantProfiles.push(merchantProfile);
  }

  console.log(`✅ Created ${merchantProfiles.length} merchant profiles`);

  // Create comprehensive venues across different neighborhoods
  const venues = [
    // Crown Heights venues
    {
      name: 'Crown Heights Trattoria',
      slug: 'crown-heights-trattoria',
      address: '123 Nostrand Ave, Crown Heights, Brooklyn, NY 11216',
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
      name: 'Crown Heights Coffee Co.',
      slug: 'crown-heights-coffee',
      address: '456 Franklin Ave, Crown Heights, Brooklyn, NY 11216',
      latitude: 40.6701,
      longitude: -73.9502,
      businessType: JSON.stringify(['Coffee', 'Cafe', 'Breakfast']),
      priceTier: 'BUDGET',
      hours: JSON.stringify({
        monday: { open: '06:00', close: '18:00' },
        tuesday: { open: '06:00', close: '18:00' },
        wednesday: { open: '06:00', close: '18:00' },
        thursday: { open: '06:00', close: '18:00' },
        friday: { open: '06:00', close: '19:00' },
        saturday: { open: '07:00', close: '19:00' },
        sunday: { open: '07:00', close: '17:00' }
      }),
      rating: 4.3,
      photos: JSON.stringify([
        'https://picsum.photos/seed/coffee1/800/600',
        'https://picsum.photos/seed/coffee2/800/600'
      ]),
      isVerified: true
    },
    
    // Park Slope venues
    {
      name: 'Serenity Spa & Wellness',
      slug: 'serenity-spa',
      address: '456 7th Ave, Park Slope, Brooklyn, NY 11215',
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
      name: 'Park Slope Bistro',
      slug: 'park-slope-bistro',
      address: '789 5th Ave, Park Slope, Brooklyn, NY 11215',
      latitude: 40.6722,
      longitude: -73.9782,
      businessType: JSON.stringify(['Restaurant', 'French', 'Bistro']),
      priceTier: 'PREMIUM',
      hours: JSON.stringify({
        monday: { open: '17:00', close: '23:00' },
        tuesday: { open: '17:00', close: '23:00' },
        wednesday: { open: '17:00', close: '23:00' },
        thursday: { open: '17:00', close: '23:00' },
        friday: { open: '17:00', close: '24:00' },
        saturday: { open: '12:00', close: '24:00' },
        sunday: { open: '12:00', close: '22:00' }
      }),
      rating: 4.6,
      photos: JSON.stringify([
        'https://picsum.photos/seed/bistro1/800/600',
        'https://picsum.photos/seed/bistro2/800/600'
      ]),
      isVerified: true
    },
    
    // Williamsburg venues
    {
      name: 'Williamsburg Fitness Hub',
      slug: 'williamsburg-fitness',
      address: '321 Bedford Ave, Williamsburg, Brooklyn, NY 11211',
      latitude: 40.7081,
      longitude: -73.9571,
      businessType: JSON.stringify(['Fitness', 'Gym', 'Classes']),
      priceTier: 'MODERATE',
      hours: JSON.stringify({
        monday: { open: '05:00', close: '23:00' },
        tuesday: { open: '05:00', close: '23:00' },
        wednesday: { open: '05:00', close: '23:00' },
        thursday: { open: '05:00', close: '23:00' },
        friday: { open: '05:00', close: '22:00' },
        saturday: { open: '07:00', close: '21:00' },
        sunday: { open: '07:00', close: '20:00' }
      }),
      rating: 4.4,
      photos: JSON.stringify([
        'https://picsum.photos/seed/fitness1/800/600',
        'https://picsum.photos/seed/fitness2/800/600'
      ]),
      isVerified: true
    },
    
    // East Flatbush venues
    {
      name: 'East Flatbush Market',
      slug: 'east-flatbush-market',
      address: '654 Utica Ave, East Flatbush, Brooklyn, NY 11203',
      latitude: 40.6581,
      longitude: -73.9342,
      businessType: JSON.stringify(['Market', 'Grocery', 'Local']),
      priceTier: 'BUDGET',
      hours: JSON.stringify({
        monday: { open: '08:00', close: '20:00' },
        tuesday: { open: '08:00', close: '20:00' },
        wednesday: { open: '08:00', close: '20:00' },
        thursday: { open: '08:00', close: '20:00' },
        friday: { open: '08:00', close: '21:00' },
        saturday: { open: '08:00', close: '21:00' },
        sunday: { open: '09:00', close: '19:00' }
      }),
      rating: 4.2,
      photos: JSON.stringify([
        'https://picsum.photos/seed/market1/800/600',
        'https://picsum.photos/seed/market2/800/600'
      ]),
      isVerified: true
    }
  ];

  const createdVenues = [];
  for (let i = 0; i < venues.length; i++) {
    const venueData = venues[i];
    const merchantIndex = i % merchantProfiles.length;
    const venue = await prisma.venue.upsert({
      where: { slug: venueData.slug },
      update: {
        ...venueData,
        merchantId: merchantProfiles[merchantIndex].id
      },
      create: {
        ...venueData,
        merchantId: merchantProfiles[merchantIndex].id
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
    // Check if deal already exists
    const existingDeal = await prisma.deal.findFirst({
      where: {
        title: deals[i].title,
        venueId: createdVenues[i % createdVenues.length].id
      }
    });
    
    if (existingDeal) {
      createdDeals.push(existingDeal);
    } else {
      const deal = await prisma.deal.create({
        data: {
          ...deals[i],
          venueId: createdVenues[i % createdVenues.length].id
        }
      });
      createdDeals.push(deal);
    }
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

  // Create sample redemptions to show user activity
  const userUsers = createdUsers.filter(user => user.role === 'USER');
  const sampleRedemptions = [
    { 
      userId: userUsers[0].id, 
      dealId: createdDeals[0].id, 
      code: 'REDEEM001',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      status: 'CLAIMED'
    },
    { 
      userId: userUsers[1].id, 
      dealId: createdDeals[1].id, 
      code: 'REDEEM002',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'CLAIMED'
    },
    { 
      userId: userUsers[2].id, 
      dealId: createdDeals[0].id, 
      code: 'REDEEM003',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'CLAIMED'
    },
    { 
      userId: userUsers[3].id, 
      dealId: createdDeals[2].id, 
      code: 'REDEEM004',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'CLAIMED'
    },
    { 
      userId: userUsers[4].id, 
      dealId: createdDeals[1].id, 
      code: 'REDEEM005',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'CLAIMED'
    },
  ];

  for (const redemptionData of sampleRedemptions) {
    // Check if redemption already exists
    const existingRedemption = await prisma.redemption.findUnique({
      where: { code: redemptionData.code }
    });
    
    if (!existingRedemption) {
      await prisma.redemption.create({
        data: redemptionData
      });
    }
  }

  console.log(`✅ Created ${sampleRedemptions.length} sample redemptions`);

  console.log('🎉 Comprehensive database seeding completed successfully!');
  console.log(`Created ${createdUsers.length} users, ${createdVenues.length} venues, ${createdDeals.length} deals`);
  console.log(`Added ${sampleRedemptions.length} redemptions`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
