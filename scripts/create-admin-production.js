const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user for production...');
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@happyhour.com' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      console.log('🔑 Updating admin password...');
      
      const hashedPassword = await bcrypt.hash('CHAIMrox11!', 12);
      
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          emailVerified: true,
          emailVerifiedAt: new Date(),
        }
      });
      
      console.log('✅ Admin password updated successfully');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔑 Password: CHAIMrox11!');
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('CHAIMrox11!', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@happyhour.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        phone: '+1234567890',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@happyhour.com');
    console.log('🔑 Password: CHAIMrox11!');
    console.log('🆔 User ID:', admin.id);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

