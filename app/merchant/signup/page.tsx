'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User, Phone } from 'lucide-react';

export default function MerchantSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    phone: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/merchant/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('✅ Merchant account created successfully! You can now sign in.');
        setTimeout(() => {
          router.push('/merchant/login');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create merchant account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
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
              <span className="text-white font-bold text-sm">MERCHANT SIGNUP</span>
            </div>
            
            <h1 className="text-4xl font-black text-white mb-2">
              🍺 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Join</span> Our Network
            </h1>
            <p className="text-white/80">Start attracting customers with amazing deals</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-green-200 text-sm">{success}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="Your Restaurant Name"
                  />
                </div>
              </div>

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
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="(555) 123-4567"
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
                    placeholder="Create a password"
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Merchant Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Already have a merchant account?{' '}
                <button
                  onClick={() => router.push('/merchant/login')}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}