# Happy Hour - Restaurant Deals Platform

A comprehensive Next.js web application that connects customers with local restaurants offering real-time deals and discounts. Built with modern technologies and designed for scalability.

## 🚀 Live Demo

**Production URL**: https://www.orderhappyhour.com

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [User Roles & Authentication](#-user-roles--authentication)
- [Admin Dashboard](#-admin-dashboard)
- [Deployment](#-deployment)
- [Development Workflow](#-development-workflow)
- [Recent Updates](#-recent-updates)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### Customer Features
- **Smart Search**: AI-powered search with live suggestions for deals, restaurants, and cuisines
- **Interactive Map**: Real-time deal locations with clustering and filtering
- **Deal Discovery**: Browse deals by category, distance, and discount percentage
- **User Authentication**: Secure login/signup with role-based access
- **Responsive Design**: Mobile-first design that works on all devices

### Merchant Features
- **Professional Dashboard**: Comprehensive business management interface
- **Venue Management**: Create and manage multiple restaurant locations
- **Deal Creation**: Advanced deal creation with scheduling and targeting options
- **Analytics**: Performance metrics and customer insights
- **Professional Login**: Dedicated merchant portal with enhanced security

### Admin Features
- **Safety Controls**: Emergency website shutdown, maintenance mode, security levels
- **User Management**: Manage customers, merchants, and user permissions
- **Merchant Approval**: Review and approve merchant signup applications
- **System Analytics**: Real-time performance metrics and monitoring
- **Feature Toggles**: Enable/disable platform features remotely

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library
- **NextAuth.js** - Authentication system

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **SQLite** - Local development database
- **PostgreSQL** - Production database (Vercel)

### External Services
- **Vercel** - Hosting and deployment
- **OpenStreetMap Nominatim** - Geocoding service
- **GitHub** - Version control and CI/CD

## 📁 Project Structure

```
happy-hour-ultra-fixed/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard
│   │   └── page.tsx             # Main admin interface
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── deals/               # Deal management
│   │   └── merchant/            # Merchant operations
│   ├── login/                   # Customer login
│   ├── merchant/                # Merchant portal
│   │   ├── login/               # Professional merchant login
│   │   ├── signup/              # Merchant registration
│   │   ├── dashboard/           # Merchant dashboard
│   │   ├── venues/              # Venue management
│   │   └── deals/               # Deal management
│   ├── signup/                  # Customer registration
│   ├── page.tsx                 # Homepage with smart search
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── AddressAutocomplete.tsx  # Smart address input
│   ├── DealCard.tsx            # Deal display component
│   ├── MapWithClusters.tsx     # Interactive map
│   ├── SmartSearch.tsx         # AI-powered search
│   └── SortFilterBar.tsx       # Deal filtering
├── lib/                         # Utility libraries
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # Database connection
│   └── geocoding.ts            # Address geocoding service
├── prisma/                      # Database schema
│   └── schema.prisma           # Database models
├── public/                      # Static assets
└── README.md                   # This file
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/chaimkastel/happy-hour-app.git
cd happy-hour-ultra-fixed
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: Redis for production
REDIS_URL="redis://localhost:6379"
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Deals
- `GET /api/deals/search` - Search deals with filters
- `GET /api/deals/[id]` - Get specific deal
- `POST /api/deals` - Create new deal (merchant only)

### Merchants
- `GET /api/merchant/venues` - Get merchant venues
- `POST /api/merchant/venues` - Create new venue
- `GET /api/merchant/deals` - Get merchant deals
- `POST /api/merchant/deals` - Create new deal
- `POST /api/merchant/signup` - Merchant registration

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/merchants` - Get all merchants
- `GET /api/admin/applications` - Get pending applications
- `POST /api/admin/approve` - Approve merchant application

## 👥 User Roles & Authentication

### Customer (USER)
- Browse and search deals
- View restaurant information
- Create account and manage profile
- Access: `/`, `/login`, `/signup`

### Merchant (MERCHANT)
- Manage business profile and venues
- Create and manage deals
- View analytics and performance
- Access: `/merchant/dashboard`, `/merchant/venues`, `/merchant/deals`

### Admin (ADMIN)
- Full platform management
- User and merchant oversight
- Safety controls and system monitoring
- Access: `/admin`

### Demo Credentials
```
Email: demo@example.com
Password: demo123
```

### Admin Access
**Admin Login URL**: https://www.orderhappyhour.com/admin-access

**Database**: Connected to Supabase PostgreSQL

**Admin Credentials**:
```
Username: chaimkastel
Password: CHAIMrox11!
```

## 🛡 Admin Dashboard

The admin dashboard provides comprehensive platform management:

### Safety Controls
- **Website Status**: Online, Maintenance, Emergency modes
- **Security Levels**: Normal, High, Maximum security
- **Feature Toggles**: Enable/disable user registration, merchant onboarding, deal creation
- **System Alerts**: Real-time notifications and audit logs

### User Management
- View and manage all users
- Approve/reject merchant applications
- Monitor user activity and performance
- Bulk operations and user status management

### Analytics
- Real-time system metrics
- User engagement statistics
- Performance monitoring
- Revenue tracking

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Set environment variables in Vercel dashboard**
3. **Deploy**
```bash
vercel --prod
```

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

## 🔄 Development Workflow

### Making Changes

1. **Create a feature branch**
```bash
git checkout -b feature/new-feature
```

2. **Make your changes and test locally**
```bash
npm run dev
```

3. **Commit and push**
```bash
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

4. **Deploy to production**
```bash
git push origin main
vercel --prod
```

### Code Style
- Use TypeScript for all new files
- Follow existing component patterns
- Use Tailwind CSS for styling
- Add proper error handling
- Include loading states

## 📝 Recent Updates

### Latest Features (Current Session)
- ✅ **Smart Search**: AI-powered search with live suggestions
- ✅ **Professional Merchant Login**: Enhanced merchant portal
- ✅ **Admin Safety Controls**: Emergency shutdown and maintenance mode
- ✅ **Merchant Approval System**: Review and approve applications
- ✅ **Address Autocomplete**: Smart address input throughout the app
- ✅ **Fixed Venue/Deal Creation**: Resolved JavaScript errors
- ✅ **Enhanced Login System**: Separate customer and merchant flows

### Previous Features
- ✅ Interactive map with deal clustering
- ✅ Comprehensive deal management
- ✅ User authentication and role management
- ✅ Responsive design and mobile optimization
- ✅ Real-time geocoding integration

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
```bash
npx prisma generate
npx prisma db push
```

2. **Authentication Issues**
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and localStorage

3. **Build Errors**
```bash
npm run build
# Check for TypeScript errors
npx tsc --noEmit
```

4. **Deployment Issues**
```bash
vercel logs
vercel env ls
```

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

### Performance Issues
- Check Vercel function logs
- Monitor database query performance
- Use browser dev tools for frontend issues

## 📞 Support

For issues and questions:
1. Check this README first
2. Review the troubleshooting section
3. Check Vercel deployment logs
4. Create an issue in the GitHub repository

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app integration
- [ ] Payment processing
- [ ] Multi-language support
- [ ] Advanced deal targeting
- [ ] Social media integration

---

**Last Updated**: January 2024  
**Version**: 2.0.0  
**Status**: Production Ready ✅