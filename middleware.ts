import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import { rateLimit, rateLimitConfigs, createRateLimitResponse } from '@/lib/rate-limit';

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Rate limiting for API routes
    if (pathname.startsWith('/api/')) {
      let limiter;
      
      if (pathname.startsWith('/api/auth/')) {
        limiter = rateLimit(rateLimitConfigs.auth);
      } else if (pathname.startsWith('/api/deals/search')) {
        limiter = rateLimit(rateLimitConfigs.search);
      } else {
        limiter = rateLimit(rateLimitConfigs.api);
      }
      
      const rateLimitResult = await limiter(req);
      
      if (!rateLimitResult.success) {
        return createRateLimitResponse(
          rateLimitResult.remaining || 0,
          rateLimitResult.resetTime || Date.now()
        );
      }
    }

    // Admin routes
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }

    // Merchant routes
    if (pathname.startsWith('/merchant') && 
        !pathname.startsWith('/merchant/login') && 
        !pathname.startsWith('/merchant/signup')) {
      if (token?.role !== 'MERCHANT' && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/merchant/login', req.url));
      }
    }

    // Protected user routes (require authentication)
    if (pathname.startsWith('/account') || 
        pathname.startsWith('/wallet') || 
        pathname.startsWith('/favorites')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/explore',
          '/deal',
          '/claim-success',
          '/partner',
          '/how-it-works',
          '/about',
          '/privacy',
          '/contact',
          '/login',
          '/signup',
          '/verify-email',
          '/merchant/login',
          '/merchant/signup',
          '/admin/login',
        ];

        // Check if route is public
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route + '/')
        );

        if (isPublicRoute) {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/merchant/:path*',
    '/account/:path*',
    '/wallet/:path*',
    '/favorites/:path*',
    '/api/:path*',
  ],
};