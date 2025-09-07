# Deployment Guide - Happy Hour App

This guide covers deploying the Happy Hour App to production environments.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository
- Database (Neon, PlanetScale, or Supabase)

### Step 1: Database Setup

1. **Choose a Database Provider:**
   - **Neon** (Recommended for PostgreSQL)
   - **PlanetScale** (MySQL)
   - **Supabase** (PostgreSQL)

2. **Create Database:**
   ```sql
   -- For PostgreSQL (Neon/Supabase)
   CREATE DATABASE happy_hour_prod;
   ```

3. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

### Step 2: Vercel Setup

1. **Connect Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables:**
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-super-secret-key-here"
   EXTERNAL_LOGGING_ENABLED="true"
   ```

### Step 3: Deploy

1. **Deploy:**
   - Click "Deploy" in Vercel dashboard
   - Wait for build to complete

2. **Verify Deployment:**
   - Visit your Vercel URL
   - Test key functionality
   - Check admin access

### Step 4: Post-Deployment

1. **Create Admin User:**
   ```bash
   # Connect to your production database
   npx prisma studio
   # Or run the admin creation script with production DB
   ```

2. **Set Up Domain (Optional):**
   - Add custom domain in Vercel dashboard
   - Update NEXTAUTH_URL to match custom domain

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/happy_hour
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=happy_hour
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Create admin user
docker-compose exec app node scripts/create-admin.js
```

## ☁️ AWS Deployment

### Using AWS Amplify

1. **Connect Repository:**
   - Go to AWS Amplify Console
   - Connect your GitHub repository

2. **Configure Build:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
           - npx prisma generate
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

3. **Set Environment Variables:**
   - DATABASE_URL
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET

### Using AWS ECS

1. **Create ECS Cluster**
2. **Create Task Definition**
3. **Deploy with Application Load Balancer**

## 🔧 Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# Optional
EXTERNAL_LOGGING_ENABLED="true"
```

### Production Secrets

Generate secure secrets:

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate database password
openssl rand -base64 16
```

## 📊 Monitoring & Logging

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance and errors

### External Logging
- Set `EXTERNAL_LOGGING_ENABLED=true`
- Configure external logging service
- Monitor application logs

### Health Checks
- `/api/health/redis` - Redis health check
- `/api/admin/health` - System health check

## 🔒 Security Considerations

### Environment Variables
- Never commit secrets to version control
- Use environment-specific configurations
- Rotate secrets regularly

### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups

### Authentication
- Use strong NEXTAUTH_SECRET
- Enable HTTPS in production
- Implement rate limiting

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check TypeScript errors
   npm run type-check
   
   # Check Prisma generation
   npx prisma generate
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   npx prisma db pull
   
   # Check environment variables
   echo $DATABASE_URL
   ```

3. **Authentication Issues**
   - Verify NEXTAUTH_URL matches domain
   - Check NEXTAUTH_SECRET is set
   - Ensure HTTPS in production

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check specific modules
DEBUG=next-auth npm run dev
```

## 📈 Performance Optimization

### Database
- Use connection pooling
- Optimize queries
- Add database indexes

### Next.js
- Enable static generation where possible
- Use dynamic imports for large components
- Optimize images

### CDN
- Use Vercel's CDN
- Configure caching headers
- Optimize static assets

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run type-check
      - run: npx prisma generate
```

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] SSL certificate configured
- [ ] Domain DNS configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Security headers configured

## 🎯 Post-Deployment Tasks

1. **Verify Functionality**
   - Test user registration
   - Test deal claiming
   - Test admin access
   - Test mobile experience

2. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Review logs

3. **Security Audit**
   - Test authentication flows
   - Verify HTTPS
   - Check for vulnerabilities

---

For additional support, refer to the main README.md or create an issue in the repository.