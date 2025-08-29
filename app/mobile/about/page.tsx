'use client';

import React from 'react';
import { ArrowLeft, Star, Users, MapPin, Clock, Shield, Award, Globe, Heart, Zap, TrendingUp, Gift, Target, Rocket, Crown, Diamond } from 'lucide-react';

export default function MobileAboutPage() {
  const handleBack = () => {
    window.history.back();
  };

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">🍺</span>
              </div>
              <span className="text-white font-bold text-lg">About Happy Hour</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = '/mobile/explore'}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Explore
              </button>
              <button
                onClick={() => window.location.href = '/mobile/favorites'}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Favorites
              </button>
              <button
                onClick={() => window.location.href = '/mobile/login'}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = '/mobile/signup'}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative px-6 py-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-3xl">🍺</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-4">
            About Happy Hour
          </h1>
          <p className="text-lg text-white/80">
            We're revolutionizing how restaurants and diners connect during quiet hours
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-white/80 leading-relaxed">
            To create a win-win ecosystem where restaurants can fill empty tables during quiet hours 
            and diners can enjoy amazing food at incredible prices. We believe that great food 
            should be accessible to everyone, and restaurants should thrive even during slow periods.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Our Values</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Customer First</h3>
              <p className="text-white/70">
                Every decision we make is guided by what's best for our users. We're committed to 
                providing exceptional value and service.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Trust & Transparency</h3>
              <p className="text-white/70">
                We believe in honest pricing, clear communication, and building lasting relationships 
                with both restaurants and diners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
              <p className="text-white/70">
                We're constantly improving our platform to make the dining experience better for 
                everyone involved.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Community</h3>
              <p className="text-white/70">
                We're building a community where local restaurants and food lovers can thrive together, 
                supporting each other's success.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Our Team</h2>
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-16 h-16 text-black" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-4">Passionate Food Lovers</h3>
          <p className="text-white/80 leading-relaxed mb-6">
            Our team is made up of food enthusiasts, tech innovators, and restaurant industry experts 
            who are passionate about creating the perfect dining experience for everyone.
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-white/70 text-sm">Team Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">15</div>
              <div className="text-white/70 text-sm">Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">By the Numbers</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-white/70 text-sm">Happy Customers</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-white/70 text-sm">Partner Restaurants</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">50K+</div>
            <div className="text-white/70 text-sm">Deals Redeemed</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">$2M+</div>
            <div className="text-white/70 text-sm">Total Savings</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-12 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-blue-100 mb-6">
            Be part of the revolution that's changing how we dine out
          </p>
          <button
            onClick={handleGetStarted}
            className="w-full bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            Get Started Free
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