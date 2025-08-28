import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Force HTTPS redirect in production
  if (process.env.NODE_ENV === 'production') {
    const hostname = request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    
    // Only redirect if the request is HTTP and not already HTTPS
    if (protocol === 'http' && !hostname.includes('localhost')) {
      const httpsUrl = `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`;
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Force HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Prevent mixed content
  response.headers.set('Content-Security-Policy', "upgrade-insecure-requests");
  
  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};