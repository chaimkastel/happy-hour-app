import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production database seeding...');

  // Create admin user only
  console.log('👑 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
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

  console.log('🎉 Database seeding completed successfully!');
  console.log('📝 Admin credentials:');
  console.log('   Email: admin@happyhour.com');
  console.log('   Password: admin123');
  console.log('');
  console.log('💡 Ready for production use!');
  console.log('   - Merchants can sign up at /merchant/signup');
  console.log('   - Users can register at /signup');
  console.log('   - No test data included');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });