#!/usr/bin/env node

/**
 * Database Setup Helper Script
 * This script helps you set up a production database for your Happy Hour app
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Happy Hour App - Database Setup Helper');
console.log('==========================================\n');

console.log('Your app needs a PostgreSQL database for production deployment.');
console.log('Here are your options:\n');

console.log('1. 🌟 NEON (Recommended - Free)');
console.log('   - Go to: https://neon.tech');
console.log('   - Sign up for free');
console.log('   - Create project: "happy-hour-app"');
console.log('   - Copy the connection string\n');

console.log('2. 🔥 SUPABASE (Alternative)');
console.log('   - Go to: https://supabase.com');
console.log('   - Create new project');
console.log('   - Get connection string from Settings > Database\n');

console.log('3. 🚂 RAILWAY (Alternative)');
console.log('   - Go to: https://railway.app');
console.log('   - Create PostgreSQL database');
console.log('   - Copy connection string\n');

rl.question('Do you have a PostgreSQL connection string? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    rl.question('Paste your PostgreSQL connection string: ', (connectionString) => {
      if (connectionString.startsWith('postgresql://')) {
        console.log('\n✅ Valid PostgreSQL connection string!');
        console.log('\n📋 Next steps:');
        console.log('1. Go to: https://vercel.com/dashboard');
        console.log('2. Select your project: happy-hour-app');
        console.log('3. Go to: Settings > Environment Variables');
        console.log('4. Add this variable:');
        console.log(`   DATABASE_URL = ${connectionString}`);
        console.log('\n5. Then run:');
        console.log('   git add .');
        console.log('   git commit -m "Configure PostgreSQL for production"');
        console.log('   git push origin main');
        console.log('\n🎉 Your app will be deployed with a working database!');
      } else {
        console.log('\n❌ Invalid connection string. It should start with "postgresql://"');
      }
      rl.close();
    });
  } else {
    console.log('\n📖 Please follow the setup guide in setup-production-db.md');
    console.log('   Or visit one of these services:');
    console.log('   - https://neon.tech (Recommended)');
    console.log('   - https://supabase.com');
    console.log('   - https://railway.app');
    rl.close();
  }
});
