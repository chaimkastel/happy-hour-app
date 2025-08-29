# Happy Hour - Development Guide

## 🏗️ Folder Structure & Breakpoint Policy

### Component Organization
```
components/
├── mobile/          # Mobile-only components (visible < md)
├── desktop/         # Desktop-only components (visible >= md)  
├── shared/          # Shared components (both breakpoints)
└── ui/              # Base UI components (shared)
```

### App Router Organization
```
app/
├── (web)/           # Desktop-only pages (hidden < md)
├── mobile/          # Mobile-only pages (hidden >= md)
├── api/             # API routes (shared)
└── [shared pages]   # Pages that work on both breakpoints
```

## 🎨 Brand Rules (Non-Negotiable)

### Emoji Policy
- **ONLY** the beer mug emoji `🍺` is allowed in the UI
- **ONLY** appears BEFORE the brand words in logos: "🍺 Happy Hour"
- **ONLY** in header and footer logos
- **MUST** be HTML text, never rasterized into images
- **NO** other emojis anywhere else in the app

### Breakpoint Separation
- **Mobile** (`< md`): Use `md:hidden` class
- **Desktop** (`>= md`): Use `hidden md:block` class
- **Shared**: No breakpoint classes needed

## 🔧 Development Workflow

### TypeScript
- `strict` mode enabled
- CI fails on TS errors
- All components must be properly typed

### Testing
- **Playwright**: E2E tests for critical paths
- **Vitest**: Unit tests for utilities
- **Lighthouse**: Performance monitoring

### Security
- HTTPS redirects enforced
- Security headers configured
- No mixed content warnings

## 📱 Mobile-First Development

### Required Mobile Components
- `MobileHeader`: Compact header with logo
- `MobileBottomNav`: Sticky bottom navigation
- `FiltersBottomSheet`: Filter interface
- `AddressAutocomplete`: Location input

### Mobile UX Standards
- 44px minimum tap targets
- Safe area padding
- Thumb-reachable controls
- Fast loading with skeletons

## 🖥️ Desktop Development

### Required Desktop Components
- Sticky translucent header
- Left filter sidebar
- 3-4 column deal grid
- Hover states and animations

### Desktop UX Standards
- Hover effects on interactive elements
- Proper focus management
- Keyboard navigation
- Responsive grid layouts

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Lighthouse scores ≥ 90
- [ ] No console errors
- [ ] HTTPS redirects working
- [ ] Brand emoji rule enforced

### Environment Variables
```bash
# Address Autocomplete
GOOGLE_PLACES_API_KEY=your_key_here
MAPBOX_ACCESS_TOKEN=your_token_here

# Database
DATABASE_URL=your_db_url

# Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://orderhappyhour.com
```

## 🐛 Bug Reporting

### Bug Ledger Format
```markdown
## [SEVERITY] [BREAKPOINT] Issue Title
**File:** `path/to/file.tsx:line`
**Description:** What's broken
**Steps:** How to reproduce
**Expected:** What should happen
**Actual:** What actually happens
```

### Severity Levels
- **Blocker**: App unusable
- **Major**: Core feature broken
- **Minor**: Polish/UX issue

## 📊 Performance Targets

### Lighthouse Scores
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Core Web Vitals
- **LCP**: ≤ 2.5s
- **CLS**: < 0.1
- **TTI**: ≤ 3.5s

## 🔒 Security Checklist

- [ ] HTTPS redirects (308)
- [ ] HSTS headers
- [ ] CSP headers
- [ ] No mixed content
- [ ] Input validation
- [ ] Rate limiting
- [ ] Secure cookies

## 📝 Code Standards

### React Components
- Use `'use client'` for interactive components
- Proper TypeScript interfaces
- Accessibility attributes
- Error boundaries

### Styling
- Tailwind CSS classes
- Mobile-first responsive design
- Consistent spacing scale
- Dark mode support

### API Routes
- Proper error handling
- Input validation with Zod
- Rate limiting
- CORS configuration
