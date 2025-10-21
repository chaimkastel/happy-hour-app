const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Delete any existing user with the target email
    console.log('Deleting existing user with email chaimkastel@hotmail.com...');
    await prisma.user.deleteMany({
      where: { email: 'chaimkastel@hotmail.com' }
    });

    // Delete existing admin users
    console.log('Deleting existing admin users...');
    await prisma.user.deleteMany({
      where: { role: 'ADMIN' }
    });

    // Create new admin user
    const hashedPassword = await bcrypt.hash('CHAIMrox11!', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'chaimkastel@hotmail.com',
        password: hashedPassword,
        firstName: 'Chaim',
        lastName: 'Kastel',
        phone: '+1234567890',
        role: 'ADMIN',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        termsAcceptedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('Admin user created successfully:', admin.email);
    console.log('Password: CHAIMrox11!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
