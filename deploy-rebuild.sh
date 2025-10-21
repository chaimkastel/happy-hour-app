#!/bin/bash

echo "🚀 Deploying Rebuilt Happy Hour App"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Run type checking
echo "🔍 Running type check..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix the TypeScript errors and try again."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🎉 Your rebuilt Happy Hour app is now live!"
    echo ""
    echo "📱 Features included:"
    echo "  • Apple/Uber Eats-level design"
    echo "  • Mobile-first responsive layout"
    echo "  • Beautiful user onboarding"
    echo "  • Merchant dashboard"
    echo "  • Admin panel"
    echo "  • Wallet system"
    echo "  • Mobile app APIs"
    echo ""
    echo "🔗 Check your Vercel dashboard for the live URL"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
