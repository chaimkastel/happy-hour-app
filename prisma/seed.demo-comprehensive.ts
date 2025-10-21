import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive demo database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.redemption.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123!', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@happyhour.com',
      password: adminPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create demo users
  const demoUsers = [
    {
      email: 'sarah.chen@demo.com',
      firstName: 'Sarah',
      lastName: 'Chen',
      phone: '+1234567891',
      role: 'USER',
    },
    {
      email: 'mike.johnson@demo.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      phone: '+1234567892',
      role: 'USER',
    },
    {
      email: 'jessica.davis@demo.com',
      firstName: 'Jessica',
      lastName: 'Davis',
      phone: '+1234567893',
      role: 'USER',
    },
    {
      email: 'david.wilson@demo.com',
      firstName: 'David',
      lastName: 'Wilson',
      phone: '+1234567894',
      role: 'USER',
    },
  ];

  const createdUsers = [];
  for (const userData of demoUsers) {
    const userPassword = await bcrypt.hash('demo123!', 12);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: userPassword,
      },
    });
    createdUsers.push(user);
  }

  console.log(`✅ Created ${createdUsers.length} demo users`);

  // Create demo merchants
  const demoMerchants = [
    {
      email: 'merchant1@demo.com',
      firstName: 'Chef',
      lastName: 'Marco',
      phone: '+1234567895',
      companyName: 'Bella Vista Restaurant Group',
      contactEmail: 'merchant1@demo.com',
    },
    {
      email: 'merchant2@demo.com',
      firstName: 'Lisa',
      lastName: 'Rodriguez',
      phone: '+1234567896',
      companyName: 'Downtown Eats Collective',
      contactEmail: 'merchant2@demo.com',
    },
    {
      email: 'merchant3@demo.com',
      firstName: 'James',
      lastName: 'Thompson',
      phone: '+1234567897',
      companyName: 'Craft Kitchen & Bar',
      contactEmail: 'merchant3@demo.com',
    },
  ];

  const createdMerchants = [];
  for (const merchantData of demoMerchants) {
    const merchantPassword = await bcrypt.hash('merchant123!', 12);
    const merchantUser = await prisma.user.create({
      data: {
        email: merchantData.email,
        password: merchantPassword,
        firstName: merchantData.firstName,
        lastName: merchantData.lastName,
        phone: merchantData.phone,
        role: 'MERCHANT',
      },
    });

    const merchant = await prisma.merchant.create({
      data: {
        userId: merchantUser.id,
        businessName: merchantData.companyName,
        companyName: merchantData.companyName,
        contactEmail: merchantData.contactEmail,
        approved: true,
        subscriptionStatus: 'ACTIVE',
        stripeCustomerId: `cus_demo_${merchantUser.id}`,
      },
    });

    createdMerchants.push({ user: merchantUser, merchant });
  }

  console.log(`✅ Created ${createdMerchants.length} demo merchants`);

  // Create demo venues
  const demoVenues = [
    {
      name: 'Bella Vista',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      latitude: 37.7749,
      longitude: -122.4194,
      rating: 4.6,
      photos: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      ],
      merchantIndex: 0,
    },
    {
      name: 'The Local Tavern',
      address: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      latitude: 37.7849,
      longitude: -122.4094,
      rating: 4.3,
      photos: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop',
      ],
      merchantIndex: 0,
    },
    {
      name: 'Downtown Bistro',
      address: '789 Pine Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94104',
      latitude: 37.7949,
      longitude: -122.3994,
      rating: 4.4,
      photos: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop',
      ],
      merchantIndex: 1,
    },
    {
      name: 'Craft Kitchen',
      address: '321 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      latitude: 37.8049,
      longitude: -122.3894,
      rating: 4.7,
      photos: [
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
      ],
      merchantIndex: 2,
    },
    {
      name: 'The Garden Cafe',
      address: '654 Union Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94106',
      latitude: 37.8149,
      longitude: -122.3794,
      rating: 4.2,
      photos: [
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      ],
      merchantIndex: 1,
    },
  ];

  const createdVenues = [];
  for (const venueData of demoVenues) {
    const venue = await prisma.venue.create({
      data: {
        merchantId: createdMerchants[venueData.merchantIndex].merchant.id,
        name: venueData.name,
        slug: venueData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        address: venueData.address,
        latitude: venueData.latitude,
        longitude: venueData.longitude,
        hours: JSON.stringify({
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '22:00' },
          saturday: { open: '10:00', close: '22:00' },
          sunday: { open: '10:00', close: '20:00' },
        }),
        priceTier: 'MID_RANGE',
        isVerified: true,
        rating: venueData.rating,
        photos: JSON.stringify(venueData.photos),
      },
    });
    createdVenues.push(venue);
  }

  console.log(`✅ Created ${createdVenues.length} demo venues`);

  // Create demo deals
  const demoDeals = [
    {
      title: 'Happy Hour Craft Cocktails',
      description: '50% off all craft cocktails during happy hour. Perfect for unwinding after work!',
      type: 'HAPPY_HOUR',
      percentOff: 50,
      originalPrice: 1600,
      discountedPrice: 800,
      venueIndex: 0,
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      timeWindows: [{ start: '15:00', end: '18:00' }],
      maxRedemptions: 100,
      perUserLimit: 2,
    },
    {
      title: 'Weekend Brunch Special',
      description: '30% off all brunch items this weekend. Fresh ingredients, amazing flavors!',
      type: 'INSTANT',
      percentOff: 30,
      originalPrice: 2500,
      discountedPrice: 1750,
      venueIndex: 0,
      daysOfWeek: ['saturday', 'sunday'],
      timeWindows: [{ start: '10:00', end: '15:00' }],
      maxRedemptions: 50,
      perUserLimit: 1,
    },
    {
      title: 'Pizza Night Deal',
      description: 'Buy one pizza, get one 50% off. Perfect for sharing with friends!',
      type: 'INSTANT',
      percentOff: 25,
      originalPrice: 2000,
      discountedPrice: 1500,
      venueIndex: 1,
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeWindows: [{ start: '17:00', end: '21:00' }],
      maxRedemptions: 75,
      perUserLimit: 1,
    },
    {
      title: 'Lunch Express',
      description: 'Quick lunch specials with 40% off select menu items. Fast, fresh, and affordable!',
      type: 'INSTANT',
      percentOff: 40,
      originalPrice: 1800,
      discountedPrice: 1080,
      venueIndex: 2,
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      timeWindows: [{ start: '11:00', end: '14:00' }],
      maxRedemptions: 60,
      perUserLimit: 1,
    },
    {
      title: 'Dinner Date Night',
      description: 'Special dinner menu with 35% off. Perfect for a romantic evening out!',
      type: 'INSTANT',
      percentOff: 35,
      originalPrice: 3500,
      discountedPrice: 2275,
      venueIndex: 3,
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      timeWindows: [{ start: '18:00', end: '21:00' }],
      maxRedemptions: 40,
      perUserLimit: 1,
    },
    {
      title: 'Coffee & Pastry Combo',
      description: 'Get a coffee and pastry for just $8. Start your day right!',
      type: 'INSTANT',
      percentOff: 20,
      originalPrice: 1200,
      discountedPrice: 960,
      venueIndex: 4,
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeWindows: [{ start: '07:00', end: '11:00' }],
      maxRedemptions: 80,
      perUserLimit: 2,
    },
  ];

  const createdDeals = [];
  for (const dealData of demoDeals) {
    const deal = await prisma.deal.create({
      data: {
        venueId: createdVenues[dealData.venueIndex].id,
        type: dealData.type,
        title: dealData.title,
        description: dealData.description,
        percentOff: dealData.percentOff,
        originalPrice: dealData.originalPrice,
        discountedPrice: dealData.discountedPrice,
        startAt: new Date(),
        endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        conditions: JSON.stringify([
          'Valid for dine-in only',
          'Cannot be combined with other offers',
          'Subject to availability',
        ]),
        maxRedemptions: dealData.maxRedemptions,
        perUserLimit: dealData.perUserLimit,
        active: true,
        priority: Math.floor(Math.random() * 10) + 1,
      },
    });
    createdDeals.push(deal);
  }

  console.log(`✅ Created ${createdDeals.length} demo deals`);

  // Create demo redemptions (vouchers)
  const demoRedemptions = [];
  for (let i = 0; i < 15; i++) {
    const user = createdUsers[i % createdUsers.length];
    const deal = createdDeals[i % createdDeals.length];
    const status = i < 8 ? 'ISSUED' : i < 12 ? 'REDEEMED' : 'EXPIRED';
    
    const redemption = await prisma.redemption.create({
      data: {
        userId: user.id,
        dealId: deal.id,
        code: `DEMO${String(i + 1).padStart(3, '0')}`,
        status: status,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        ...(status === 'REDEEMED' && { redeemedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) }),
      },
    });
    demoRedemptions.push(redemption);
  }

  console.log(`✅ Created ${demoRedemptions.length} demo redemptions`);

  // Create demo favorites
  const demoFavorites = [];
  for (let i = 0; i < 8; i++) {
    const user = createdUsers[i % createdUsers.length];
    const deal = createdDeals[i % createdDeals.length];
    
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        dealId: deal.id,
      },
    });
    demoFavorites.push(favorite);
  }

  console.log(`✅ Created ${demoFavorites.length} demo favorites`);

  console.log('🎉 Comprehensive demo database seeded successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('Admin: admin@happyhour.com / admin123!');
  console.log('Users: sarah.chen@demo.com, mike.johnson@demo.com, etc. / demo123!');
  console.log('Merchants: merchant1@demo.com, merchant2@demo.com, etc. / merchant123!');
  console.log('\n📊 Demo Data Created:');
  console.log(`- ${createdUsers.length} users`);
  console.log(`- ${createdMerchants.length} merchants`);
  console.log(`- ${createdVenues.length} venues`);
  console.log(`- ${createdDeals.length} deals`);
  console.log(`- ${demoRedemptions.length} redemptions/vouchers`);
  console.log(`- ${demoFavorites.length} favorites`);
  console.log('\n⚠️  These are demo accounts only - never use in production!');
}

main()
  .catch((e) => {
    console.error('❌ Demo seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
