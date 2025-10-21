#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testSignup() {
  console.log('🧪 Testing user signup directly...');
  
  const prisma = new PrismaClient();

  try {
    // Test user data
    const testUser = {
      email: 'test@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      newsletterOptIn: true,
      acceptTerms: true
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email.toLowerCase() }
    });

    if (existingUser) {
      console.log('✅ User already exists:', existingUser.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: testUser.email.toLowerCase(),
        password: hashedPassword,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        phone: testUser.phone,
        newsletterOptIn: testUser.newsletterOptIn,
        termsAcceptedAt: new Date(),
        emailVerified: false,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        newsletterOptIn: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    });

    console.log('✅ User created successfully:', user);

    // Test login
    const loginUser = await prisma.user.findUnique({
      where: { email: testUser.email.toLowerCase() }
    });

    if (loginUser && loginUser.password) {
      const passwordMatch = await bcrypt.compare(testUser.password, loginUser.password);
      console.log('✅ Password verification:', passwordMatch ? 'PASS' : 'FAIL');
    }

  } catch (error) {
    console.error('❌ Signup test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSignup();
