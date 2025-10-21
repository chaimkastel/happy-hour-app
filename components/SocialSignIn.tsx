'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface SocialSignInProps {
  className?: string;
  onError?: (error: string) => void;
}

export default function SocialSignIn({ className = '', onError }: SocialSignInProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(provider);
    
    try {
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        onError?.(`Failed to sign in with ${provider}. Please try again.`);
      } else if (result?.ok) {
        // Handle successful OAuth sign-in with role-based redirect
        const session = await getSession();
        
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else if (session?.user?.role === 'MERCHANT') {
          router.push('/merchant/dashboard');
        } else if (session?.user?.role === 'OWNER') {
          router.push('/owner');
        } else {
          // Default redirect to explore page for regular users
          router.push('/explore');
        }
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      onError?.(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(null);
    }
  };

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      enabled: typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      bgColor: 'bg-black hover:bg-gray-900',
      textColor: 'text-white',
      borderColor: 'border-gray-900',
      enabled: typeof window !== 'undefined' && process.env.NEXT_PUBLIC_APPLE_ID
    }
  ].filter(provider => provider.enabled);

  // Don't render if no OAuth providers are available
  if (socialProviders.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        {socialProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleSocialSignIn(provider.id)}
            disabled={isLoading === provider.id}
            className={`
              w-full flex items-center justify-center space-x-3 px-4 py-3 border rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
              ${provider.bgColor} ${provider.textColor} ${provider.borderColor}
            `}
            aria-label={`Continue with ${provider.name}`}
          >
            {isLoading === provider.id ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              provider.icon
            )}
            <span>
              {isLoading === provider.id ? 'Signing in...' : `Continue with ${provider.name}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
