# Happy Hour UX Refactor - Complete Plan

## 🎯 Objective
Transform Happy Hour into a seamless consumer app that makes it effortless to find, understand, and redeem deals.

## 📱 Core Flow
**Home → Explore → Deal Detail → Redeem → Wallet → Account**

## 🧩 Page Breakdown

### 1. Home Page - Personalized & Scannable
**Location:** app/page.tsx

**Key Changes:**
- Personalized header: "Deals near [Neighborhood] • [Time Range]" with edit icon
- Horizontal scrollable sections:
  - "Happening Now 🔥" (within 1 mile, ending soon)
  - "Tonight 5–8pm"
  - "Because You Liked [Cuisine]"
  - "New This Week"
- Large image cards with primary CTA
- Empty state with friendly copy
- Instant loading with skeleton loaders

### 2. Explore Page - Map + List View
**Location:** app/explore/page.tsx

**Key Changes:**
- Toggle between map and list views
- Top filter bar:
  - Search (cuisine/restaurant name)
  - Chips: Now / Later, $, $$, $$$, Vegan, Kosher, Gluten-Free, Distance
- Sort menu: Best Value • Closest • Ending Soon
- Card redesign with large images and clear info

### 3. Deal Detail - Clear & Actionable
**Location:** app/deal/[id]/view/page.tsx

**Key Changes:**
- Hero with 2-3 images
- Key info line: "50% off mains · dine-in · 3–6pm · 2 pax max"
- "Why it's a great deal" section
- "Fine print" (collapsible)
- "How to Redeem" (3-step guide)
- Primary: Redeem Now
- Secondary: Save for Later
- Tertiary: Share Deal

### 4. Redeem Flow - QR with Countdown
**Location:** New modal or full-screen page

**Key Changes:**
- Confirm party size (optional)
- Full-screen QR with 15-minute countdown
- Allow staff scan or manual code entry
- Confetti + "Added to Wallet"
- Rating prompt (thumbs up/down)

### 5. Wallet - Active Management
**Location:** app/wallet/page.tsx

**Key Changes:**
- Tabs: Active • Saved • History • Savings
- Active = live countdown timers
- Saved = reminders
- History = receipts + ratings
- Savings = monthly + lifetime totals

### 6. Account - Clean Organization
**Location:** app/account/page.tsx

**Key Changes:**
- Sub-tabs: Overview, Profile, Notifications, Preferences
- Instant profile editing (no reload)
- Sign Out button
- Theme toggle (light/dark)
- Recent savings summary

### 7. Navigation - Consistent 5 Icons
**Location:** New component + app/layout.tsx

**Key Changes:**
- Bottom nav: Home, Explore, Redeem, Wallet, Account
- Header: location + time window
- Remove floating + button
- Notification bell → dropdown

### 8. Onboarding - Delayed Signup
**Location:** New component

**Key Changes:**
- Delay until user saves/redeems
- Quick onboarding:
  - Allow location access
  - Choose vibe chips
  - Show results immediately
- Human copy with emoji

### 9. Merchant Flow - Clear Value Prop
**Location:** app/merchant/signup

**Key Changes:**
- Clear value prop: "Fill empty tables"
- Collect: info, images, time windows
- Better dashboard at /merchant/dashboard

### 10. UI/UX Polish
**Key Changes:**
- Modern gradients + glassmorphism (subtle)
- Rounded cards, soft shadows
- Neutral backgrounds (#f9f9f9)
- Button hierarchy:
  - Primary: orange (bg-orange-600 hover:bg-orange-700)
  - Secondary: white outline
  - Tertiary: text-only
- Large tap areas (≥48px)
- Strong contrast
- Responsive typography

## 🚀 Implementation Order

1. Navigation component (foundation)
2. Home page refactor
3. Explore page refactor
4. Deal detail refactor
5. Redeem flow implementation
6. Wallet refactor
7. Account refactor
8. Onboarding component
9. Merchant updates
10. Final polish

## ✅ Success Criteria

- Every page loads in < 1 second
- Every action has instant feedback
- No dead links or confusion
- Mobile-first, works on desktop
- Clear visual hierarchy
- Human, friendly copy
- Smooth animations
- Accessible (WCAG 2.1 AA)

