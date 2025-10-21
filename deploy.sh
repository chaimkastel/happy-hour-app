#!/bin/bash

echo "🚀 Happy Hour App Deployment Script"
echo "==================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the project root directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your environment variables"
    exit 1
fi

# Check DATABASE_URL
if grep -q "username:password" .env.local; then
    echo "❌ Error: DATABASE_URL still has placeholder values"
    echo "Please update .env.local with your actual Neon database URL"
    echo "Run: ./update-database-url.sh for help"
    exit 1
fi

echo "✅ Environment check passed"
echo ""

# Run deployment readiness test
echo "🧪 Running deployment readiness test..."
node test-deployment-readiness.js

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment readiness test failed"
    echo "Please fix the issues above before deploying"
    exit 1
fi

echo ""
echo "🎯 Ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set environment variables in Vercel dashboard"
echo "   - Deploy!"
echo ""
echo "3. Set these environment variables in Vercel:"
echo "   DATABASE_URL=your-neon-url"
echo "   NEXTAUTH_URL=https://your-app.vercel.app"
echo "   NEXTAUTH_SECRET=your-secret"
echo "   RESEND_API_KEY=your-resend-key (optional)"
echo "   GOOGLE_MAPS_API_KEY=your-maps-key (optional)"
echo ""
echo "🎉 Happy deploying!"