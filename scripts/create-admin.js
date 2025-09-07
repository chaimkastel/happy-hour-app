const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123!', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@happyhour.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
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
    console.log('Password: admin123!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
