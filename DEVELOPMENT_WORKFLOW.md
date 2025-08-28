# 🚀 Happy Hour App Development Workflow

## 📋 **Development Process**

### **1. Local Development**
```bash
# Start local development server
npm run dev

# Your app will be available at: http://localhost:3000
```

### **2. Testing Locally**
- ✅ Test all features on `http://localhost:3000`
- ✅ Check mobile pages: `/mobile/explore`, `/mobile/account`, `/mobile/favorites`
- ✅ Test admin system: `/admin/login` (password: `admin123`)
- ✅ Test merchant features: `/merchant/dashboard`
- ✅ Verify API endpoints work correctly

### **3. When Ready to Deploy**
```bash
# Use the deployment script
./deploy.sh
```

The script will:
1. ✅ Check for uncommitted changes
2. ✅ Run build test
3. ✅ Push to GitHub
4. ✅ Deploy to Vercel

## 🌐 **Your Online App**
- **URL**: https://www.orderhappyhour.com
- **Admin**: https://www.orderhappyhour.com/admin/login
- **Mobile**: https://www.orderhappyhour.com/mobile

## 🔧 **Quick Commands**

### **Local Development**
```bash
npm run dev          # Start development server
npm run build        # Test build
npm run lint         # Check for linting errors
```

### **Database**
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Sync database schema
npx prisma studio    # Open database GUI
```

### **Deployment**
```bash
./deploy.sh          # Full deployment workflow
git push origin main # Manual push (auto-deploys to Vercel)
```

## 📱 **Features to Test Locally**

### **Core Features**
- [ ] Homepage loads correctly
- [ ] Deal search and filtering
- [ ] Mobile responsive design
- [ ] User authentication

### **Mobile Pages**
- [ ] `/mobile/explore` - Deal discovery
- [ ] `/mobile/account` - User profile
- [ ] `/mobile/favorites` - Saved deals

### **Admin System**
- [ ] `/admin/login` - Admin authentication
- [ ] `/admin` - Dashboard and analytics
- [ ] User management
- [ ] Deal management

### **Merchant Features**
- [ ] `/merchant/dashboard` - Merchant overview
- [ ] `/merchant/deals/new` - Create deals
- [ ] `/merchant/venues` - Venue management

## 🚨 **Before Deploying**

1. **Test Everything Locally**
   - All pages load without errors
   - All features work as expected
   - Mobile responsiveness is good
   - No console errors

2. **Check Build**
   ```bash
   npm run build
   ```
   - Should complete without errors
   - All pages should build successfully

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Your descriptive message"
   ```

## 🎯 **Deployment Checklist**

- [ ] Local testing complete
- [ ] Build successful
- [ ] All changes committed
- [ ] Ready to deploy

## 🔍 **Troubleshooting**

### **Local Server Issues**
```bash
# Kill any running servers
pkill -f "next dev"

# Restart fresh
npm run dev
```

### **Database Issues**
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (if needed)
npx prisma db push --force-reset
```

### **Build Issues**
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

## 📞 **Support**

If you encounter issues:
1. Check the terminal output for errors
2. Verify all environment variables are set
3. Ensure database is accessible
4. Test individual components

---

**Happy Coding! 🎉**
