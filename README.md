# OrderHappyHour 🍺

A modern platform connecting food lovers with amazing restaurant deals through vouchers and subscriptions.

## Features

### For Users
- 🍽️ **Discover Deals**: Browse happy hour and instant deals from local restaurants
- 🎫 **Claim Vouchers**: Get unique voucher codes with QR codes for easy redemption
- 📱 **Mobile-First**: Optimized for mobile devices with PWA support
- 🗺️ **Location-Based**: Find deals near you with smart location services
- ⭐ **Favorites**: Save your favorite restaurants and deals

### For Merchants
- 💳 **Subscription Model**: Monthly subscription for deal management
- 🏪 **Venue Management**: Manage multiple restaurant locations
- 🎯 **Deal Creation**: Create happy hour and instant deals with time windows
- 📊 **Analytics**: Track redemption rates and performance
- 🔍 **Voucher Validation**: Easy QR code and voucher validation system

### For Admins
- 👥 **User Management**: Manage users, merchants, and venues
- 📈 **Dashboard**: Comprehensive analytics and system overview
- ✅ **Approval System**: Approve new merchants and deals
- 🔧 **System Management**: Monitor system health and performance

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Email**: Resend
- **Monitoring**: Sentry
- **Testing**: Playwright, Vitest
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/orderhappyhour.git
   cd orderhappyhour
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgres://username:password@host:port/database"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   STRIPE_PRICE_MONTHLY="price_..."
   RESEND_API_KEY="re_..."
   SENTRY_DSN="https://..."
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── merchant/          # Merchant pages
│   ├── mobile/            # Mobile-specific pages
│   └── (auth)/            # Authentication pages
├── components/            # Reusable components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── test/                 # Test files
│   ├── e2e/             # End-to-end tests
│   └── lib/             # Unit tests
└── public/               # Static assets
```

## API Endpoints

### Public Endpoints
- `GET /api/deals/search` - Search deals
- `POST /api/deals/[id]/claim` - Claim a deal
- `POST /api/redemptions/redeem` - Redeem a voucher
- `POST /api/newsletter/subscribe` - Newsletter subscription

### Merchant Endpoints
- `GET /api/merchant/dashboard` - Dashboard data
- `GET /api/merchant/venues` - List venues
- `POST /api/merchant/venues` - Create venue
- `GET /api/merchant/deals` - List deals
- `POST /api/merchant/deals` - Create deal
- `POST /api/merchant/subscribe` - Start subscription

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/merchants` - List merchants
- `PATCH /api/admin/merchants` - Update merchant

## Database Schema

### Core Models
- **User**: User accounts with role-based access
- **Merchant**: Restaurant business accounts
- **Venue**: Individual restaurant locations
- **Deal**: Happy hour and instant deals
- **Voucher**: Single-use redemption codes
- **Favorite**: User's favorite deals
- **AuditLog**: System activity tracking

### Key Relationships
- User → Merchant (one-to-one)
- Merchant → Venue (one-to-many)
- Venue → Deal (one-to-many)
- Deal → Voucher (one-to-many)
- User → Favorite (many-to-many)

## Authentication & Authorization

### Roles
- **USER**: Can browse deals, claim vouchers
- **MERCHANT**: Can manage venues and deals
- **ADMIN**: Full system access

### Authentication Flow
1. User signs up with email/password
2. Email verification (optional)
3. Role assignment based on signup type
4. JWT token for session management

## Payment Integration

### Stripe Integration
- **Checkout Sessions**: For merchant subscriptions
- **Billing Portal**: For subscription management
- **Webhooks**: For subscription status updates

### Subscription Flow
1. Merchant signs up
2. Redirected to Stripe Checkout
3. Payment processed
4. Webhook updates subscription status
5. Access granted to merchant features

## Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Test Coverage
- API endpoint testing
- Component testing
- User flow testing
- Payment flow testing

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Migration
```bash
npx prisma migrate deploy
```

### Environment Variables
See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete setup instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure mobile responsiveness

## Security

### Data Protection
- All passwords hashed with bcrypt
- Sensitive data encrypted at rest
- HTTPS enforced in production
- Rate limiting on API endpoints

### Privacy
- GDPR compliant data handling
- User data export/deletion
- Transparent privacy policy
- Secure payment processing

## Monitoring & Analytics

### Error Tracking
- Sentry integration for error monitoring
- Performance tracking
- User session recording

### Analytics
- User behavior tracking
- Conversion rate monitoring
- Performance metrics

## Support

### Documentation
- API documentation
- User guides
- Admin documentation
- Troubleshooting guides

### Contact
- Email: support@orderhappyhour.com
- Phone: 1-800-ORDER-HH
- Documentation: [docs.orderhappyhour.com](https://docs.orderhappyhour.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Next.js and the amazing React ecosystem
- Powered by Stripe for payments
- Designed with Tailwind CSS
- Deployed on Vercel

---

**OrderHappyHour** - Making great food more accessible, one deal at a time! 🍺