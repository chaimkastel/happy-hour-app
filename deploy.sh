#!/bin/bash

# Happy Hour App Deployment Script
# This script handles the complete deployment workflow

set -e  # Exit on any error

echo "🚀 Happy Hour App Deployment Script"
echo "=================================="

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

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Not in the project root directory. Please run this script from the project root."
    exit 1
fi

# Step 2: Check git status
print_status "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit them first:"
    git status --short
    echo ""
    read -p "Do you want to commit all changes now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_message
        git commit -m "$commit_message"
        print_success "Changes committed"
    else
        print_error "Please commit your changes before deploying"
        exit 1
    fi
fi

# Step 3: Run tests and build
print_status "Running build test..."
if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed. Please fix errors before deploying"
    exit 1
fi

# Step 4: Push to GitHub
print_status "Pushing to GitHub..."
if git push origin main; then
    print_success "Code pushed to GitHub"
else
    print_error "Failed to push to GitHub"
    exit 1
fi

# Step 5: Deploy to Vercel
print_status "Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    if vercel --prod; then
        print_success "Deployed to Vercel successfully!"
    else
        print_error "Vercel deployment failed"
        exit 1
    fi
else
    print_warning "Vercel CLI not found. Deployment will happen automatically via GitHub integration."
    print_success "Code pushed to GitHub - Vercel will auto-deploy"
fi

echo ""
print_success "🎉 Deployment Complete!"
echo ""
echo "Your app should be available at: https://www.orderhappyhour.com"
echo ""
echo "To check deployment status:"
echo "  - Visit: https://vercel.com/dashboard"
echo "  - Or run: vercel ls"