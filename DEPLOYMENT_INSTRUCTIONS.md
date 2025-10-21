# 🚀 Happy Hour App - Production Deployment Guide

## 🎯 **Quick Deploy to Vercel (Recommended)**

### **Step 1: Prepare for Deployment**

1. **Generate a secure NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copy this secret - you'll need it for Vercel.

2. **Ensure your code is ready:**
   ```bash
   # Stop the dev server first
   # Then run a final build test
   npm run build
   ```

### **Step 2: Deploy to Vercel**

#### **Option A: Deploy via Vercel CLI (Fastest)**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel --prod
```

#### **Option B: Deploy via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### **Step 3: Configure Environment Variables**

In your Vercel dashboard, go to Settings → Environment Variables and add:

#### **Required Variables:**
- `DATABASE_URL` = `postgresql://neondb_owner:npg_8BkKMV2HSAUq@ep-proud-dream-ad9pw5hl-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- `NEXTAUTH_SECRET` = `[your-generated-secret]`
- `NEXTAUTH_URL` = `https://your-app-name.vercel.app` (auto-set by Vercel)

#### **Optional Variables (for enhanced features):**
- `GOOGLE_CLIENT_ID` = `[your-google-client-id]`
- `GOOGLE_CLIENT_SECRET` = `[your-google-client-secret]`
- `STRIPE_SECRET_KEY` = `[your-stripe-secret-key]`
- `STRIPE_PUBLISHABLE_KEY` = `[your-stripe-publishable-key]`
- `RESEND_API_KEY` = `[your-resend-api-key]`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = `[your-google-maps-key]`

### **Step 4: Connect Neon Database (Optional)**

1. In Vercel dashboard, go to Storage
2. Click "Create Database" → "Neon"
3. Connect your existing Neon database
4. Vercel will automatically set `DATABASE_URL`

### **Step 5: Deploy!**

Click "Deploy" and your app will be live in minutes!

---

## 🔧 **Alternative Deployment Options**

### **Railway Deployment**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **Netlify Deployment**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### **Docker Deployment**
```bash
# Build Docker image
docker build -t happy-hour-app .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-neon-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  happy-hour-app
```

---

## ✅ **Post-Deployment Checklist**

- [ ] App loads without errors
- [ ] Database connection working
- [ ] User registration works
- [ ] Merchant signup works
- [ ] Admin dashboard accessible
- [ ] Mobile interface responsive
- [ ] API endpoints responding
- [ ] SSL certificate active
- [ ] Domain configured (if custom)

---

## 🎉 **Your App is Live!**

Once deployed, your Happy Hour app will be available at:
- **Vercel:** `https://your-app-name.vercel.app`
- **Custom Domain:** `https://yourdomain.com` (if configured)

### **Key Features Available:**
- ✅ User authentication & registration
- ✅ Merchant dashboard & management
- ✅ Deal creation & browsing
- ✅ Mobile-responsive PWA
- ✅ Admin panel
- ✅ Real-time database (Neon)
- ✅ Secure API endpoints

---

## 🆘 **Troubleshooting**

### **Common Issues:**
1. **Build fails:** Check environment variables
2. **Database errors:** Verify DATABASE_URL format
3. **Auth issues:** Ensure NEXTAUTH_SECRET is set
4. **API errors:** Check function timeout settings

### **Support:**
- Check Vercel logs in dashboard
- Verify all environment variables
- Test database connection
- Review build logs for errors

---

**Ready to deploy? Choose your preferred method above! 🚀**
