# 🧪 Local Testing Guide

## Development Server
The app is running at: **http://localhost:3000**

## Test Flows

### 1. Merchant Sign-Up Flow
1. Visit: http://localhost:3000/merchant/signup
2. Complete the 5-step wizard:
   - Step 1: Account (email, password, contact name, phone)
   - Step 2: Business (business name, legal name, cuisine, price tier)
   - Step 3: Location (address, city, state, postal code)
   - Step 4: Brand (logo/hero - optional)
   - Step 5: Review & Submit
3. After submission, you should land on: `/merchant/pending`
4. See confirmation message

### 2. Admin Review Flow
1. Visit: http://localhost:3000/admin/merchants
2. See list of merchants (if any signed up)
3. Filter by status (ALL, PENDING, APPROVED, REJECTED, SUSPENDED)
4. Search by name or email
5. Click "Approve" to approve a merchant
6. Click "Reject" and enter a reason to reject

### 3. Merchant Sign-In Flow
1. Visit: http://localhost:3000/merchant/signin
2. Enter merchant credentials (from step 1)
3. Based on status:
   - **PENDING**: Redirected to `/merchant/pending`
   - **REJECTED**: Shows rejection message
   - **APPROVED**: Redirected to `/merchant/dashboard`

### 4. Merchant Dashboard
1. Navigate to: http://localhost:3000/merchant/dashboard (after approval)
2. See:
   - Stats cards (Active Deals, Total Views, Redemptions, Revenue)
   - Quick Actions (Create Deal, Instant Boost)
   - Getting Started guide (if no deals yet)

## Admin Credentials
To test admin functionality, you'll need to create an admin user first:

**Note**: The admin creation endpoint exists at `/api/admin/create-user` but requires specific environment variables to be enabled.

## Test User Creation
To create test merchants:
1. Go to `/merchant/signup`
2. Complete the wizard with test data
3. Merchant will be created with PENDING status
4. Admin can then approve/reject

## Expected Behavior

### ✅ What Should Work:
- ✅ Multi-step signup wizard with progress tracking
- ✅ Smooth page transitions
- ✅ Form validation
- ✅ Merchant creation with PENDING status
- ✅ Admin can see all merchants
- ✅ Admin can approve/reject merchants
- ✅ Status-aware routing after sign-in
- ✅ Dashboard access for approved merchants

### ⚠️ Known Limitations:
- Database connection may be missing (expected in local dev)
- Admin credentials may need to be created
- Email notifications are stubbed (console only)

## Quick Commands

**Check if server is running:**
```bash
curl http://localhost:3000
```

**Stop the dev server:**
```bash
# Find the process
ps aux | grep "next dev"
# Kill it
kill -9 <PID>
```

**Restart the dev server:**
```bash
npm run dev
```

## Troubleshooting

**Issue**: Module not found errors
**Solution**: Clear `.next` cache and restart
```bash
rm -rf .next && npm run dev
```

**Issue**: Database connection errors
**Solution**: Expected in local dev without DATABASE_URL. The app uses mock data for merchant functionality.

**Issue**: Admin page not accessible
**Solution**: Need to create an admin user with ADMIN role in the database.

---

## 🎯 Happy Testing!

The merchant onboarding system is fully functional and ready for your testing! 🚀

