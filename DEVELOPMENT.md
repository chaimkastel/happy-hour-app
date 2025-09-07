# Development Guide - Happy Hour App

This guide covers development setup, coding standards, and best practices for the Happy Hour App.

## 🛠 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- VS Code (recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/chaimkastel/happy-hour-app.git
cd happy-hour-app

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Create admin user
node scripts/create-admin.js

# Start development server
npm run dev
```

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication
│   │   ├── deals/              # Deal management
│   │   ├── merchant/           # Merchant APIs
│   │   ├── admin/              # Admin APIs
│   │   └── wallet/             # Wallet APIs
│   ├── (auth)/                 # Auth pages
│   ├── admin/                  # Admin dashboard
│   ├── merchant/               # Merchant dashboard
│   ├── mobile/                 # Mobile pages
│   └── deal/                   # Deal pages
├── components/                  # Reusable components
│   ├── ui/                     # Base UI components
│   └── mobile/                 # Mobile components
├── lib/                        # Utilities
│   ├── auth.ts                 # NextAuth config
│   ├── db.ts                   # Prisma client
│   ├── error-handler.ts        # Error handling
│   └── logger.ts               # Logging
├── prisma/                     # Database
│   └── schema.prisma           # Schema
└── scripts/                    # Utility scripts
```

## 🎨 Coding Standards

### TypeScript

```typescript
// Use explicit types
interface User {
  id: string;
  email: string;
  role: 'USER' | 'MERCHANT' | 'ADMIN';
}

// Use type guards
function isAdmin(user: User): user is AdminUser {
  return user.role === 'ADMIN';
}

// Use enums for constants
enum UserRole {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN'
}
```

### React Components

```typescript
// Use proper component structure
interface ComponentProps {
  title: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export default function Component({ 
  title, 
  onAction, 
  children 
}: ComponentProps) {
  const [state, setState] = useState<string>('');

  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### API Routes

```typescript
// Use standardized error handling
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/error-handler';
import { log } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    log.apiRequest('POST', '/api/endpoint');
    
    // Validation
    if (!isValid) {
      return createErrorResponse(
        'Invalid input',
        400,
        'VALIDATION_ERROR'
      );
    }

    // Business logic
    const result = await processRequest();

    log.businessEvent('action_completed', { resultId: result.id });
    
    return createSuccessResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
```

## 🗄 Database Development

### Schema Changes

```prisma
// Always use migrations for schema changes
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  merchant  Merchant?
  favorites Favorite[]
}
```

### Running Migrations

```bash
# Create migration
npx prisma migrate dev --name add_user_fields

# Reset database (development only)
npx prisma migrate reset

# Generate client after schema changes
npx prisma generate
```

### Database Seeding

```typescript
// Use seed scripts for development data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // Create test data
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      role: 'USER'
    }
  });
}

seed().catch(console.error);
```

## 🔐 Authentication Development

### NextAuth Configuration

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Authentication logic
      }
    })
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.role = token.role;
      return session;
    }
  }
};
```

### Protected Routes

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin-access', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
```

## 🎨 UI Development

### Component Structure

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    glass: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
```

### Styling Guidelines

```css
/* Use Tailwind CSS classes */
<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
    Title
  </h2>
  <p className="text-gray-600 dark:text-gray-400">
    Description
  </p>
</div>

/* Use CSS modules for complex styles */
/* components/Component.module.css */
.container {
  @apply flex items-center justify-center min-h-screen;
}

/* Use CSS variables for theming */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
}
```

## 🧪 Testing

### Unit Tests

```typescript
// __tests__/utils.test.ts
import { validateEmail } from '@/lib/validation';

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

### API Tests

```typescript
// __tests__/api/auth.test.ts
import { POST } from '@/app/api/auth/signup/route';

describe('/api/auth/signup', () => {
  it('should create user with valid data', async () => {
    const request = new Request('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

## 📝 Logging & Error Handling

### Error Handling

```typescript
// Use standardized error handling
import { AppError, ERROR_CODES, HTTP_STATUS } from '@/lib/error-handler';

try {
  // Business logic
} catch (error) {
  if (error instanceof AppError) {
    return createErrorResponse(
      error.message,
      error.statusCode,
      error.code
    );
  }
  
  // Log unexpected errors
  log.error('Unexpected error', error);
  return createErrorResponse(
    'Internal server error',
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}
```

### Logging

```typescript
// Use structured logging
import { log } from '@/lib/logger';

// API requests
log.apiRequest('POST', '/api/deals', userId);

// Business events
log.businessEvent('deal_claimed', { 
  dealId, 
  userId, 
  venueId 
});

// Errors
log.error('Database connection failed', error, { 
  database: 'postgresql' 
});
```

## 🚀 Performance Optimization

### Next.js Optimization

```typescript
// Use dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});

// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);
```

### Database Optimization

```typescript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    role: true
  }
});

// Use include for relations
const deals = await prisma.deal.findMany({
  include: {
    venue: {
      select: {
        name: true,
        address: true
      }
    }
  }
});

// Use pagination
const deals = await prisma.deal.findMany({
  skip: offset,
  take: limit,
  orderBy: { createdAt: 'desc' }
});
```

## 🔧 Development Tools

### VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

### VS Code Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

## 🐛 Debugging

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Debug specific modules
DEBUG=next-auth npm run dev
DEBUG=prisma npm run dev
```

### Common Issues

1. **TypeScript Errors**
   ```bash
   npm run type-check
   ```

2. **Prisma Issues**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Build Issues**
   ```bash
   npm run build
   npm run lint
   ```

## 📋 Development Checklist

### Before Committing
- [ ] Code follows TypeScript standards
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Logging is added where appropriate
- [ ] Tests pass
- [ ] No console.log statements
- [ ] Code is formatted with Prettier

### Before Creating PR
- [ ] Feature is complete
- [ ] Tests are written
- [ ] Documentation is updated
- [ ] No breaking changes
- [ ] Performance is acceptable
- [ ] Security considerations addressed

## 🤝 Contributing

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Commit Messages

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

---

For more information, refer to the main README.md or create an issue in the repository.
