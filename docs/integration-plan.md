# Happy Hour - EatClub Integration Plan

## SAFETY & AUDIT SUMMARY

**Repository Status**: ✅ **SAFE TO PROCEED** - Non-destructive integration possible
**Architecture**: Next.js 14 App Router + Prisma + Tailwind CSS + Component Library
**Existing Features**: Strong foundation with merchant tools, deals, venues, and owner dashboard

---

## 0) EXISTING INVENTORY (DO NOT MODIFY)

### **PAGES & ROUTES - EXISTS** ✅
- `/` - Main deals discovery page with map/list views
- `/merchant` - Basic merchant dashboard (PARTIAL - needs enhancement)
- `/owner` - Owner dashboard for managing venues/deals
- `/account` - User account page
- `/favorites` - User favorites
- `/deal/[id]` - Individual deal view
- `/restaurant/[id]` - Restaurant detail
- `/brand` - Brand page
- `/login` - Authentication

### **API ROUTES - EXISTS** ✅
- `/api/owner/venues` - CRUD for venues
- `/api/owner/deals` - CRUD for deals  
- `/api/deals/search` - Deal search with filters
- `/api/auth/[...nextauth]` - NextAuth setup
- `/api/favorite/toggle` - Favorites management
- `/api/redeem/qr` - QR redemption
- `/api/reviews/[restaurantId]` - Reviews

### **COMPONENTS - EXISTS** ✅
- **UI Library**: Complete component system (Button, Card, Badge, Input, Modal, etc.)
- **Deal Components**: DealCard, DealForm, EnhancedDealForm, DealBottomSheet
- **Map Components**: MapWithClusters, MapView, MapPicker, MapMini
- **Merchant Components**: MerchantDash, MerchantUI
- **Layout**: ClientLayout with navigation, dark mode, location controls

### **DATA MODELS - EXISTS** ✅
- **User**: email, phone, role, walletCardId, preferredCities
- **Merchant**: businessName, abnOrEIN, payoutAccountId, kycStatus
- **Venue**: name, slug, address, geo, cuisine[], photos[], hours, rating, verified
- **Deal**: title, description, percentOff, timebox, maxRedemptions, tags, status
- **Redemption**: dealId, userId, status, code, expiresAt
- **WalletCard**: userId, stripeCardId, provisioning status
- **DynamicPricingHint**: venueId, window, recommendedPercentOff, confidence
- **Settlement**: merchantId, period, gross/fees/net, status

### **STYLING & THEMES - EXISTS** ✅
- **Design System**: Complete CSS custom properties for colors, spacing, shadows
- **Tailwind Config**: Extended with custom utilities, animations, responsive breakpoints
- **Dark Mode**: Full dark/light theme support
- **Component Variants**: Multiple variants for buttons, cards, badges, etc.

---

## 1) CORE USER FEATURES - STATUS

### **Time-boxed %-off deals** ✅ **EXISTS**
- Current: percentOff (5-50), startAt/endAt, countdown timers
- **ENHANCEMENT**: Add stock/seat caps (maxRedemptions exists, needs UI)

### **"Near Me" discovery** ✅ **EXISTS** 
- Current: Map/list views, distance sorting, location controls
- **ENHANCEMENT**: Add "open now" filter, enhance cuisine filters

### **Single "Claim" flow** ⚠️ **PARTIAL**
- Current: Redemption model exists, QR endpoint exists
- **MISSING**: Claim button UI, claim confirmation, active claim management
- **NEEDS**: Claim button component, claim status tracking

### **Wallet/Card redemption** ⚠️ **PARTIAL**
- Current: WalletCard model exists, provisioning status
- **MISSING**: Wallet page, tap-to-pay UI, QR fallback
- **NEEDS**: `/wallet` page, card provisioning UI

### **Venues index + detail** ⚠️ **PARTIAL**
- Current: Venue model exists, basic restaurant page
- **MISSING**: Venues index page, enhanced venue detail with gallery/hours
- **NEEDS**: `/venues` page, enhanced `/restaurant/[id]`

---

## 2) MERCHANT / PARTNER - STATUS

### **Public acquisition surfaces** ❌ **MISSING**
- **NEEDS**: `/for-restaurants` landing, `/partners/pricing` page
- **CREATE**: New pages with value props, case studies, pricing tiers

### **Merchant signup & onboarding** ⚠️ **PARTIAL**
- Current: Basic `/merchant` page, Merchant model exists
- **MISSING**: Signup flow, onboarding wizard, venue verification
- **NEEDS**: `/merchant/sign-up`, `/merchant/onboarding`, `/merchant/verify`

### **Merchant dashboard modules** ⚠️ **PARTIAL**
- Current: Basic deal management, owner dashboard
- **MISSING**: Deal templates, dynamic pricing, analytics, staff management
- **NEEDS**: Enhanced merchant dashboard with tabs for different modules

---

## 3) SUPPORTING PAGES - STATUS

### **All supporting pages** ❌ **MISSING**
- **NEEDS**: `/how-it-works`, `/faqs`, `/blog`, `/blog/[slug]`

---

## 4) DATA & API - STATUS

### **Models** ✅ **EXISTS** - All required models present
### **Endpoints** ⚠️ **PARTIAL** - Core CRUD exists, need merchant-specific endpoints

---

## 5) FLOWS & RULES - STATUS

### **Claim expiry** ✅ **EXISTS** - expiresAt field in Redemption model
### **Stock management** ✅ **EXISTS** - maxRedemptions, redeemedCount fields
### **Notifications** ❌ **MISSING** - No notification system

---

## 6) UI COMPONENTS - STATUS

### **Core UI** ✅ **EXISTS** - Complete component library
### **Deal Components** ✅ **EXISTS** - DealCard, DealForm, etc.
### **Map Components** ✅ **EXISTS** - MapWithClusters, MapView, etc.
### **Merchant Components** ⚠️ **PARTIAL** - Basic components exist, need enhancement

---

## 7) THEMING & ACCESSIBILITY - STATUS

### **Design Tokens** ✅ **EXISTS** - Complete CSS custom properties
### **Dark Mode** ✅ **EXISTS** - Full theme support
### **Component Variants** ✅ **EXISTS** - Multiple variants for all components

---

## INTEGRATION STRATEGY

### **PHASE 1: User Experience Enhancement (Non-destructive)**
1. Add claim button to existing DealCard component
2. Create `/wallet` page using existing WalletCard model
3. Enhance existing venue pages with missing features
4. Add "open now" filter to existing search

### **PHASE 2: Merchant Onboarding (Additive)**
1. Create new merchant signup/onboarding pages
2. Enhance existing merchant dashboard with new modules
3. Add merchant-specific API endpoints

### **PHASE 3: Supporting Content (Additive)**
1. Create missing supporting pages
2. Add blog system
3. Enhance FAQ and help content

---

## IMPLEMENTATION APPROACH

### **SAFETY PRINCIPLES**
- ✅ **NON-DESTRUCTIVE**: All existing functionality preserved
- ✅ **IDEMPOTENT**: Safe to run multiple times
- ✅ **ADDITIVE**: New features added without breaking existing
- ✅ **CONFIGURABLE**: Feature flags and options for new behavior

### **EXTENSION PATTERNS**
- **Existing Components**: Add new props/options, preserve existing behavior
- **Existing Pages**: Add new sections/tabs, keep current content
- **Existing APIs**: Add new endpoints, don't modify existing ones
- **Existing Models**: Add optional fields, don't change required ones

### **FEATURE FLAGS**
- `ENABLE_CLAIM_FLOW` - Toggle claim button functionality
- `ENABLE_WALLET_PAGE` - Toggle wallet page
- `ENABLE_MERCHANT_ONBOARDING` - Toggle new merchant flow
- `ENABLE_DYNAMIC_PRICING` - Toggle pricing hints
- `ENABLE_NOTIFICATIONS` - Toggle notification system

---

## NEXT STEPS

1. **IMMEDIATE**: Start with Phase 1 - enhance existing user experience
2. **SHORT TERM**: Add merchant onboarding flow
3. **MEDIUM TERM**: Complete supporting pages and content
4. **LONG TERM**: Advanced features like notifications and analytics

---

## RISK ASSESSMENT

- **LOW RISK**: User experience enhancements (existing components)
- **MEDIUM RISK**: New merchant pages (new routes, existing models)
- **LOW RISK**: Supporting content (completely new, no conflicts)

**OVERALL RISK**: 🟢 **LOW** - Strong foundation, clear separation of concerns

