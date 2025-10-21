# Happy Hour - Deployment Guide

This guide will help you deploy the Happy Hour application to Vercel.

## Prerequisites

- Node.js 18+ installed
- A Vercel account
- A PostgreSQL database (Supabase, PlanetScale, or Railway recommended)
- Required API keys and secrets

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Rate Limiting (optional)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza..."

# Cron Jobs (optional)
CRON_SECRET_TOKEN="your-cron-secret"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
```

## Database Setup

### Option 1: Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string
4. Update `DATABASE_URL` in your environment variables

### Option 2: PlanetScale

1. Create a new database at [planetscale.com](https://planetscale.com)
2. Create a new branch
3. Copy the connection string
4. Update `DATABASE_URL` in your environment variables

### Option 3: Railway

1. Create a new PostgreSQL service at [railway.app](https://railway.app)
2. Copy the connection string
3. Update `DATABASE_URL` in your environment variables

## Deployment Steps

### 1. Prepare the Application

```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Run the deployment script
npm run deploy
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
# ... add other environment variables
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set the following build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run vercel-build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

5. Add environment variables in the Vercel dashboard:
   - Go to Settings > Environment Variables
   - Add all variables from the `.env.local` file

### 3. Database Migration

After deployment, run the database migration:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Or using the Vercel dashboard
# Go to your project > Functions > Create a new function
# Name it: migrate
# Code:
# import { PrismaClient } from '@prisma/client'
# const prisma = new PrismaClient()
# export default async function handler(req, res) {
#   await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
#   res.status(200).json({ message: 'Migration completed' })
# }
```

### 4. Seed Demo Data (Optional)

To populate the database with demo data:

```bash
# Using Vercel CLI
vercel env pull .env.local
npm run db:seed:comprehensive
```

### 5. Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` environment variables

## Post-Deployment Checklist

- [ ] Database connection is working
- [ ] Authentication is working
- [ ] API endpoints are responding
- [ ] Static files are loading
- [ ] Environment variables are set
- [ ] SSL certificate is active
- [ ] Custom domain is configured (if applicable)

## Monitoring and Maintenance

### Health Checks

The application includes health check endpoints:

- `/api/health` - Basic health check
- `/api/admin/health` - Detailed health check (admin only)

### Logs

Monitor your application logs in the Vercel dashboard:

1. Go to your project dashboard
2. Navigate to Functions tab
3. Click on any function to view logs

### Performance

Monitor performance using:

- Vercel Analytics (built-in)
- Google PageSpeed Insights
- Lighthouse audits

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all environment variables are set
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check database server is accessible
   - Ensure database exists and is running

3. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Ensure callback URLs are configured

4. **API Errors**
   - Check function logs in Vercel dashboard
   - Verify environment variables are set
   - Check for rate limiting issues

### Getting Help

If you encounter issues:

1. Check the logs in Vercel dashboard
2. Review the troubleshooting section above
3. Check the GitHub issues page
4. Contact support if needed

## Security Considerations

- Keep environment variables secure
- Use strong passwords for database
- Enable 2FA on all accounts
- Regularly update dependencies
- Monitor for security vulnerabilities

## Backup Strategy

- Database backups (automated by your provider)
- Code backups (Git repository)
- Environment variable backups (Vercel dashboard export)

## Scaling Considerations

- Monitor database performance
- Consider connection pooling
- Implement caching strategies
- Monitor API rate limits
- Plan for increased traffic

---

For more information, visit the [Happy Hour documentation](./README.md).