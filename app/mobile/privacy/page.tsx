'use client';

import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Globe, FileText } from 'lucide-react';

export default function MobilePrivacyPage() {
  const handleBack = () => {
    window.history.back();
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
              <span className="text-white font-bold text-lg">Privacy Policy</span>
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
            <Shield className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-white/80">
            Your privacy is important to us. Learn how we protect your information.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Last updated: January 1, 2025
          </p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="px-6 pb-8 space-y-8">
        {/* Introduction */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Introduction</h2>
          <p className="text-white/80 leading-relaxed">
            Happy Hour ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you use our mobile 
            application and website. Please read this privacy policy carefully.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
              <ul className="text-white/80 space-y-1 ml-4">
                <li>• Name and email address</li>
                <li>• Phone number (optional)</li>
                <li>• Location data (with your permission)</li>
                <li>• Payment information (processed securely)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Usage Information</h3>
              <ul className="text-white/80 space-y-1 ml-4">
                <li>• App usage patterns and preferences</li>
                <li>• Restaurant and deal interactions</li>
                <li>• Search history and favorites</li>
                <li>• Device information and IP address</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            How We Use Your Information
          </h2>
          <ul className="text-white/80 space-y-2">
            <li>• Provide and improve our services</li>
            <li>• Show you relevant deals and restaurants</li>
            <li>• Process transactions and redemptions</li>
            <li>• Send you important updates and notifications</li>
            <li>• Analyze usage patterns to enhance user experience</li>
            <li>• Prevent fraud and ensure security</li>
          </ul>
        </div>

        {/* Data Protection */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Data Protection
          </h2>
          <p className="text-white/80 leading-relaxed mb-4">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="text-white/80 space-y-2">
            <li>• SSL encryption for all data transmission</li>
            <li>• Secure servers with regular security updates</li>
            <li>• Limited access to personal information</li>
            <li>• Regular security audits and monitoring</li>
            <li>• Secure payment processing (we don't store payment details)</li>
          </ul>
        </div>

        {/* Information Sharing */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Information Sharing
          </h2>
          <p className="text-white/80 leading-relaxed mb-4">
            We do not sell your personal information. We may share your information only in these cases:
          </p>
          <ul className="text-white/80 space-y-2">
            <li>• With restaurant partners (only for deal redemptions)</li>
            <li>• With service providers who help us operate our platform</li>
            <li>• When required by law or to protect our rights</li>
            <li>• With your explicit consent</li>
          </ul>
        </div>

        {/* Your Rights */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Your Rights
          </h2>
          <p className="text-white/80 leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="text-white/80 space-y-2">
            <li>• Access your personal information</li>
            <li>• Correct inaccurate information</li>
            <li>• Delete your account and data</li>
            <li>• Opt out of marketing communications</li>
            <li>• Request data portability</li>
            <li>• Withdraw consent at any time</li>
          </ul>
        </div>

        {/* Cookies and Tracking */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Cookies and Tracking</h2>
          <p className="text-white/80 leading-relaxed">
            We use cookies and similar technologies to enhance your experience, analyze usage, 
            and provide personalized content. You can control cookie settings through your 
            device or browser preferences.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-white/80">
            <p>Email: privacy@happyhour.com</p>
            <p>Phone: 1-800-HAPPY-HR</p>
            <p>Address: 123 Food Street, New York, NY 10001</p>
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
  );
}
