# Happy Hour App Deployment Guide

## Overview

This guide covers deploying the Happy Hour application to various platforms including Vercel, AWS, Google Cloud, and DigitalOcean.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository access
- Platform-specific CLI tools (Vercel CLI, AWS CLI, etc.)

## Environment Setup

### 1. Environment Variables

Create environment files for different environments:

#### Development (.env.local)
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-development-secret-key-12345"

# Stripe (Test Keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Error Tracking (Sentry)
SENTRY_DSN="https://..."

# Optional: Redis
REDIS_URL="redis://localhost:6379"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# App Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Production (.env.production)
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Stripe (Live Keys)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Error Tracking (Sentry)
SENTRY_DSN="https://..."

# Redis (Upstash)
REDIS_URL="redis://username:password@host:port"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 2. Database Setup

#### SQLite (Development)
```bash
# No additional setup needed for SQLite
npm run dev
```

#### PostgreSQL (Production)
```bash
# Install PostgreSQL client
npm install -g pg

# Create database
createdb happy_hour_production

# Run migrations
npx prisma db push
npx prisma generate
```

#### Neon (Cloud PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in your environment variables

### 3. Redis Setup

#### Local Redis
```bash
# Install Redis
brew install redis  # macOS
sudo apt-get install redis-server  # Ubuntu

# Start Redis
redis-server
```

#### Upstash (Cloud Redis)
1. Sign up at [upstash.com](https://upstash.com)
2. Create a new database
3. Copy the connection string
4. Update `REDIS_URL` in your environment variables

## Deployment Options

### 1. Vercel (Recommended)

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Environment Variables
Add these in your Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `SENTRY_DSN`
- `REDIS_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_APP_URL`

#### Custom Domain
1. Go to your Vercel project settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`

### 2. AWS (EC2 + RDS)

#### Setup EC2 Instance
```bash
# Launch EC2 instance (Ubuntu 20.04)
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-username/happy-hour-app.git
cd happy-hour-app

# Install dependencies
npm install

# Build application
npm run build
```

#### Setup RDS Database
1. Create RDS PostgreSQL instance
2. Configure security groups
3. Update `DATABASE_URL`

#### Setup ElastiCache Redis
1. Create ElastiCache Redis cluster
2. Configure security groups
3. Update `REDIS_URL`

#### Deploy with PM2
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'happy-hour-app',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/your/app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Google Cloud Platform

#### Setup Cloud Run
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Login
gcloud auth login

# Create project
gcloud projects create your-project-id

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com

# Deploy to Cloud Run
gcloud run deploy happy-hour-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Setup Cloud SQL
```bash
# Create Cloud SQL instance
gcloud sql instances create happy-hour-db \
  --database-version=POSTGRES_13 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create happy_hour --instance=happy-hour-db

# Create user
gcloud sql users create app-user \
  --instance=happy-hour-db \
  --password=your-password
```

### 4. DigitalOcean

#### Setup App Platform
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Configure build settings:
   - Build command: `npm run build`
   - Run command: `npm start`
   - Environment: Node.js

#### Setup Managed Database
1. Create PostgreSQL database
2. Configure connection
3. Update `DATABASE_URL`

#### Setup Managed Redis
1. Create Redis database
2. Configure connection
3. Update `REDIS_URL`

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
  only:
    - main
    - develop

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour
  only:
    - main

deploy:
  stage: deploy
  image: node:18
  script:
    - npm install -g vercel
    - vercel --token $VERCEL_TOKEN --prod
  only:
    - main
```

## Monitoring and Logging

### 1. Sentry Setup
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
npx @sentry/wizard -i nextjs
```

### 2. Logging
```typescript
// Use the built-in monitoring system
import { errorTracker, performanceMonitor } from '@/lib/monitoring';

// Track errors
try {
  // Your code
} catch (error) {
  errorTracker.trackError(error, { context: 'user_action' });
}

// Track performance
const endTimer = performanceMonitor.startTimer('database_query');
// Your database operation
endTimer();
```

### 3. Health Checks
```bash
# Use the built-in health check endpoint
curl https://your-domain.com/api/health
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate secrets regularly

### 2. Database Security
- Use connection pooling
- Enable SSL/TLS
- Restrict access by IP
- Regular backups

### 3. API Security
- Rate limiting enabled
- Input validation
- CORS configuration
- Security headers

### 4. Monitoring
- Set up alerts for errors
- Monitor performance metrics
- Track security events
- Regular security audits

## Backup and Recovery

### 1. Database Backups
```bash
# Use the built-in backup script
./scripts/backup.sh backup

# Restore from backup
./scripts/backup.sh restore backup_file.tar.gz
```

### 2. File Backups
- Use version control for code
- Backup uploaded files to cloud storage
- Regular backup verification

### 3. Disaster Recovery
- Document recovery procedures
- Test backup restoration
- Maintain multiple backup copies
- Regular disaster recovery drills

## Performance Optimization

### 1. Database Optimization
- Use indexes appropriately
- Optimize queries
- Connection pooling
- Read replicas for scaling

### 2. Application Optimization
- Enable Next.js optimizations
- Use CDN for static assets
- Implement caching strategies
- Monitor performance metrics

### 3. Infrastructure Optimization
- Use appropriate instance sizes
- Enable auto-scaling
- Load balancing
- Geographic distribution

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check database connectivity
npx prisma db push

# Verify connection string
echo $DATABASE_URL
```

#### 2. Build Failures
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

#### 3. Environment Variable Issues
```bash
# Verify environment variables
node -e "console.log(process.env.NEXTAUTH_SECRET)"
```

#### 4. Performance Issues
```bash
# Check system resources
top
df -h
free -h

# Monitor application logs
pm2 logs
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check specific modules
DEBUG=prisma:* npm run dev
```

## Support

For deployment support:
- Check the [troubleshooting guide](TROUBLESHOOTING.md)
- Review [API documentation](API.md)
- Contact support: support@happyhour.com
- Status page: https://status.happyhour.com
