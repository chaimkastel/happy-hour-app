#!/bin/bash

echo "🚀 Neon Database Setup for Happy Hour App"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found!"
    exit 1
fi

print_info "Current DATABASE_URL in .env.local:"
grep "DATABASE_URL" .env.local
echo ""

print_warning "Please provide your Neon database connection string."
echo "Format: postgresql://username:password@ep-xxxxx.region.aws.neon.tech/database?sslmode=require"
echo ""

read -p "Enter your Neon DATABASE_URL: " neon_url

if [ -z "$neon_url" ]; then
    print_error "No URL provided. Exiting."
    exit 1
fi

# Validate the URL format
if [[ ! $neon_url =~ ^postgresql:// ]]; then
    print_error "Invalid URL format. Must start with 'postgresql://'"
    exit 1
fi

# Backup current .env.local
cp .env.local .env.local.backup
print_status "Backed up current .env.local to .env.local.backup"

# Update the DATABASE_URL
sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$neon_url\"|" .env.local

print_status "Updated DATABASE_URL in .env.local"
echo ""

print_info "New DATABASE_URL:"
grep "DATABASE_URL" .env.local
echo ""

# Test database connection
print_info "Testing database connection..."
if npx prisma db pull --print 2>/dev/null; then
    print_status "Database connection successful!"
else
    print_warning "Database connection test failed, but continuing with setup..."
fi

# Run migrations
print_info "Running database migrations..."
if npx prisma migrate deploy; then
    print_status "Migrations completed successfully!"
else
    print_error "Migration failed. Please check your database connection."
    exit 1
fi

# Generate Prisma client
print_info "Generating Prisma client..."
if npx prisma generate; then
    print_status "Prisma client generated successfully!"
else
    print_error "Prisma client generation failed."
    exit 1
fi

# Test the application
print_info "Testing application build..."
if npm run build > /dev/null 2>&1; then
    print_status "Application builds successfully!"
else
    print_warning "Build test failed, but database is set up."
fi

echo ""
print_status "Neon database setup complete!"
echo ""
print_info "Next steps:"
echo "1. Update other environment variables in .env.local as needed"
echo "2. Run: npm run dev"
echo "3. Test the application at http://localhost:3000"
echo ""
print_info "Your Neon database is now connected and ready to use! 🎉"
