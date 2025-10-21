import { PrismaClient } from '@prisma/client';

// Test database setup
export async function setupTestDatabase() {
  const testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db',
      },
    },
  });

  // Clean up test data
  await testPrisma.auditLog.deleteMany();
  await testPrisma.voucher.deleteMany();
  await testPrisma.favorite.deleteMany();
  await testPrisma.deal.deleteMany();
  await testPrisma.venue.deleteMany();
  await testPrisma.merchant.deleteMany();
  await testPrisma.user.deleteMany();
  await testPrisma.adminNotification.deleteMany();
  await testPrisma.newsletter.deleteMany();

  return testPrisma;
}

// Test data factories
export const testData = {
  user: {
    email: 'test@example.com',
    password: 'hashedpassword123',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER' as const,
  },
  
  merchant: {
    companyName: 'Test Restaurant',
    contactEmail: 'merchant@test.com',
    approved: true,
  },
  
  venue: {
    name: 'Test Venue',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zip: '12345',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
    hours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '21:00' },
    },
    priceTier: 'MID_RANGE' as const,
    isVerified: true,
    rating: 4.5,
    photos: ['photo1.jpg', 'photo2.jpg'],
  },
  
  deal: {
    type: 'HAPPY_HOUR' as const,
    title: 'Test Happy Hour',
    description: 'Test deal description',
    percentOff: 20,
    originalPrice: 1000, // $10.00 in cents
    discountedPrice: 800, // $8.00 in cents
    startsAt: new Date('2024-01-01T17:00:00Z'),
    endsAt: new Date('2024-01-01T19:00:00Z'),
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    timeWindows: [
      { start: '17:00', end: '19:00' }
    ],
    conditions: ['Valid for dine-in only'],
    maxRedemptions: 100,
    perUserLimit: 1,
    active: true,
    priority: 1,
  },
  
  voucher: {
    code: 'TEST123',
    qrData: 'qr_test_data_123',
    status: 'ISSUED' as const,
    expiresAt: new Date('2024-12-31T23:59:59Z'),
  },
};

// Utility functions for testing
export const testUtils = {
  generateTestEmail: () => `test-${Date.now()}@example.com`,
  generateTestCode: () => `TEST-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
};

// Mock functions for external services
export const mocks = {
  stripe: {
    createCheckoutSession: () => Promise.resolve({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/test',
    }),
    createCustomer: () => Promise.resolve({
      id: 'cus_test_123',
      email: 'test@example.com',
    }),
    constructWebhookEvent: () => Promise.resolve({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          customer: 'cus_test_123',
          subscription: 'sub_test_123',
        },
      },
    }),
  },
  
  email: {
    send: () => Promise.resolve({ success: true }),
  },
  
  sms: {
    send: () => Promise.resolve({ success: true }),
  },
  
  redis: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve('OK'),
    del: () => Promise.resolve(1),
    exists: () => Promise.resolve(0),
    incr: () => Promise.resolve(1),
    expire: () => Promise.resolve(1),
  },
  
  maps: {
    geocode: () => Promise.resolve({
      results: [{
        geometry: {
          location: {
            lat: 40.7128,
            lng: -74.0060,
          },
        },
        formatted_address: '123 Test St, Test City, TS 12345, USA',
      }],
    }),
    placesNearby: () => Promise.resolve({
      results: [],
    }),
  },
};

// Test environment setup
export function setupTestEnvironment() {
  // Set test environment variables
  // Note: NODE_ENV is read-only in some environments, so we'll skip it
  // process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';
  process.env.NEXTAUTH_SECRET = 'test-secret-key';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

// Cleanup function
export async function cleanupTestDatabase(prisma: PrismaClient) {
  await prisma.auditLog.deleteMany();
  await prisma.redemption.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adminNotification.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.$disconnect();
}