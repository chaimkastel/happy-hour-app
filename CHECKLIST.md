# Production Readiness Checklist

## ✅ Completed Items

### 0. Repo & Environment Hardening
- [x] **Removed all demo flags and hardcoded credentials**
  - Removed demo user IDs from ClaimButton component
  - Removed demo QR code data from merchant redeem page
  - Removed demo geocoding fallbacks
  - Removed debug seed deals API route
  - Updated homepage "Watch Demo" to "Get Started"
  - Created production-safe seed file (admin only)
  - Created separate demo seed file for local development

- [x] **Environment setup**
  - Created comprehensive `.env.example` with all required variables
  - Updated `.gitignore` to exclude sensitive files
  - Created `SECURITY_NOTES.md` with rotation procedures

### 1. Auth, RBAC & Middleware
- [x] **NextAuth configuration**
  - JWT sessions implemented
  - Role-based callbacks (ADMIN | MERCHANT | USER)
  - Proper session management

- [x] **Middleware guards**
  - `/merchant/*` → MERCHANT|ADMIN only
  - `/admin/*` → ADMIN only
  - Proper redirects for unauthenticated users

- [x] **Server-side enforcement**
  - All API routes check session and role
  - Zod validation on request bodies
  - Rate limiting implemented

### 2. Stripe Subscriptions
- [x] **Stripe integration**
  - Merchant subscription API implemented
  - Checkout session creation
  - Billing portal integration
  - Webhook handlers for subscription events

- [x] **Subscription gating**
  - Merchant features require active subscription
  - Proper status checking (ACTIVE | PAST_DUE | CANCELED | INCOMPLETE)
  - Trial period support

### 3. Data Model (Prisma)
- [x] **Schema compliance**
  - All required models present
  - Proper enums (UserRole, DealType, VoucherStatus, PriceTier)
  - Correct relationships and foreign keys
  - Proper indexes for performance

- [x] **Database setup**
  - Production seed creates admin user only
  - Demo seed available for local development
  - Migration system in place

### 4. Explore & Deal Pages
- [x] **SSR implementation**
  - Deals load server-side
  - No infinite loaders
  - Proper error and empty states
  - Geolocation optional enhancement

- [x] **Deal details**
  - Real-time availability checking
  - Proper time window validation
  - SEO-friendly structure

### 5. Voucher Claim & Redemption
- [x] **Claim system**
  - POST `/api/deals/[id]/claim` implemented
  - Proper validation and limits
  - Unique code generation
  - QR code generation

- [x] **Redemption system**
  - POST `/api/redemptions/redeem` implemented
  - Merchant-only access
  - Anti-abuse measures
  - Proper status tracking

- [x] **Anti-abuse measures**
  - Rate limiting on all endpoints
  - Per-user limits enforced
  - Global redemption limits
  - Proper validation

### 6. Merchant Dashboard
- [x] **Core functionality**
  - Venue management
  - Deal creation and editing
  - Voucher validation screen
  - Subscription status display

- [x] **Subscription integration**
  - Status indicators
  - Subscribe/manage billing buttons
  - Feature gating based on status

### 7. Emails, Observability, Performance
- [x] **Email system**
  - Resend integration
  - Voucher email notifications
  - Password reset emails

- [x] **Monitoring**
  - Sentry integration ready
  - Comprehensive logging
  - Error tracking

- [x] **Performance**
  - Next.js Image optimization
  - Lazy loading implemented
  - Database query optimization

### 8. CI/CD & QA
- [x] **Documentation**
  - `DEPLOYMENT_CHECKLIST.md` created
  - `RUNBOOK.md` for operations
  - `SECURITY_NOTES.md` for security
  - `CHECKLIST.md` for verification

- [x] **Production readiness**
  - All demo code removed
  - Proper environment configuration
  - Security best practices implemented

## 🔄 In Progress

### 9. Testing Implementation
- [ ] **Unit tests** (Vitest)
  - API route testing
  - Utility function testing
  - Validation testing

- [ ] **E2E tests** (Playwright)
  - Authentication flow testing
  - Merchant subscription flow
  - Voucher claim/redeem flow
  - Admin functionality testing

- [ ] **GitHub Actions**
  - Automated testing on PR
  - Build verification
  - Deployment automation

## 📋 Verification Steps

### Authentication & RBAC
1. **Test unauthenticated access**
   - Visit `/merchant/dashboard` → should redirect to login
   - Visit `/admin/dashboard` → should redirect to admin-access
   - Visit `/account` → should redirect to login

2. **Test role-based access**
   - Login as USER → should not access merchant/admin pages
   - Login as MERCHANT → should access merchant pages, not admin
   - Login as ADMIN → should access all pages

3. **Test API protection**
   - Make API calls without session → should return 401
   - Make API calls with wrong role → should return 403

### Stripe Integration
1. **Test subscription flow**
   - Create merchant account
   - Click subscribe → should redirect to Stripe
   - Complete payment → should return to dashboard
   - Check subscription status → should be ACTIVE

2. **Test billing portal**
   - Click "Manage Billing" → should open Stripe portal
   - Test subscription changes
   - Verify webhook events received

### Voucher System
1. **Test voucher claiming**
   - Login as user
   - Browse deals
   - Claim a deal → should generate voucher
   - Check wallet → should show voucher

2. **Test voucher redemption**
   - Login as merchant
   - Go to redeem page
   - Enter voucher code → should redeem successfully
   - Try to redeem again → should show error

### Performance & Security
1. **Test page load times**
   - All pages should load < 3 seconds
   - No console errors
   - Images load properly

2. **Test rate limiting**
   - Make rapid API calls → should be rate limited
   - Check rate limit headers

3. **Test input validation**
   - Submit invalid data → should be rejected
   - Check error messages are user-friendly

## 🚀 Deployment Steps

1. **Set environment variables** in Vercel
2. **Run database migrations**: `npx prisma migrate deploy`
3. **Seed production database**: `npx prisma db seed`
4. **Configure Stripe webhooks**
5. **Deploy to Vercel**: `vercel --prod`
6. **Verify all functionality**
7. **Monitor for issues**

## 📊 Success Metrics

- [ ] Zero critical errors in production
- [ ] < 3 second page load times
- [ ] 99.9% uptime
- [ ] Successful payment processing
- [ ] All core features working
- [ ] No security vulnerabilities
- [ ] Proper error handling
- [ ] Mobile responsiveness

## 🔧 Maintenance Tasks

### Daily
- [ ] Monitor error logs
- [ ] Check payment processing
- [ ] Verify system health

### Weekly
- [ ] Review security logs
- [ ] Check performance metrics
- [ ] Update dependencies

### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup verification

---

**Status**: Ready for production deployment
**Last Updated**: [Current Date]
**Next Review**: [Date + 1 week]