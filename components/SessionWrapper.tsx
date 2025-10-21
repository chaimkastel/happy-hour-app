'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface SessionWrapperProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function SessionWrapper({ children, redirectTo = '/login' }: SessionWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!session?.user) {
    router.push(redirectTo as any);
    return null;
  }

  return <>{children}</>;
}
