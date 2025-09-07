'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function AdminAccessPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if user is already logged in and has admin role
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
        callbackUrl: '/admin'
      });

      if (result?.ok) {
        // Check if user has admin role
        const session = await getSession();
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      console.error('Admin access error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gray-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
            <p className="text-white/80">Restricted area - Authorized personnel only</p>
          </div>

          {/* Security Warning */}
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-400 font-semibold text-sm mb-1">Security Notice</h3>
                <p className="text-white/70 text-xs">
                  This area is restricted to authorized administrators only. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-white/60 transition-all duration-300"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-white/60 transition-all duration-300"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Verifying Access...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Access Admin Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-white/60 text-xs">
              Unauthorized access is prohibited and may result in legal action.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 text-white/80 hover:text-white text-sm transition-colors"
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}