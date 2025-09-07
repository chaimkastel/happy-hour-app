'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import SkipToMain from '@/components/SkipToMain';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Your email has been verified successfully!');
      } else {
        if (data.error?.includes('expired')) {
          setStatus('expired');
          setMessage('This verification link has expired. Please request a new one.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email. Please try again.');
        }
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const resendVerification = async () => {
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('A new verification email has been sent. Please check your inbox.');
      } else {
        setMessage(data.error || 'Failed to resend verification email.');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <SkipToMain />
        <div className="max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying your email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SkipToMain />
      
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                status === 'success' ? 'bg-green-100' : 
                status === 'expired' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {status === 'success' ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : status === 'expired' ? (
                  <Mail className="w-8 h-8 text-yellow-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {status === 'success' ? 'Email Verified!' : 
                 status === 'expired' ? 'Link Expired' : 'Verification Failed'}
              </h1>
              
              <p className="text-gray-600 mb-8">
                {message}
              </p>

              {status === 'success' && (
                <div className="space-y-4">
                  <button
                    onClick={() => router.push('/login?message=Email verified successfully! Please sign in to continue.')}
                    className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                  >
                    <span>Continue to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {status === 'expired' && (
                <div className="space-y-4">
                  <button
                    onClick={resendVerification}
                    disabled={isResending}
                    className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isResending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    <span>{isResending ? 'Sending...' : 'Resend Verification Email'}</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-4">
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Image/Info */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80)'
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                {status === 'success' ? 'Welcome to Happy Hour!' : 'Email Verification'}
              </h2>
              <p className="text-lg mb-6">
                {status === 'success' 
                  ? 'Your account is now verified and ready to use'
                  : 'Verify your email to access all features'
                }
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Secure account verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Access to exclusive deals</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Personalized recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
