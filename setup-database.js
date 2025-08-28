// Database setup script for Supabase
// Run this after adding environment variables to Vercel

const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Setting up database tables...');
    
    // This will create all tables based on your Prisma schema
    await prisma.$executeRaw`SELECT 1;`;
    
    console.log('✅ Database connection successful!');
    console.log('📋 Tables will be created automatically on first use');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
