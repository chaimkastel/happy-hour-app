'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'USER' | 'MERCHANT' | 'ADMIN';
  redirectTo?: string;
  fallback?: ReactNode;
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo = '/login',
  fallback = <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
  </div>
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      // Not authenticated, redirect to login
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}` as any);
      return;
    }

    if (requiredRole && session.user?.role !== requiredRole) {
      // Wrong role, redirect based on role
      if (requiredRole === 'MERCHANT') {
        router.push('/merchant/signup?message=Please sign up as a merchant to access this page');
      } else if (requiredRole === 'ADMIN') {
        router.push('/admin-access?message=Admin access required');
      } else {
        router.push(redirectTo as any);
      }
      return;
    }
  }, [session, status, requiredRole, redirectTo, router]);

  if (status === 'loading') {
    return <>{fallback}</>;
  }

  if (!session) {
    return <>{fallback}</>;
  }

  if (requiredRole && session.user?.role !== requiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Server-side auth check utility
export async function getServerSideAuth(session: any, requiredRole?: string) {
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (requiredRole && session.user?.role !== requiredRole) {
    if (requiredRole === 'MERCHANT') {
      return {
        redirect: {
          destination: '/merchant/signup?message=Please sign up as a merchant to access this page',
          permanent: false,
        },
      };
    }
    
    if (requiredRole === 'ADMIN') {
      return {
        redirect: {
          destination: '/admin-access?message=Admin access required',
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}