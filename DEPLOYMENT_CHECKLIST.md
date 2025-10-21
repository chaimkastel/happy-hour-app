# Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables
Set the following environment variables in your Vercel project:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe (Required for merchant subscriptions)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_MONTHLY="price_..."

# Email (Required for notifications)
RESEND_API_KEY="re_..."

# Monitoring (Optional but recommended)
SENTRY_DSN="https://..."

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Rate Limiting (Optional - uses in-memory if not set)
REDIS_URL="redis://..."
```

### 2. Database Setup
```bash
# Run migrations
npx prisma migrate deploy

# Seed production database (creates admin user only)
npx prisma db seed
```

### 3. Stripe Configuration
1. Create Stripe account and get API keys
2. Create a product and price for monthly subscription
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Configure webhook events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

### 4. Domain Configuration
1. Point your domain to Vercel
2. Update `NEXTAUTH_URL` to your production domain
3. Ensure HTTPS is enabled

## Deployment Steps

### 1. Build and Deploy
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

### 2. Post-Deployment Verification

#### Database Connection
- [ ] Admin user created successfully
- [ ] Database queries working
- [ ] No connection errors in logs

#### Authentication
- [ ] Login page loads
- [ ] User registration works
- [ ] Password reset works
- [ ] Role-based redirects work

#### Stripe Integration
- [ ] Merchant subscription flow works
- [ ] Billing portal accessible
- [ ] Webhook events received
- [ ] Subscription status updates correctly

#### Core Features
- [ ] Deal browsing works
- [ ] Voucher claiming works
- [ ] Voucher redemption works
- [ ] Merchant dashboard accessible
- [ ] Admin panel accessible

#### Performance
- [ ] Page load times < 3 seconds
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Images load correctly

### 3. Security Verification
- [ ] No demo credentials in production
- [ ] Environment variables properly set
- [ ] HTTPS enforced
- [ ] Rate limiting working
- [ ] Input validation working

### 4. Monitoring Setup
- [ ] Sentry error tracking configured
- [ ] Logs being collected
- [ ] Uptime monitoring set up
- [ ] Performance monitoring active

## Testing Checklist

### Manual Testing
- [ ] Create test merchant account
- [ ] Subscribe to plan
- [ ] Create venue and deals
- [ ] Test voucher claim flow
- [ ] Test voucher redemption
- [ ] Test admin functions

### Load Testing
- [ ] Test with multiple concurrent users
- [ ] Verify rate limiting works
- [ ] Check database performance
- [ ] Monitor memory usage

## Rollback Plan

If issues are discovered:
1. Revert to previous Vercel deployment
2. Check database integrity
3. Verify environment variables
4. Test critical paths
5. Monitor error logs

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor error rates
- [ ] Check user registrations
- [ ] Verify payment processing
- [ ] Monitor performance metrics

### First Week
- [ ] Review user feedback
- [ ] Monitor conversion rates
- [ ] Check system stability
- [ ] Optimize based on usage patterns

## Emergency Contacts

- **Technical Lead**: [Your contact]
- **Database Admin**: [Your contact]
- **Stripe Support**: [Your contact]
- **Vercel Support**: [Your contact]

## Success Criteria

- [ ] Zero critical errors
- [ ] < 3 second page load times
- [ ] 99.9% uptime
- [ ] Successful payment processing
- [ ] User registration working
- [ ] All core features functional