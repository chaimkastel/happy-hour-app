# End-to-End Test Plan for Happy Hour App

## Pre-Testing Setup

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Open Browser
Navigate to: http://localhost:3000

## Test Scenarios

### Test 1: Unauthenticated User Journey

#### 1.1 Home Page
- [ ] Page loads without errors
- [ ] Location display shows "Brooklyn" (or detected location)
- [ ] Search bar displays placeholder "Find deals by cuisine, restaurant, or vibe…"
- [ ] Category chips display (Pizza, Sushi, Burgers, etc.)
- [ ] Deal cards load with images, venue names, discounts
- [ ] "View & Redeem" buttons are visible
- [ ] Heart icons are present on each card
- [ ] Bottom navigation visible with Home, Explore, Favorites, Wallet, Account

#### 1.2 Signup Flow
- [ ] Click "Sign up here" on login page (or navigate to /signup)
- [ ] Fill in signup form:
  - First Name: John
  - Last Name: Doe
  - Email: test@example.com
  - Phone: +1 555-1234
  - Password: Test123!
  - Confirm Password: Test123!
  - Check "I agree to terms"
- [ ] Submit form
- [ ] **Expected**: Auto-login after signup, redirect to home page
- [ ] User sees personalized greeting

#### 1.3 Login Flow
- [ ] Navigate to /login
- [ ] Enter credentials:
  - Email: test@example.com
  - Password: Test123!
- [ ] Click "Sign In"
- [ ] **Expected**: Login successful, redirect to home page
- [ ] Session persists (refresh page, still logged in)

### Test 2: Authenticated User Journey

#### 2.1 Explore Deals
- [ ] Navigate to /explore
- [ ] Search bar displays
- [ ] Type "Pizza" in search
- [ ] **Expected**: Deal cards filter to show pizza deals
- [ ] Click on category chip (e.g., "Italian")
- [ ] **Expected**: Deals filter to Italian category
- [ ] Toggle between Grid and List view
- [ ] **Expected**: Layout changes appropriately

#### 2.2 View Deal Details
- [ ] Click "View & Redeem" on any deal card
- [ ] **Expected**: Navigate to /deal/{id}/view
- [ ] Hero image displays
- [ ] Venue name, description, discount visible
- [ ] "Claim & Redeem" button visible
- [ ] Back button works

#### 2.3 Favorites
- [ ] From home page or explore page
- [ ] Click heart icon on any deal
- [ ] **Expected**: Heart fills with color, toast shows "Saved to favorites"
- [ ] Navigate to /favorites
- [ ] **Expected**: Saved deal appears in favorites list
- [ ] Click heart again to unfavorite
- [ ] **Expected**: Toast shows "Removed from favorites"

#### 2.4 Wallet
- [ ] Navigate to /wallet
- [ ] **Expected**: Stats cards show (Active, Saved, Total Savings)
- [ ] Tabs display (Active, Redeemed, Expired)
- [ ] **Expected**: Empty state with "Browse Deals" button if no vouchers
- [ ] Click "Browse Deals"
- [ ] **Expected**: Navigate to /explore

#### 2.5 Account Page
- [ ] Navigate to /account
- [ ] **Expected**: Profile information displays
- [ ] Stats cards show (Points, Deals, Savings)
- [ ] Click "Edit Profile"
- [ ] **Expected**: Form becomes editable
- [ ] Change name or phone
- [ ] Click "Save Changes"
- [ ] **Expected**: Profile updates, success message shows

#### 2.6 Sign Out
- [ ] Navigate to /account
- [ ] Click "Sign Out" button
- [ ] **Expected**: Session cleared, redirect to home page
- [ ] User is no longer authenticated
- [ ] Try accessing /account
- [ ] **Expected**: Redirect to /login

### Test 3: Navigation

#### 3.1 Bottom Navigation
- [ ] Click each tab in bottom navigation
- [ ] Home → **Expected**: Navigate to /
- [ ] Explore → **Expected**: Navigate to /explore
- [ ] Favorites → **Expected**: Navigate to /favorites (or login if not signed in)
- [ ] Wallet → **Expected**: Navigate to /wallet (or login if not signed in)
- [ ] Account → **Expected**: Navigate to /account (or login if not signed in)

#### 3.2 Sticky Header (if exists)
- [ ] Scroll down on home page
- [ ] **Expected**: Sticky context bar appears (if implemented)
- [ ] Click "Edit" to change location
- [ ] **Expected**: Location modal opens

### Test 4: Responsive Design

#### 4.1 Mobile View (320px-768px)
- [ ] Open browser DevTools
- [ ] Set viewport to mobile size
- [ ] **Expected**: Bottom navigation visible
- [ ] Cards stack vertically
- [ ] Text remains readable
- [ ] Buttons are tappable

#### 4.2 Tablet View (768px-1024px)
- [ ] Set viewport to tablet size
- [ ] **Expected**: Multi-column layouts
- [ ] Cards in grid format

#### 4.3 Desktop View (1024px+)
- [ ] Set viewport to desktop size
- [ ] **Expected**: Full-width layouts
- [ ] Maximum content width
- [ ] Side-by-side columns

### Test 5: Error Handling

#### 5.1 Invalid Route
- [ ] Navigate to /nonexistent
- [ ] **Expected**: 404 page displays

#### 5.2 Protected Route (Unauthenticated)
- [ ] Sign out if signed in
- [ ] Navigate to /account
- [ ] **Expected**: Redirect to /login

#### 5.3 Network Errors
- [ ] Disconnect internet
- [ ] Try to load deals
- [ ] **Expected**: Error message or empty state

## Test Results Recording

### Success Criteria
- ✅ All authentication flows work correctly
- ✅ All navigation works
- ✅ All pages render without errors
- ✅ Session persists across page refreshes
- ✅ Responsive design works on all screen sizes
- ✅ No JavaScript console errors

### Known Issues
- Some images may return 404 (unsplash URLs expire)
- Redis warnings in console (expected in local dev)
- Prisma schema logs (handled with select queries)

## Post-Testing

### Cleanup
- Sign out from test account
- Clear browser cache if needed
- Stop development server

### Next Steps
1. Fix any critical issues found
2. Update image URLs if needed
3. Deploy to production
4. Run production tests

