# Happy Hour App - Restaurant Deals Platform

A comprehensive Next.js application for discovering and managing restaurant deals, built with TypeScript, Prisma, and NextAuth.

## 🚀 Features

### User Features
- **Deal Discovery**: Browse and search for restaurant deals with advanced filtering
- **Account Management**: User registration, authentication, and profile management
- **Favorites**: Save and manage favorite deals
- **Wallet**: Claim and track deal redemptions
- **Mobile Experience**: Optimized mobile interface for deal browsing
- **Email Verification**: Secure account verification system
- **Password Reset**: Forgot password functionality

### Merchant Features
- **Dashboard**: Comprehensive merchant dashboard with analytics
- **Deal Management**: Create, edit, and manage restaurant deals
- **Venue Management**: Add and manage restaurant locations
- **Real-time Control**: Activate/deactivate deals instantly
- **Analytics**: Track deal performance and customer engagement

### Admin Features
- **User Management**: Manage users, merchants, and applications
- **Deal Moderation**: Review and approve deals
- **System Monitoring**: Health checks and performance monitoring
- **Analytics**: Platform-wide analytics and insights
- **Security Controls**: Role-based access control

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with role-based access
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/chaimkastel/happy-hour-app.git
cd happy-hour-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: External Services
EXTERNAL_LOGGING_ENABLED="false"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 5. Create Admin User

```bash
# Run the admin creation script
node scripts/create-admin.js
```

This creates an admin user with:
- Email: `admin@happyhour.com`
- Password: `admin123!`

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── deals/              # Deal management
│   │   ├── merchant/           # Merchant-specific APIs
│   │   ├── admin/              # Admin panel APIs
│   │   └── wallet/             # Wallet and redemptions
│   ├── (auth)/                 # Authentication pages
│   ├── admin/                  # Admin dashboard
│   ├── merchant/               # Merchant dashboard
│   ├── mobile/                 # Mobile-optimized pages
│   └── deal/                   # Deal detail pages
├── components/                  # Reusable components
│   ├── ui/                     # Base UI components
│   └── mobile/                 # Mobile-specific components
├── lib/                        # Utility libraries
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # Prisma client
│   ├── error-handler.ts        # Error handling utilities
│   └── logger.ts               # Logging utilities
├── prisma/                     # Database schema and migrations
│   └── schema.prisma           # Database schema
└── scripts/                    # Utility scripts
    └── create-admin.js         # Admin user creation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email

### Deals
- `GET /api/deals` - List deals with filtering
- `POST /api/deals/search` - Search deals
- `GET /api/deals/[id]` - Get deal details
- `POST /api/deals/[id]/claim` - Claim a deal

### User Management
- `GET /api/account/stats` - User account statistics
- `GET /api/account/deals` - User's claimed deals
- `GET /api/account/notifications` - User notifications
- `GET /api/favorites` - User's favorite deals
- `POST /api/favorite/toggle` - Toggle deal favorite status

### Wallet
- `GET /api/wallet/redemptions` - User's redemptions
- `POST /api/wallet/claim` - Claim a deal
- `POST /api/wallet/redeem` - Redeem a deal

### Merchant
- `GET /api/merchant/venues` - List merchant venues
- `POST /api/merchant/venues` - Create new venue
- `GET /api/merchant/deals` - List merchant deals
- `POST /api/merchant/deals` - Create new deal
- `POST /api/merchant/activate` - Activate deal
- `POST /api/merchant/deactivate` - Deactivate deal

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/merchants` - List all merchants
- `GET /api/admin/deals` - List all deals
- `GET /api/admin/applications` - List merchant applications

## 🔐 Authentication & Authorization

The application uses NextAuth.js with role-based access control:

### User Roles
- **USER**: Regular customers
- **MERCHANT**: Restaurant owners/managers
- **ADMIN**: Platform administrators
- **OWNER**: Platform owners

### Protected Routes
- `/admin/*` - Admin only
- `/merchant/*` - Merchant and Admin
- `/owner/*` - Owner and Admin

### Middleware
Route protection is handled by `middleware.ts` which automatically redirects unauthorized users to appropriate login pages.

## 🗄 Database Schema

### Key Models
- **User**: Customer accounts with authentication
- **Merchant**: Restaurant business accounts
- **Venue**: Restaurant locations
- **Deal**: Restaurant deals and offers
- **Redemption**: Deal claims and usage
- **Favorite**: User's favorite deals
- **NewsletterSubscriber**: Email newsletter subscribers

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement proper error handling with the error-handler utility
- Use the logger utility for consistent logging

### API Development
- Use standardized error responses
- Implement proper validation
- Add comprehensive logging
- Follow RESTful conventions

### Database
- Use Prisma migrations for schema changes
- Always validate data before database operations
- Use transactions for complex operations

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure DATABASE_URL is correctly set
   - Run `npx prisma generate` after schema changes

2. **Authentication Issues**
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain

3. **Build Issues**
   - Run `npm run type-check` to identify TypeScript errors
   - Ensure all environment variables are set

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation above

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🎯 Roadmap

- [ ] Email service integration
- [ ] Payment processing
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Multi-language support

---

Built with ❤️ for the restaurant industry