# UX Transformation Plan

## Overview
Complete refactor of Happy Hour app to a consumer-first, mobile-optimized experience.

## Core Changes Required

### 1. Home Page (`app/page.tsx`)
**Current State:** Has hero, categories, testimonials, merchant section
**Target State:** 
- Simple top bar: Location + Time Range
- Search: "What do you feel like eating?"
- Horizontal sections:
  - 🔥 Happening Now (ending soon)
  - 🌙 Tonight's Happy Hours
  - 🍣 Because You Liked...
  - 🆕 New This Week
- Each card: Big photo, discount, category chips, "View & Redeem" CTA

### 2. Explore Page (`app/explore/page.tsx`)
**Current State:** Has search, filters, sort, view toggle
**Target State:** 
- Enhanced filter bar (Now/Later, price tiers, diet preferences)
- Better sort options (Best Value, Closest, Ending Soon)
- Map/List toggle
- Distance and rating on cards
- Empty state improvements

### 3. Deal Detail Page (`app/deal/[id]/view/page.tsx`)
**Current State:** Has hero, info, redeem button
**Target State:**
- Image slider (2-3 photos)
- Clear deal summary: "50% off mains · dine-in · 3-6pm · 2 pax max"
- ✅ "Why it's a good deal" section
- 📜 "Fine print" (collapsible)
- 📍 "How to redeem" (3-step visual)
- Improved CTAs

### 4. Redeem Flow
**Current State:** QR code component exists (`components/redeem/QRScanner.tsx`)
**Target State:**
- Full-screen QR modal
- 15-min countdown
- Party size confirmation
- Confetti on success
- Feedback request

### 5. Wallet Page (`app/wallet/page.tsx`)
**Current State:** Has tabs (Active, Redeemed, Expired), stats
**Target State:**
- Add "Saved" and "Savings" tabs
- Countdown timers on active vouchers
- Reminders for saved deals about to start
- History with rating option
- Savings tracking

### 6. Account Page (`app/account/page.tsx`)
**Current State:** Has profile, stats, settings
**Target State:**
- Add Preferences section (cuisine, diet, price range)
- Notifications toggles
- Profile editing improvements
- Dark mode toggle

### 7. Navigation
**Current State:** Bottom nav exists (`components/navigation/BottomNav.tsx`)
**Target State:**
- Consistent across all pages
- Floating + button for redeem shortcut
- Notification bell dropdown

### 8. Onboarding
**Current State:** Component exists (`components/onboarding/OnboardingGuide.tsx`)
**Target State:**
- Location access prompt
- Quick vibe selection (Pizza, Sushi, etc.)
- Show results immediately
- Signup only when needed

### 9. UI/UX Polish
- Color: Orange primary (#f97316)
- Large, legible typography
- Rounded cards, soft shadows
- Subtle animations (fade-ins, slides)
- Copywriting: Human, confident, friendly

## Implementation Order
1. Home page redesign with new sections
2. Explore page improvements
3. Deal detail enhancements
4. Redeem flow completion
5. Wallet redesign
6. Account improvements
7. Navigation consistency
8. UI polish & copywriting

