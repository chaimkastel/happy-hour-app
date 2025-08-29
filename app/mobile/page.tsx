'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Star, MapPin, Clock, Users, Shield, Award, Smartphone, CreditCard, CheckCircle, Sparkles, Flame, Gift, Target, Rocket, Crown, Diamond, Heart, Zap, TrendingUp, Globe, Timer } from 'lucide-react';
import MobileShell from '@/components/mobile/MobileShell';
import Image from 'next/image';

export default function MobileLandingPage() {
  const [currentSection, setCurrentSection] = useState(0);

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  return (
    <MobileShell
      forceMobile={true}
      headerProps={{
        showSearch: false,
        showLocation: false,
        title: 'Happy Hour'
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section with Background Image */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/images/hero-food-deals.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          
          {/* Content */}
          <div className="relative z-10 text-center px-6 py-12">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2 mb-6">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-white font-semibold text-sm">10,000+ Happy Customers</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Main Brand */}
            <div className="mb-8">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-4 leading-tight">
                Happy Hour
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-1 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"></div>
                <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
                <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
              </div>
              <p className="text-xl text-white/90 font-medium mb-2">
                Find Amazing Deals
              </p>
              <p className="text-lg text-white/80">
                Restaurants flip the switch when they're quiet. You get instant deals nearby.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSignIn}
                  className="flex-1 bg-white/20 backdrop-blur-xl border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignUp}
                  className="flex-1 bg-white/20 backdrop-blur-xl border border-white/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Trusted</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>Local</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="px-6 py-8 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Learn More
            </h2>
            <p className="text-gray-600">
              Everything you need to know about Happy Hour
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = '/mobile/how-it-works'}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="w-5 h-5" />
                <span className="font-semibold">How It Works</span>
              </div>
              <p className="text-sm text-blue-100">
                Step-by-step guide to getting started
              </p>
            </button>
            
            <button
              onClick={() => window.location.href = '/mobile/about'}
              className="p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5" />
                <span className="font-semibold">About Us</span>
              </div>
              <p className="text-sm text-green-100">
                Our mission and story
              </p>
            </button>
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => window.location.href = '/mobile/faq'}
              className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">FAQ</span>
              </div>
              <p className="text-sm text-orange-100">
                Common questions and answers
              </p>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-16 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Happy Hour?
            </h2>
            <p className="text-lg text-gray-600">
              Discover amazing deals from restaurants near you
            </p>
          </div>

          <div className="space-y-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Find Deals Near You
                </h3>
                <p className="text-gray-600">
                  Discover amazing restaurant deals within walking distance. No more searching through endless options.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Real-Time Availability
                </h3>
                <p className="text-gray-600">
                  See which deals are active right now. No more showing up to find the deal has ended.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Save Your Favorites
                </h3>
                <p className="text-gray-600">
                  Keep track of your favorite restaurants and never miss their best deals.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Instant Notifications
                </h3>
                <p className="text-gray-600">
                  Get notified when your favorite restaurants launch new deals or when deals are about to expire.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="px-6 py-16 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Sign Up Free
                </h3>
                <p className="text-gray-600">
                  Create your account in seconds. No credit card required.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Set Your Location
                </h3>
                <p className="text-gray-600">
                  Allow location access to find deals near you automatically.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Discover & Save
                </h3>
                <p className="text-gray-600">
                  Browse amazing deals, save your favorites, and enjoy great food.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-16 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-12">
              Join Thousands of Happy Customers
            </h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-blue-100">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Deals Redeemed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$2M+</div>
                <div className="text-blue-100">Saved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="px-6 py-16 bg-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Saving?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of people who are already saving money on great food
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-sm text-gray-500">
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-8 bg-gray-900 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">🍺</span>
            </div>
            <span className="text-white font-bold text-lg">Happy Hour</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Happy Hour. Find amazing deals near you.
          </p>
        </div>
      </div>
    </MobileShell>
  );
}