import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication
const protectedPaths = [
  '/merchant',
  '/account',
  '/favorites',
  '/wallet',
  '/api/merchant'
];

// Add paths that should redirect to login if not authenticated
const authRedirectPaths = [
  '/merchant',
  '/account',
  '/favorites',
  '/wallet'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const shouldRedirectToLogin = authRedirectPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    // For API routes, return 401 if not authenticated
    if (pathname.startsWith('/api/')) {
      // Check for session token (this is a simplified check)
      const token = request.cookies.get('next-auth.session-token') || 
                   request.cookies.get('__Secure-next-auth.session-token');
      
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    // For page routes, redirect to login if not authenticated
    if (shouldRedirectToLogin) {
      const token = request.cookies.get('next-auth.session-token') || 
                   request.cookies.get('__Secure-next-auth.session-token');
      
      if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
