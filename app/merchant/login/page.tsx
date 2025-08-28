'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, ArrowLeft, Shield, Users, BarChart3, CheckCircle } from 'lucide-react';

export default function MerchantLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect if already logged in
  if (session) {
    // Check user role and redirect accordingly
    const userRole = (session.user as any)?.role;
    if (userRole === 'ADMIN') {
      router.push('/admin');
    } else if (userRole === 'MERCHANT') {
      router.push('/merchant/dashboard');
    } else {
      router.push('/');
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Get user info to determine redirect
        const userResponse = await fetch('/api/auth/session');
        const userData = await userResponse.json();
        const userRole = userData?.user?.role;
        
        if (userRole === 'ADMIN') {
          router.push('/admin');
        } else if (userRole === 'MERCHANT') {
          router.push('/merchant/dashboard');
        } else {
          router.push('/');
        }
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Professional Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">
              Merchant Portal
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Professional tools for restaurant owners to manage deals, track performance, and grow their business.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Deal Management</h3>
                <p className="text-white/70 text-sm">Create, schedule, and manage promotional deals with advanced targeting options.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Analytics Dashboard</h3>
                <p className="text-white/70 text-sm">Track performance metrics, customer engagement, and revenue insights.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Customer Insights</h3>
                <p className="text-white/70 text-sm">Understand your customers better with detailed analytics and behavior tracking.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Secure & Reliable</h3>
                <p className="text-white/70 text-sm">Bank-level security with 99.9% uptime guarantee for your business operations.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-white/70 text-sm">Active Merchants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">$2.3M</div>
              <div className="text-white/70 text-sm">Revenue Generated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Merchant Login</h1>
            <p className="text-slate-600">Access your business dashboard and manage your restaurant deals</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Business Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="your@business.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-3 font-medium">Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-700">demo@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Password:</span>
                <span className="font-mono text-slate-700">demo123</span>
              </div>
            </div>
            <button
              onClick={() => {
                setEmail('demo@example.com');
                setPassword('demo123');
              }}
              className="mt-3 w-full text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
            >
              Use Demo Credentials
            </button>
          </div>

          {/* Links */}
          <div className="mt-8 text-center space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">Don't have a merchant account?</p>
              <a
                href="/merchant/signup"
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors"
              >
                Start Your Free Trial
              </a>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600 mb-2">Looking for customer deals?</p>
              <a
                href="/login"
                className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                Customer Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
