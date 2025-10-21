#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');

console.log('🧪 Testing Deployment Readiness');
console.log('================================\n');

// Test 1: Database Connection
async function testDatabase() {
  console.log('1️⃣ Testing Database Connection...');
  
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('   ✅ Database connection successful');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Database query successful');
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log(`   ✅ Found ${tables.length} tables in database`);
    
    return true;
  } catch (error) {
    console.log('   ❌ Database connection failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Test 2: Environment Variables
function testEnvironment() {
  console.log('\n2️⃣ Testing Environment Variables...');
  
  const required = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  const optional = ['RESEND_API_KEY', 'GOOGLE_MAPS_API_KEY', 'SENTRY_DSN'];
  
  let allGood = true;
  
  required.forEach(env => {
    if (process.env[env] && !process.env[env].includes('your-') && !process.env[env].includes('xxx')) {
      console.log(`   ✅ ${env}: Set`);
    } else {
      console.log(`   ❌ ${env}: Missing or placeholder`);
      allGood = false;
    }
  });
  
  optional.forEach(env => {
    if (process.env[env] && !process.env[env].includes('your-') && !process.env[env].includes('xxx')) {
      console.log(`   ✅ ${env}: Set`);
    } else {
      console.log(`   ⚠️  ${env}: Not set (optional)`);
    }
  });
  
  return allGood;
}

// Test 3: Build Test
async function testBuild() {
  console.log('\n3️⃣ Testing Build Process...');
  
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.log('   ❌ Build failed:', error.message);
        resolve(false);
      } else {
        console.log('   ✅ Build successful');
        resolve(true);
      }
    });
  });
}

// Test 4: Server Test
async function testServer() {
  console.log('\n4️⃣ Testing Server Startup...');
  
  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      env: { ...process.env, PORT: '3002' }
    });
    
    let output = '';
    let resolved = false;
    
    server.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('Ready in') && !resolved) {
        console.log('   ✅ Server started successfully');
        server.kill();
        resolved = true;
        resolve(true);
      }
    });
    
    server.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('Error') && !resolved) {
        console.log('   ❌ Server startup failed:', error);
        server.kill();
        resolved = true;
        resolve(false);
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!resolved) {
        console.log('   ⚠️  Server test timed out');
        server.kill();
        resolved = true;
        resolve(false);
      }
    }, 30000);
  });
}

// Run all tests
async function runTests() {
  const results = {
    database: await testDatabase(),
    environment: testEnvironment(),
    build: await testBuild(),
    server: await testServer()
  };
  
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`Database: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Environment: ${results.environment ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Build: ${results.build ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Server: ${results.server ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ READY FOR DEPLOYMENT' : '❌ NOT READY'}`);
  
  if (!allPassed) {
    console.log('\n🔧 Next Steps:');
    if (!results.database) {
      console.log('   - Fix DATABASE_URL in .env.local');
    }
    if (!results.environment) {
      console.log('   - Set required environment variables');
    }
    if (!results.build) {
      console.log('   - Fix build errors');
    }
    if (!results.server) {
      console.log('   - Fix server startup issues');
    }
  } else {
    console.log('\n🚀 You can now deploy to Vercel!');
  }
}

runTests().catch(console.error);
