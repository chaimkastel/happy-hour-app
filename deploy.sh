#!/bin/bash

# 🚀 Happy Hour App - One-Command Production Deployment
# This script does everything needed to deploy your app to production

set -e  # Exit on any error

echo "🎉 Welcome to Happy Hour Production Deployment!"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found!"
    print_status "Creating .env.production from template..."
    
    if [ -f "env.production.example" ]; then
        cp env.production.example .env.production
        print_success "Created .env.production from template"
        print_warning "Please edit .env.production with your actual values before continuing"
        print_status "Run this script again after updating .env.production"
        exit 1
    else
        print_error "env.production.example not found. Please create .env.production manually"
        exit 1
    fi
fi

# Load environment variables
print_status "Loading production environment variables..."
export $(cat .env.production | grep -v '^#' | xargs)

# Check required environment variables
required_vars=("DATABASE_URL" "REDIS_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [[ "${!var}" == *"your-"* ]] || [[ "${!var}" == *"username:password"* ]]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    print_error "The following environment variables need to be set in .env.production:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    print_status "Please update .env.production with your actual values and run this script again"
    exit 1
fi

print_success "Environment variables loaded successfully"

# Start deployment process
echo ""
print_step "🚀 Starting Production Deployment Process..."
echo ""

# Step 1: Install dependencies
print_step "1. Installing dependencies..."
npm install
print_success "Dependencies installed"

# Step 2: Generate Prisma client
print_step "2. Generating Prisma client for PostgreSQL..."
npm run db:generate
print_success "Prisma client generated"

# Step 3: Test Redis connection
print_step "3. Testing Redis connection..."
if npm run redis:test > /dev/null 2>&1; then
    print_success "Redis connection test passed"
else
    print_warning "Redis connection test failed - continuing anyway"
    print_status "Make sure your Redis instance is running and accessible"
fi

# Step 4: Run database migrations
print_step "4. Running database migrations..."
npm run db:deploy
print_success "Database migrations completed"

# Step 5: Seed production database
print_step "5. Seeding production database with sample data..."
npm run db:seed:prod
print_success "Production database seeded"

# Step 6: Build the application
print_step "6. Building the application..."
npm run build
print_success "Application built successfully"

# Step 7: Check git status
print_step "7. Checking git status..."
if [ -d ".git" ]; then
    git_status=$(git status --porcelain)
    if [ -z "$git_status" ]; then
        print_success "Working directory is clean"
    else
        print_warning "Working directory has uncommitted changes:"
        echo "$git_status"
        print_status "Consider committing your changes before deploying"
    fi
else
    print_warning "No git repository found"
    print_status "Consider initializing git for version control"
fi

# Deployment summary
echo ""
print_success "🎉 Production Deployment Completed Successfully!"
echo ""
print_status "📊 Deployment Summary:"
echo "  ✅ Dependencies installed"
echo "  ✅ Prisma client generated"
echo "  ✅ Database migrations run"
echo "  ✅ Production database seeded"
echo "  ✅ Application built"
echo ""
print_status "🚀 Next Steps:"
echo "  1. Push your code to GitHub:"
echo "     git add . && git commit -m 'Production ready' && git push"
echo ""
echo "  2. Deploy to Vercel:"
echo "     - Go to vercel.com"
echo "     - Import your GitHub repository"
echo "     - Add environment variables from .env.production"
echo "     - Deploy!"
echo ""
print_status "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
print_success "Your Happy Hour app is ready for production! 🎉"
