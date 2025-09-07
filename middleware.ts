import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin-access', req.url));
    }

    // Protect merchant routes
    if (pathname.startsWith('/merchant') && token?.role !== 'MERCHANT' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/merchant/login', req.url));
    }

    // Protect owner routes
    if (pathname.startsWith('/owner') && token?.role !== 'OWNER' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin-access', req.url));
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
          '/about',
          '/contact',
          '/faq',
          '/how-it-works',
          '/pricing',
          '/privacy',
          '/terms',
          '/cookies',
          '/login',
          '/signup',
          '/merchant/login',
          '/merchant/signup',
          '/admin-access',
          '/reset-password',
          '/verify-email',
          '/api/auth',
          '/api/deals',
          '/api/newsletter',
          '/api/partner',
          '/api/merchant/signup',
          '/api/auth/signup',
          '/api/auth/forgot-password',
          '/api/auth/reset-password',
          '/api/auth/verify-email',
          '/api/auth/resend-verification',
        ];

        // Check if the route is public
        if (publicRoutes.some(route => pathname.startsWith(route))) {
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};