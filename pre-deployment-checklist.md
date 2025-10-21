# 🚀 Pre-Deployment Checklist

## ❌ CRITICAL - Must Fix Before Deployment

### 1. Database Connection (CRITICAL)
- [ ] **Update DATABASE_URL in .env.local**
  - Current: `postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`
  - Action: Replace with your actual Neon connection string
  - Get from: https://console.neon.tech/

### 2. Environment Variables
- [ ] **NEXTAUTH_SECRET** - Set to a secure random string
- [ ] **NEXTAUTH_URL** - Set to your production domain
- [ ] **RESEND_API_KEY** - For email functionality (optional)
- [ ] **GOOGLE_MAPS_API_KEY** - For location features (optional)

## ⚠️ RECOMMENDED - Should Fix

### 3. Sentry Configuration
- [ ] **SENTRY_DSN** - Replace placeholder with real DSN or remove
- [ ] **SENTRY_ORG** - Set your Sentry organization
- [ ] **SENTRY_PROJECT** - Set your Sentry project

### 4. Email Service
- [ ] **RESEND_API_KEY** - Configure for email notifications
- [ ] Test email sending functionality

## ✅ READY - Already Working

### 5. Database Schema
- [x] All tables created in Neon database
- [x] Prisma client generated
- [x] Database queries working

### 6. Application Structure
- [x] Next.js app running
- [x] API endpoints responding
- [x] Pages loading correctly
- [x] Authentication system ready

## 🧪 Testing Required

### 7. User Flows
- [ ] **Signup Flow** - Create new user account
- [ ] **Login Flow** - Authenticate existing user
- [ ] **Deal Browsing** - View deals on homepage/explore
- [ ] **Merchant Dashboard** - Access merchant features
- [ ] **Admin Panel** - Access admin features

### 8. API Endpoints
- [ ] **GET /api/deals** - Returns deals data
- [ ] **POST /api/auth/signup** - User registration
- [ ] **POST /api/auth/signin** - User authentication
- [ ] **GET /api/merchant/venues** - Merchant venues
- [ ] **GET /api/admin/users** - Admin user management

## 🚀 Deployment Steps

### 9. Vercel Deployment
- [ ] **Connect GitHub repository** to Vercel
- [ ] **Set environment variables** in Vercel dashboard
- [ ] **Deploy from main branch**
- [ ] **Verify production URL** works
- [ ] **Test all functionality** in production

### 10. Post-Deployment
- [ ] **Monitor error logs** in Vercel dashboard
- [ ] **Test critical user flows** in production
- [ ] **Verify database connectivity** in production
- [ ] **Check performance** and loading times

## 🔧 Quick Fix Commands

```bash
# 1. Update DATABASE_URL (replace with your actual Neon URL)
sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="your-actual-neon-url-here"|' .env.local

# 2. Generate secure NEXTAUTH_SECRET
openssl rand -hex 32

# 3. Test database connection
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✅ DB Connected')).catch(e => console.log('❌ DB Error:', e.message)).finally(() => prisma.\$disconnect());"

# 4. Test build
npm run build

# 5. Start production server
npm start
```

## 📋 Environment Variables for Production

```env
# Required
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secure-secret-here"

# Optional
RESEND_API_KEY="your-resend-key"
GOOGLE_MAPS_API_KEY="your-maps-key"
SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"
```

## 🎯 Success Criteria

- [ ] All pages load without errors
- [ ] Database queries work in production
- [ ] User signup/login functions
- [ ] No console errors in browser
- [ ] API endpoints return proper responses
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable (< 3s load time)
