# 🚀 Happy Hour App - Production Deployment Guide

This guide will walk you through deploying your Happy Hour app to production using Vercel, Neon PostgreSQL, and Redis.

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier available)
- [ ] Neon account (free tier available)
- [ ] Google Maps API key
- [ ] Terminal/Command Line access

## 🗄️ Step 1: Set Up Neon PostgreSQL Database

### 1.1 Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create a new project called "happy-hour-prod"

### 1.2 Get Database Connection String
1. In your Neon dashboard, click on your project
2. Go to "Connection Details"
3. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require
   ```

### 1.3 Test Database Connection
```bash
# Install PostgreSQL client (if you don't have it)
brew install postgresql

# Test connection (replace with your actual connection string)
psql "postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require"
```

## 🔴 Step 2: Set Up Redis (Upstash)

### 2.1 Create Upstash Account
1. Go to [upstash.com](https://upstash.com)
2. Sign up with GitHub
3. Create a new Redis database

### 2.2 Get Redis Connection String
1. In your Upstash dashboard, click on your database
2. Go to "REST API" tab
3. Copy the connection string that looks like:
   ```
   redis://username:password@host:port
   ```

## 🌐 Step 3: Set Up Google Maps API

### 3.1 Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Maps JavaScript API
4. Create credentials (API key)

### 3.2 Configure API Restrictions
1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your production domain: `https://your-app-name.vercel.app/*`

## 🔐 Step 4: Generate Secrets

### 4.1 Generate NextAuth Secret
```bash
# Generate a random secret
openssl rand -base64 32
```

### 4.2 Create Production Environment File
```bash
# Copy the example file
cp env.production.example .env.production

# Edit with your actual values
nano .env.production
```

Fill in your `.env.production` file:
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require"

# Redis (Upstash Redis)
REDIS_URL="redis://username:password@host:port"

# NextAuth Configuration
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="https://your-app-name.vercel.app"

# Google Maps API
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# QR Code API (if using external service)
QR_API_KEY="your-qr-api-key"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-app-name.vercel.app"
```

## 🗄️ Step 5: Set Up Production Database

### 5.1 Run Database Setup
```bash
# Make sure you're in the project directory
cd /Users/chaimkastel/Downloads/happy-hour-ultra-fixed

# Run the production database setup
npm run db:setup:prod
```

This will:
- Generate Prisma client for PostgreSQL
- Run database migrations
- Seed the database with sample data

### 5.2 Verify Database Setup
```bash
# Check if data was created
npm run db:studio
```

## 🚀 Step 6: Deploy to Vercel

### 6.1 Push Code to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Production ready with Redis and PostgreSQL"

# Add your GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/yourusername/happy-hour.git

# Push to GitHub
git push -u origin main
```

### 6.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`

### 6.3 Add Environment Variables in Vercel
1. In your Vercel project dashboard, go to "Settings" > "Environment Variables"
2. Add each variable from your `.env.production` file:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `GOOGLE_MAPS_API_KEY`
   - `QR_API_KEY`

### 6.4 Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## 🧪 Step 7: Test Production Deployment

### 7.1 Test Basic Functionality
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Google Maps renders
- [ ] No console errors

### 7.2 Test Redis Health
Visit: `https://your-app-name.vercel.app/api/health/redis`

Expected response:
```json
{
  "status": "success",
  "redis": {
    "connection": { "status": "healthy" },
    "cache": { "status": "working" },
    "rateLimit": { "status": "working" },
    "session": { "status": "working" }
  }
}
```

### 7.3 Test Database Connection
- [ ] Venues load on `/deals` page
- [ ] Sample data displays correctly
- [ ] No database connection errors

### 7.4 Test Authentication
- [ ] Sign up works
- [ ] Sign in works
- [ ] Sessions persist

## 🔧 Step 8: Performance Optimization

### 8.1 Enable Vercel Analytics
1. In Vercel dashboard, go to "Analytics"
2. Enable analytics for your project

### 8.2 Monitor Redis Performance
- Check Redis dashboard in Upstash
- Monitor cache hit rates
- Watch for connection issues

### 8.3 Database Performance
- Monitor Neon dashboard for query performance
- Check connection pool usage
- Watch for slow queries

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if DATABASE_URL is correct
echo $DATABASE_URL

# Test connection manually
psql "$DATABASE_URL"
```

#### Redis Connection Failed
```bash
# Check if REDIS_URL is correct
echo $REDIS_URL

# Test Redis health endpoint
curl https://your-app-name.vercel.app/api/health/redis
```

#### Build Failed
```bash
# Check build logs in Vercel
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

#### Google Maps Not Loading
1. Check API key restrictions
2. Verify domain is allowed
3. Check browser console for errors

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Vercel deployment status
- [ ] Redis health endpoint
- [ ] Database connection
- [ ] Error logs

### Weekly Tasks
- [ ] Review Vercel analytics
- [ ] Check Redis performance metrics
- [ ] Monitor database usage
- [ ] Update dependencies if needed

### Monthly Tasks
- [ ] Review and optimize queries
- [ ] Check Redis memory usage
- [ ] Review error patterns
- [ ] Performance audit

## 🎯 Investor Demo Checklist

### Pre-Demo
- [ ] All features working
- [ ] Sample data looks professional
- [ ] Performance is smooth
- [ ] No error messages
- [ ] Mobile responsive

### Demo Features to Show
- [ ] Homepage with deals
- [ ] Map view with venues
- [ ] Deal filtering and search
- [ ] User authentication
- [ ] Redis performance dashboard
- [ ] Mobile experience

### Backup Plans
- [ ] Screenshots of working features
- [ ] Video demo recorded
- [ ] Local development version ready
- [ ] Alternative demo scenarios

## 🆘 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Neon Support
- [Neon Documentation](https://neon.tech/docs)
- [Neon Discord](https://discord.gg/neondatabase)

### Redis Support
- [Upstash Documentation](https://docs.upstash.com)
- [Redis Documentation](https://redis.io/documentation)

## 🎉 Success!

Once you've completed all steps, your Happy Hour app will be:
- ✅ Live on Vercel
- ✅ Connected to Neon PostgreSQL
- ✅ Using Redis for caching and sessions
- ✅ Ready for investor demos
- ✅ Production-ready and scalable

**Good luck with your investor demo! 🚀**
