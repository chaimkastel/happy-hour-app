'use client';

import { ArrowLeft, ArrowRight, Star, MapPin, Clock, Users, Shield, Award, Smartphone, CreditCard, CheckCircle, Sparkles, Flame, Gift, Target, Rocket, Crown, Diamond, Heart, Zap, TrendingUp, Globe, Timer, Search, Bell, Bookmark } from 'lucide-react';

export default function MobileHowItWorksPage() {
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
              <span className="text-white font-bold text-lg">How It Works</span>
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
              How It Works
            </h1>
            <p className="text-lg text-white/80">
              Getting started with Happy Hour is simple. Here's everything you need to know.
            </p>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="px-6 py-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Get Started in 3 Steps
            </h2>
            <p className="text-gray-600">
              From signup to your first deal in minutes
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sign Up Free
                </h3>
                <p className="text-gray-600 mb-4">
                  Create your account in seconds. No credit card required, no hidden fees.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Set Your Location
                </h3>
                <p className="text-gray-600 mb-4">
                  Allow location access to automatically find deals near you, or enter your location manually.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <MapPin className="w-4 h-4" />
                  <span>Automatic location detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Shield className="w-4 h-4" />
                  <span>Privacy protected</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Globe className="w-4 h-4" />
                  <span>Works anywhere</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Discover & Save
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse amazing deals, save your favorites, and enjoy great food at unbeatable prices.
                </p>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Search className="w-4 h-4" />
                  <span>Browse nearby deals</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Heart className="w-4 h-4" />
                  <span>Save favorites</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Gift className="w-4 h-4" />
                  <span>Redeem deals instantly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Deep Dive */}
        <div className="px-6 py-12 bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-gray-600">
              Everything you need to find and enjoy great deals
            </p>
          </div>

          <div className="space-y-6">
            {/* Real-time Deals */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Real-Time Deal Updates
                  </h3>
                  <p className="text-gray-600 mb-3">
                    See which deals are active right now. No more showing up to find the deal has ended.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <Timer className="w-4 h-4" />
                    <span>Live availability status</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Notifications */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Smart Notifications
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Get notified when your favorite restaurants launch new deals or when deals are about to expire.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <Zap className="w-4 h-4" />
                    <span>Personalized alerts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites System */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Save Your Favorites
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Keep track of your favorite restaurants and never miss their best deals.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-pink-600">
                    <Heart className="w-4 h-4" />
                    <span>Personalized recommendations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Easy Redemption */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Easy Redemption
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Show your phone at the restaurant to redeem deals instantly. No complicated codes or vouchers.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Smartphone className="w-4 h-4" />
                    <span>Show and save</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="px-6 py-12 bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pro Tips
            </h2>
            <p className="text-gray-600">
              Get the most out of Happy Hour
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Check Often</h4>
                <p className="text-sm text-gray-600">Deals change throughout the day. Check back regularly for new offers.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">⭐</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Save Favorites</h4>
                <p className="text-sm text-gray-600">Save your favorite restaurants to get notified about their deals first.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">🚀</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Act Fast</h4>
                <p className="text-sm text-gray-600">Popular deals can fill up quickly. Book your table when you see a great offer.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">🎯</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Enable Notifications</h4>
                <p className="text-sm text-gray-600">Turn on push notifications to never miss a deal from your favorite spots.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-6 py-12 bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Is Happy Hour really free?</h4>
              <p className="text-sm text-gray-600">Yes! Happy Hour is completely free for customers. No subscription fees, no hidden costs.</p>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">How do I redeem a deal?</h4>
              <p className="text-sm text-gray-600">Simply show your phone with the deal at the restaurant. The staff will verify and apply the discount.</p>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Can I use multiple deals at once?</h4>
              <p className="text-sm text-gray-600">Each deal has its own terms. Some can be combined, others cannot. Check the deal details for specifics.</p>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">What if a deal is no longer available?</h4>
              <p className="text-sm text-gray-600">Deals are updated in real-time. If a deal is no longer available, we'll show you similar alternatives nearby.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-12 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Start Saving?
            </h2>
            <p className="text-blue-100 mb-6">
              Join thousands of people who are already saving money on great food
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
