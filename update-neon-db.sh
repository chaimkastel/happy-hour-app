#!/bin/bash

echo "🔧 Neon Database Setup Script"
echo "=============================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    exit 1
fi

echo "📋 Current DATABASE_URL in .env.local:"
grep "DATABASE_URL" .env.local
echo ""

echo "🔗 Please provide your Neon database connection string:"
echo "   Format: postgresql://username:password@ep-xxxxx.region.aws.neon.tech/database?sslmode=require"
echo ""

read -p "Enter your Neon DATABASE_URL: " neon_url

if [ -z "$neon_url" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

# Backup current .env.local
cp .env.local .env.local.backup
echo "✅ Backed up current .env.local to .env.local.backup"

# Update the DATABASE_URL
sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$neon_url\"|" .env.local

echo "✅ Updated DATABASE_URL in .env.local"
echo ""

echo "📋 New DATABASE_URL:"
grep "DATABASE_URL" .env.local
echo ""

echo "🚀 Next steps:"
echo "1. Run: npx prisma migrate deploy"
echo "2. Run: npx prisma generate"
echo "3. Run: npm run dev"
echo ""

echo "✅ Neon database setup complete!"
