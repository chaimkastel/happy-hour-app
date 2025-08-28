#!/bin/bash

# Happy Hour App - Production Deployment Script
# This script sets up the production database and runs migrations

set -e  # Exit on any error

echo "🚀 Starting Happy Hour production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found. Please create it with your production environment variables."
    print_status "You can copy from env.production.example and fill in your values."
    exit 1
fi

# Load environment variables
print_status "Loading production environment variables..."
export $(cat .env.production | grep -v '^#' | xargs)

# Check required environment variables
required_vars=("DATABASE_URL" "REDIS_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set"
        exit 1
    fi
done

print_success "Environment variables loaded successfully"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Generate Prisma client
print_status "Generating Prisma client..."
npm run db:generate

# Run database migrations
print_status "Running database migrations..."
npm run db:deploy

# Seed the database
print_status "Seeding production database..."
npm run db:seed:prod

# Build the application
print_status "Building the application..."
npm run build

print_success "🎉 Production deployment completed successfully!"
print_status ""
print_status "Next steps:"
print_status "1. Push your code to GitHub"
print_status "2. Import your repository to Vercel"
print_status "3. Add environment variables in Vercel dashboard"
print_status "4. Deploy!"
print_status ""
print_status "Your app is now ready for production! 🚀"
