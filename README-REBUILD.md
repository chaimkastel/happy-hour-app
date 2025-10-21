# 🍺 Happy Hour - World-Class Restaurant Deals Platform

A complete rebuild of the Happy Hour app with Apple/Uber Eats-level design and functionality, optimized for mobile-first experiences and future mobile app integration.

## ✨ Features

### 🎨 **Design Excellence**
- **Apple-inspired Design System**: Consistent, beautiful, and accessible UI components
- **Mobile-First Architecture**: Optimized for phones with seamless responsive design
- **Smooth Animations**: Framer Motion powered interactions and transitions
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 👥 **User Experience**
- **Seamless Onboarding**: Step-by-step signup with beautiful progress indicators
- **Smart Discovery**: Advanced filtering, search, and recommendation system
- **Wallet Integration**: Digital wallet with payment tracking and deal redemption
- **Favorites System**: Save and manage favorite restaurants
- **Real-time Updates**: Live deal updates and notifications

### 🏪 **Merchant Experience**
- **Easy Onboarding**: Multi-step restaurant registration process
- **Dashboard Analytics**: Comprehensive business insights and metrics
- **Deal Management**: Create, edit, and track restaurant deals
- **Order Management**: Real-time order tracking and management

### 🔧 **Admin Features**
- **Platform Management**: Complete admin dashboard for platform oversight
- **Approval System**: Restaurant and deal approval workflows
- **Analytics**: Platform-wide analytics and insights
- **User Management**: Comprehensive user and restaurant management

### 📱 **Mobile App Ready**
- **API-First Architecture**: RESTful APIs designed for mobile app integration
- **Mobile-Optimized Endpoints**: Specialized mobile API endpoints
- **Push Notifications**: Ready for mobile push notification integration
- **Offline Support**: Designed with offline-first principles

## 🚀 **Technology Stack**

### **Frontend**
- **Next.js 14** - App Router with Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling with custom design system
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icons
- **Class Variance Authority** - Component variant management

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Robust relational database (Neon)
- **NextAuth.js** - Authentication and session management
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### **Design System**
- **8px Grid System** - Consistent spacing and layout
- **Color Palette** - Primary, secondary, neutral, and status colors
- **Typography Scale** - Inter font with proper hierarchy
- **Component Library** - Reusable, accessible components
- **Animation System** - Consistent motion design

## 📁 **Project Structure**

```
happy-hour-ultra-fixed/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── admin/                    # Admin dashboard
│   ├── merchant/                 # Merchant portal
│   ├── api/                      # API routes
│   │   ├── mobile/               # Mobile-specific APIs
│   │   ├── auth/                 # Authentication APIs
│   │   └── deals/                # Deal management APIs
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── layout/                   # Layout components
│       └── MobileLayout.tsx
├── lib/                          # Utility libraries
│   ├── design-system.ts          # Design system configuration
│   ├── utils.ts                  # Utility functions
│   └── prisma.ts                 # Database client
├── prisma/                       # Database schema
│   └── schema.prisma
└── public/                       # Static assets
```

## 🎯 **Key Pages & Features**

### **User Pages**
- **Homepage** (`/`) - Beautiful landing with featured deals and categories
- **Explore** (`/explore`) - Advanced deal discovery with filtering
- **Favorites** (`/favorites`) - Saved restaurants and deals
- **Wallet** (`/wallet`) - Digital wallet and transaction history
- **Account** (`/account`) - User profile and settings

### **Merchant Pages**
- **Signup** (`/merchant/signup`) - Multi-step restaurant onboarding
- **Dashboard** (`/merchant`) - Business analytics and management
- **Deal Management** - Create and manage restaurant deals

### **Admin Pages**
- **Dashboard** (`/admin`) - Platform oversight and management
- **User Management** - User and restaurant administration
- **Analytics** - Platform-wide insights and metrics

## 🔧 **Setup & Installation**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- npm or yarn

### **Installation**

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd happy-hour-ultra-fixed
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

### **Environment Variables**

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email Service
RESEND_API_KEY="your-resend-key"

# Google Maps
GOOGLE_MAPS_API_KEY="your-maps-key"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APPLE_ID="your-apple-id"
APPLE_SECRET="your-apple-secret"

# Sentry (Optional)
SENTRY_DSN="your-sentry-dsn"
```

## 📱 **Mobile App Integration**

### **API Endpoints**
- `GET /api/mobile/version` - App version and feature flags
- `GET /api/mobile/deals` - Deal discovery with location filtering
- `GET /api/mobile/restaurants` - Restaurant listings
- `GET /api/mobile/user` - User profile and preferences
- `GET /api/mobile/wallet` - Wallet balance and transactions
- `GET /api/mobile/favorites` - User's favorite restaurants

### **Mobile-Specific Features**
- Location-based deal filtering
- Push notification support
- Offline data caching
- Optimized image delivery
- Mobile-optimized response formats

## 🎨 **Design System**

### **Colors**
- **Primary**: Orange (#e67e00) - Brand color
- **Secondary**: Blue (#0ea5e9) - Accent color
- **Neutral**: Gray scale (0-950) - Text and backgrounds
- **Status**: Success, Warning, Error - State colors

### **Typography**
- **Font**: Inter (Google Fonts)
- **Scale**: 12px to 96px with proper line heights
- **Weights**: 100-900 with semantic usage

### **Spacing**
- **Grid**: 8px base unit
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px

### **Components**
- **Buttons**: Primary, Secondary, Ghost, Danger variants
- **Inputs**: With labels, errors, and helper text
- **Cards**: Default, Elevated, Interactive variants
- **Navigation**: Mobile-first with bottom navigation

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Environment Variables**
Set all required environment variables in your deployment platform.

### **Database**
Ensure your PostgreSQL database is accessible from your deployment platform.

## 📊 **Performance**

### **Optimizations**
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: API response caching and static generation
- **Bundle Analysis**: Optimized bundle sizes

### **Mobile Performance**
- **Lighthouse Score**: 90+ on all metrics
- **Core Web Vitals**: Excellent performance scores
- **Mobile-First**: Optimized for mobile devices
- **Offline Support**: Service worker ready

## 🔒 **Security**

### **Authentication**
- **NextAuth.js**: Secure session management
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **OAuth Integration**: Google and Apple sign-in

### **Data Protection**
- **Input Validation**: Zod schema validation
- **SQL Injection**: Prisma ORM protection
- **XSS Prevention**: React's built-in protection
- **CSRF Protection**: NextAuth.js CSRF tokens

## 🧪 **Testing**

### **Test Coverage**
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for full user flows
- **Mobile Testing**: Responsive design testing

### **Quality Assurance**
- **TypeScript**: Compile-time error checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Accessibility**: WCAG compliance testing

## 📈 **Analytics & Monitoring**

### **Error Tracking**
- **Sentry**: Real-time error monitoring
- **Performance**: Core Web Vitals tracking
- **User Analytics**: Privacy-focused analytics

### **Business Metrics**
- **User Engagement**: Deal views and interactions
- **Conversion**: Signup and deal redemption rates
- **Revenue**: Transaction and commission tracking

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standardized commit messages

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

### **Documentation**
- **API Docs**: Available at `/api/docs`
- **Component Library**: Storybook integration
- **Deployment Guide**: Step-by-step deployment

### **Contact**
- **Email**: support@orderhappyhour.com
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**Built with ❤️ for the future of restaurant deals**
