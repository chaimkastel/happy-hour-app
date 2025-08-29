'use client';

import React, { useState } from 'react';
import { ArrowLeft, Users, Target, Award, Heart, Globe, Star, CheckCircle, ArrowRight, Menu, X, Clock, MapPin, Smartphone, CreditCard, Shield, Zap } from 'lucide-react';

export default function HowItWorksPage() {
  const [showMenu, setShowMenu] = useState(false);
  
  const handleBack = () => {
    window.history.back();
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10">
        <div className="px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg md:text-xl">🍺</span>
              </div>
              <span className="text-white font-bold text-lg md:text-xl">How It Works</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => window.location.href = '/explore'}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs md:text-sm font-semibold rounded-lg md:rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                Explore
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs md:text-sm font-semibold rounded-lg md:rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = '/signup'}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs md:text-sm font-bold rounded-lg md:rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                {showMenu ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Menu className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uber Eats-inspired Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-16 md:top-20 left-3 right-3 md:left-4 md:right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-4">
            {/* Top Section - Sign Up & Log In */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => window.location.href = '/signup'}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Sign up
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-white text-black border border-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Log in
              </button>
            </div>

            {/* Middle Section - Menu Links */}
            <div className="space-y-1 mb-6">
              <button
                onClick={() => {
                  window.location.href = '/favorites';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                Favorites
              </button>
              <button
                onClick={() => {
                  window.location.href = '/deals';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                All Deals
              </button>
              <button
                onClick={() => {
                  window.location.href = '/about';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  window.location.href = '/faq';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                FAQ
              </button>
              <button
                onClick={() => {
                  window.location.href = '/contact';
                  setShowMenu(false);
                }}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                Contact Us
              </button>
            </div>

            {/* Bottom Section - App Promotion */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">🍺</span>
                </div>
                <span className="text-gray-700 font-medium">There's more to love in the app.</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
                  iPhone
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300">
                  Android
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative px-6 py-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-3xl">🍺</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            How Happy Hour Works
          </h1>
          <p className="text-lg text-white/80">
            Discover amazing deals in just a few simple steps
          </p>
        </div>
      </div>

      {/* How It Works Steps */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Find Your Location</h3>
                <p className="text-white/80 leading-relaxed">
                  Enter your address or allow location access to discover restaurants near you. 
                  We'll show you all available deals within your area.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">Location-based deals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Browse Amazing Deals</h3>
                <p className="text-white/80 leading-relaxed">
                  Explore real-time deals from restaurants when they're quiet. 
                  Save up to 70% off on food, drinks, and more during off-peak hours.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Real-time availability</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Claim Your Deal</h3>
                <p className="text-white/80 leading-relaxed">
                  Tap to claim your deal and get a unique code. Show this code to the restaurant 
                  when you arrive to enjoy your discounted meal.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Smartphone className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 text-sm font-medium">Instant claim</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Enjoy & Save</h3>
                <p className="text-white/80 leading-relaxed">
                  Visit the restaurant, show your code, and enjoy your meal at a fraction of the cost. 
                  Leave a review to help other food lovers discover great deals.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 text-sm font-medium">Share your experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose Happy Hour?</h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Instant Savings</h3>
              <p className="text-white/70 text-sm">Get deals immediately when restaurants are quiet</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Secure & Safe</h3>
              <p className="text-white/70 text-sm">Your data and payments are always protected</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Local Focus</h3>
              <p className="text-white/70 text-sm">Supporting local restaurants in your community</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Win-Win</h3>
              <p className="text-white/70 text-sm">Restaurants fill seats, you save money</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join thousands of happy customers who are already saving money on amazing food.
          </p>
          <button
            onClick={handleGetStarted}
            className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 flex items-center gap-3 mx-auto"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
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
  );
}
