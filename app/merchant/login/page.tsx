'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowLeft, Building2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function MerchantLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Check if user is a merchant
        const response = await fetch('/api/merchant/check');
        if (response.ok) {
          router.push('/merchant/dashboard');
        } else {
          setError('This account is not registered as a merchant');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Building2 className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-sm">MERCHANT LOGIN</span>
            </div>
            
            <h1 className="text-4xl font-black text-white mb-2">
              🍺 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Welcome</span> Back
            </h1>
            <p className="text-white/80">Sign in to manage your deals and venues</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-2xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
              <h3 className="text-white font-bold text-sm mb-2">Demo Credentials:</h3>
              <div className="text-white/70 text-sm space-y-1">
                <p><strong>Email:</strong> merchant@demo.com</p>
                <p><strong>Password:</strong> demo123</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Don't have a merchant account?{' '}
                <button
                  onClick={() => router.push('/merchant/signup')}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}