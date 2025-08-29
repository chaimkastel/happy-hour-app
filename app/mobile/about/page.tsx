'use client';

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
          </div>
        </div>
      </div>
        {/* Hero Section */}
        <div className="relative px-6 py-12 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-3xl">🍺</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              About Happy Hour
            </h1>
            <p className="text-lg text-white/80">
              We're on a mission to help you discover amazing food deals while supporting local restaurants.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="px-6 py-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We believe that great food should be accessible to everyone. Happy Hour connects food lovers with local restaurants offering amazing deals, creating a win-win situation for both customers and businesses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">For Customers</h3>
              <p className="text-sm text-gray-600">Save money on great food</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">For Restaurants</h3>
              <p className="text-sm text-gray-600">Fill seats during quiet times</p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="px-6 py-12 bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Happy Hour was born from a simple observation: restaurants often have empty tables during off-peak hours, while customers are always looking for great deals on quality food.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  The Problem
                </h3>
                <p className="text-gray-600">
                  Restaurants struggle with empty tables during slow periods, while customers miss out on great food because they don't know about available deals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  The Solution
                </h3>
                <p className="text-gray-600">
                  We created a platform that connects restaurants with customers in real-time, showing available deals and helping fill empty tables with happy customers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  The Result
                </h3>
                <p className="text-gray-600">
                  Thousands of happy customers saving money on great food, and hundreds of restaurants filling their tables during previously quiet hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="px-6 py-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Customer First
                </h3>
                <p className="text-gray-600">
                  Every decision we make is with our customers' best interests in mind. We're here to help you save money and discover amazing food.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Trust & Transparency
                </h3>
                <p className="text-gray-600">
                  We believe in honest, transparent relationships with both our customers and restaurant partners. No hidden fees, no surprises.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Supporting Local
                </h3>
                <p className="text-gray-600">
                  We're passionate about supporting local restaurants and helping them thrive. When they succeed, our communities succeed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  We're constantly improving our platform to make it easier for you to find great deals and for restaurants to reach new customers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="px-6 py-12 bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600">
              The passionate people behind Happy Hour
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">🍺</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                The Happy Hour Team
              </h3>
              <p className="text-gray-600 text-sm">
                A diverse group of food lovers, tech enthusiasts, and local business supporters working together to make great food more accessible.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-12 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-blue-100 mb-6">
              Be part of the movement that's making great food more accessible to everyone.
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 mx-auto"
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
    </div>
  );
}
