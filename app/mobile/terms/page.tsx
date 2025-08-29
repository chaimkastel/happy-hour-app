'use client';

import React from 'react';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users, CreditCard } from 'lucide-react';

export default function MobileTermsPage() {
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
              <span className="text-white font-bold text-lg">Terms of Service</span>
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
            <Scale className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-white/80">
            Please read these terms carefully before using our service.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Last updated: January 1, 2025
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="px-6 pb-8 space-y-8">
        {/* Agreement */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Agreement to Terms</h2>
          <p className="text-white/80 leading-relaxed">
            By accessing and using Happy Hour, you accept and agree to be bound by the terms and 
            provision of this agreement. If you do not agree to abide by the above, please do not 
            use this service.
          </p>
        </div>

        {/* Service Description */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Service Description
          </h2>
          <p className="text-white/80 leading-relaxed">
            Happy Hour is a platform that connects users with restaurants offering real-time deals 
            and discounts. We facilitate the discovery and redemption of restaurant offers but are 
            not responsible for the quality of food, service, or fulfillment of deals by partner restaurants.
          </p>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Responsibilities
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">You agree to:</h3>
              <ul className="text-white/80 space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Provide accurate and complete information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Use the service only for lawful purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Respect restaurant policies and staff</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Not abuse or misuse deals or promotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>Maintain the security of your account</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">You agree NOT to:</h3>
              <ul className="text-white/80 space-y-1">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                  <span>Share or transfer your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                  <span>Use automated systems to access the service</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                  <span>Attempt to circumvent deal restrictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                  <span>Engage in fraudulent activities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deal Terms */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Deal Terms and Conditions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">General Deal Rules:</h3>
              <ul className="text-white/80 space-y-1">
                <li>• Deals are subject to availability and restaurant capacity</li>
                <li>• One deal per person per visit unless otherwise specified</li>
                <li>• Deals cannot be combined with other offers</li>
                <li>• Restaurant reserves the right to modify or cancel deals</li>
                <li>• Happy Hour is not responsible for deal fulfillment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Redemption Process:</h3>
              <ul className="text-white/80 space-y-1">
                <li>• Present your deal code to restaurant staff</li>
                <li>• Follow restaurant's redemption procedures</li>
                <li>• Deals expire at the time specified in the offer</li>
                <li>• No refunds for unused or expired deals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Payment Terms</h2>
          <ul className="text-white/80 space-y-2">
            <li>• All payments are processed securely through third-party providers</li>
            <li>• Prices are subject to change without notice</li>
            <li>• Refunds are processed according to our refund policy</li>
            <li>• You are responsible for any applicable taxes</li>
            <li>• Failed payments may result in service suspension</li>
          </ul>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Limitation of Liability
          </h2>
          <p className="text-white/80 leading-relaxed">
            Happy Hour acts as an intermediary between users and restaurants. We are not responsible 
            for the quality of food, service, or any issues that arise from your interaction with 
            restaurant partners. Our liability is limited to the amount you paid for our service.
          </p>
        </div>

        {/* Account Termination */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Account Termination</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            We reserve the right to terminate or suspend your account at any time for violations 
            of these terms or for any other reason at our discretion.
          </p>
          <p className="text-white/80 leading-relaxed">
            You may terminate your account at any time by contacting our support team or using 
            the account deletion feature in your profile settings.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Changes to Terms</h2>
          <p className="text-white/80 leading-relaxed">
            We reserve the right to modify these terms at any time. We will notify users of 
            significant changes via email or through the app. Continued use of the service 
            after changes constitutes acceptance of the new terms.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            If you have questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-white/80">
            <p>Email: legal@happyhour.com</p>
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
