#!/bin/bash

# Happy Hour - Deployment Script
# This script prepares the application for deployment to Vercel

set -e

echo "🚀 Starting Happy Hour deployment preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run type checking
print_status "Running type checking..."
npm run type-check

# Run linting
print_status "Running linting..."
npm run lint

# Run tests (if available)
if [ -f "jest.config.js" ] || [ -f "jest.config.ts" ]; then
    print_status "Running tests..."
    npm test
else
    print_warning "No test configuration found. Skipping tests."
fi

# Build the application
print_status "Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    print_status "Build completed successfully!"
    print_status "Application is ready for deployment to Vercel."
    echo ""
    echo "Next steps:"
    echo "1. Push your changes to GitHub"
    echo "2. Connect your repository to Vercel"
    echo "3. Set up environment variables in Vercel dashboard"
    echo "4. Deploy!"
    echo ""
    echo "Environment variables needed:"
    echo "- DATABASE_URL"
    echo "- NEXTAUTH_SECRET"
    echo "- NEXTAUTH_URL"
    echo "- STRIPE_SECRET_KEY (if using Stripe)"
    echo "- STRIPE_WEBHOOK_SECRET (if using Stripe)"
    echo "- UPSTASH_REDIS_REST_URL (if using rate limiting)"
    echo "- UPSTASH_REDIS_REST_TOKEN (if using rate limiting)"
    echo "- GOOGLE_MAPS_API_KEY (if using maps)"
else
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi