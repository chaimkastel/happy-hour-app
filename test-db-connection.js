#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query test successful:', result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('📋 Existing tables:', tables.map(t => t.table_name));
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('Environment variable not found: DATABASE_URL')) {
      console.log('\n💡 Solution:');
      console.log('1. Get your Neon connection string from: https://console.neon.tech/');
      console.log('2. Update .env.local with your actual DATABASE_URL');
      console.log('3. Run this test again');
    } else if (error.message.includes('connection')) {
      console.log('\n💡 Solution:');
      console.log('1. Check your DATABASE_URL format');
      console.log('2. Ensure your Neon database is active');
      console.log('3. Verify your credentials are correct');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
