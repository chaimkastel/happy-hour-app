import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@happyhour.com' },
    update: {},
    create: {
      email: 'admin@happyhour.com',
      password: adminPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create test merchant user
  const merchantPassword = await bcrypt.hash('merchant123!', 12);
  const merchantUser = await prisma.user.upsert({
    where: { email: 'merchant@test.com' },
    update: {},
    create: {
      email: 'merchant@test.com',
      password: merchantPassword,
      role: 'MERCHANT',
      firstName: 'Test',
      lastName: 'Merchant',
      phone: '+1234567891',
    },
  });

  // Create merchant profile
  const merchant = await prisma.merchant.upsert({
    where: { userId: merchantUser.id },
    update: {},
    create: {
      userId: merchantUser.id,
      businessName: 'Test Restaurant Group',
      companyName: 'Test Restaurant Group',
      contactEmail: 'merchant@test.com',
      approved: true,
      subscriptionStatus: 'ACTIVE',
      stripeCustomerId: 'cus_test_merchant',
    },
  });

  console.log('✅ Test merchant created:', merchant.companyName);

  // Create test venue
  const venue = await prisma.venue.upsert({
    where: { id: 'venue_test_1' },
    update: {},
    create: {
      id: 'venue_test_1',
      merchantId: merchant.id,
      name: 'The Test Kitchen',
      slug: 'the-test-kitchen',
      address: '123 Main Street',
      latitude: 37.7749,
      longitude: -122.4194,
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
      rating: 4.5,
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      ]),
    },
  });

  console.log('✅ Test venue created:', venue.name);

  // Create Happy Hour deal
  const happyHourDeal = await prisma.deal.upsert({
    where: { id: 'deal_happy_hour_1' },
    update: {},
    create: {
      id: 'deal_happy_hour_1',
      venueId: venue.id,
      type: 'HAPPY_HOUR',
      title: 'Happy Hour Craft Cocktails',
      description: '50% off all craft cocktails during happy hour. Perfect for unwinding after work!',
      percentOff: 50,
      originalPrice: 1600, // $16.00 in cents
      discountedPrice: 800, // $8.00 in cents
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      conditions: JSON.stringify([
        'Valid for dine-in only',
        'Cannot be combined with other offers',
        'Subject to availability',
      ]),
      maxRedemptions: 100,
      perUserLimit: 2,
      active: true,
      priority: 10,
    },
  });

  console.log('✅ Happy Hour deal created:', happyHourDeal.title);

  // Create Instant deal
  const instantDeal = await prisma.deal.upsert({
    where: { id: 'deal_instant_1' },
    update: {},
    create: {
      id: 'deal_instant_1',
      venueId: venue.id,
      type: 'INSTANT',
      title: 'Weekend Brunch Special',
      description: '30% off all brunch items this weekend. Fresh ingredients, amazing flavors!',
      percentOff: 30,
      originalPrice: 2500, // $25.00 in cents
      discountedPrice: 1750, // $17.50 in cents
      startAt: new Date(),
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      conditions: JSON.stringify([
        'Valid for brunch items only',
        'Weekend special',
        'Cannot be combined with other offers',
      ]),
      maxRedemptions: 50,
      perUserLimit: 1,
      active: true,
      priority: 5,
    },
  });

  console.log('✅ Instant deal created:', instantDeal.title);

  // Create test user
  const userPassword = await bcrypt.hash('user123!', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: userPassword,
      role: 'USER',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567892',
    },
  });

  console.log('✅ Test user created:', testUser.email);

  console.log('🎉 Demo database seeded successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('Admin: admin@happyhour.com / admin123!');
  console.log('Merchant: merchant@test.com / merchant123!');
  console.log('User: user@test.com / user123!');
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
