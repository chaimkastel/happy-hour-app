# Happy Hour - Deployment Guide

This guide covers the complete deployment process for the Happy Hour application.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Stripe Configuration](#stripe-configuration)
- [Google Maps Setup](#google-maps-setup)
- [Redis/Upstash Setup](#redisupstash-setup)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Environment Variables

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Redis/Upstash
UPSTASH_REDIS_REST_URL="https://your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://your-domain.com"

# Cron Jobs
CRON_SECRET="your-cron-secret"

# Sentry (optional)
SENTRY_DSN="your-sentry-dsn"
```

### Environment Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your production domain | Yes |
| `NEXTAUTH_SECRET` | Random string for NextAuth encryption | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key (live mode) | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (live mode) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your production domain | Yes |
| `CRON_SECRET` | Secret for cron job authentication | Yes |
| `SENTRY_DSN` | Sentry error tracking DSN | No |

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Using psql
createdb happy_hour_production

# Or using SQL
CREATE DATABASE happy_hour_production;
```

### 2. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npm run db:seed
```

### 3. Verify Database Connection

```bash
# Test connection
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('Database connected successfully');
  process.exit(0);
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});
"
```

## Stripe Configuration

### 1. Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Complete account verification
3. Get your live API keys from the dashboard

### 2. Configure Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the webhook secret

### 3. Create Products and Prices

```bash
# Using Stripe CLI
stripe products create --name "Happy Hour Pro" --description "Pro plan for restaurants"

stripe prices create \
  --product prod_xxx \
  --unit-amount 2900 \
  --currency usd \
  --recurring interval=month
```

### 4. Test Stripe Integration

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Test checkout flow
stripe trigger checkout.session.completed
```

## Google Maps Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Maps JavaScript API
4. Enable Places API
5. Enable Geocoding API

### 2. Create API Key

1. Go to APIs & Services → Credentials
2. Create API key
3. Restrict the key to your domain
4. Add API restrictions (Maps JavaScript API, Places API, Geocoding API)

### 3. Configure API Key Restrictions

```javascript
// In Google Cloud Console
Application restrictions: HTTP referrers
Referrers: https://your-domain.com/*

API restrictions: Restrict key
APIs: Maps JavaScript API, Places API, Geocoding API
```

## Redis/Upstash Setup

### 1. Create Upstash Account

1. Sign up at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Choose a region close to your users
4. Copy the REST URL and token

### 2. Test Redis Connection

```bash
# Test connection
curl -X GET "https://your-redis-url" \
  -H "Authorization: Bearer your-redis-token"
```

## Deployment Steps

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... add all other variables
```

### 2. Database Migration

```bash
# Run migrations on production
vercel env pull .env.production
npx prisma migrate deploy
```

### 3. Configure Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 4. Set Up Cron Jobs

```bash
# Add cron job for reconciliation
vercel env add CRON_SECRET

# Schedule cron job (every hour)
# In Vercel Dashboard → Functions → Cron Jobs
# URL: https://your-domain.com/api/cron/reconcile
# Schedule: 0 * * * *
```

## Post-Deployment Checklist

### 1. Verify Core Functionality

- [ ] Home page loads
- [ ] Explore page shows deals
- [ ] User registration works
- [ ] Merchant signup works
- [ ] Deal creation works
- [ ] Voucher redemption works
- [ ] Stripe payments work

### 2. Test API Endpoints

```bash
# Health check
curl https://your-domain.com/api/health

# Time endpoint
curl https://your-domain.com/api/time

# Deals endpoint
curl https://your-domain.com/api/deals
```

### 3. Verify Stripe Integration

- [ ] Webhook endpoint responds
- [ ] Checkout sessions work
- [ ] Subscription creation works
- [ ] Customer portal works

### 4. Test Rate Limiting

```bash
# Test rate limiting
for i in {1..10}; do
  curl https://your-domain.com/api/deals
done
```

### 5. Verify PWA Features

- [ ] Manifest loads
- [ ] Service worker registers
- [ ] Offline page works
- [ ] Install prompt appears

## Monitoring & Maintenance

### 1. Set Up Monitoring

```bash
# Add Sentry for error tracking
vercel env add SENTRY_DSN

# Set up uptime monitoring
# Use services like UptimeRobot or Pingdom
```

### 2. Database Maintenance

```bash
# Regular database backups
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Monitor database performance
# Use tools like pg_stat_statements
```

### 3. Log Monitoring

```bash
# View Vercel logs
vercel logs

# Monitor specific functions
vercel logs --follow
```

### 4. Performance Monitoring

- Set up Lighthouse CI
- Monitor Core Web Vitals
- Track API response times
- Monitor error rates

### 5. Security Monitoring

- Regular security audits
- Monitor for suspicious activity
- Keep dependencies updated
- Monitor for data breaches

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall rules

2. **Stripe Webhook Failures**
   - Verify webhook secret
   - Check webhook endpoint URL
   - Monitor webhook logs

3. **Google Maps Not Loading**
   - Verify API key
   - Check domain restrictions
   - Monitor API quotas

4. **Rate Limiting Issues**
   - Check Redis connection
   - Verify rate limit configuration
   - Monitor rate limit logs

### Support

For deployment issues:
1. Check Vercel logs
2. Review error messages
3. Test locally with production environment
4. Contact support if needed

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use different secrets for different environments
   - Rotate secrets regularly

2. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Regular security updates

3. **API Security**
   - Rate limiting enabled
   - Input validation
   - CORS configuration

4. **Stripe Security**
   - Use webhook signatures
   - Validate webhook events
   - Monitor for suspicious activity

## Backup and Recovery

### Database Backups

```bash
# Automated daily backups
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip -c backup.sql.gz | psql $DATABASE_URL
```

### Application Backups

- Code is backed up in Git
- Environment variables backed up in Vercel
- Static assets backed up in Vercel

### Disaster Recovery Plan

1. **Database Recovery**
   - Restore from latest backup
   - Run migrations if needed
   - Verify data integrity

2. **Application Recovery**
   - Redeploy from Git
   - Restore environment variables
   - Verify functionality

3. **Communication Plan**
   - Notify users of downtime
   - Provide status updates
   - Post-incident review

