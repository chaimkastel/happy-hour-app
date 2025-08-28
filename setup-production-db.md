# 🚀 Production Database Setup Guide

## 🔧 **Issue Identified**
Your Vercel deployment is failing because:
- ❌ **SQLite not supported** on Vercel serverless functions
- ❌ **Database URL** needs to be PostgreSQL format
- ❌ **Environment variables** not configured for production

## ✅ **Solution: Set Up PostgreSQL Database**

### **Option 1: Neon (Recommended - Free)**
1. **Go to**: https://neon.tech
2. **Sign up** for free account
3. **Create new project**: "happy-hour-app"
4. **Copy connection string** (looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require
   ```

### **Option 2: Supabase (Alternative)**
1. **Go to**: https://supabase.com
2. **Create new project**
3. **Get connection string** from Settings > Database

### **Option 3: Railway (Alternative)**
1. **Go to**: https://railway.app
2. **Create PostgreSQL database**
3. **Copy connection string**

## 🔑 **Configure Vercel Environment Variables**

1. **Go to**: https://vercel.com/dashboard
2. **Select your project**: happy-hour-app
3. **Go to**: Settings > Environment Variables
4. **Add these variables**:

```
DATABASE_URL = postgresql://username:password@host:port/database?sslmode=require
NEXTAUTH_SECRET = your-super-secret-key-here-12345
NEXTAUTH_URL = https://orderhappyhour.com
NODE_ENV = production
```

## 🗄️ **Database Migration**

After setting up the database, run:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push

# Seed with sample data
npx prisma db seed
```

## 🚀 **Deploy**

Once database is configured:

```bash
git add .
git commit -m "Configure PostgreSQL for production"
git push origin main
```

## 🔍 **Verify Deployment**

Check these URLs:
- **Health**: https://orderhappyhour.com/api/admin/health
- **Deals**: https://orderhappyhour.com/api/deals/search
- **Homepage**: https://orderhappyhour.com

---

**Need Help?** The database setup is the only thing blocking your deployment. Once configured, everything will work perfectly! 🎉
