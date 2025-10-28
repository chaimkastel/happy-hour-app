'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function MerchantPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanks! Your merchant profile is submitted.
          </h1>
          <p className="text-lg text-gray-600">
            We usually review within 24 hours. We'll email you when you're approved.
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">What happens next?</h3>
              <p className="text-sm text-gray-700">
                Our team reviews your profile to ensure quality and compliance. This typically takes 24 hours.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Check your email</h3>
              <p className="text-sm text-gray-700">
                We'll send you a notification once your profile is approved or if we need more information.
              </p>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">While you wait:</h3>
          <ul className="space-y-3">
            {[
              'Prepare menu items for your first happy hour deals',
              'Think about off-peak times you want to target',
              'Gather photos for your restaurant profile',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all text-center"
          >
            Contact Support
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Questions? Reach out at <a href="mailto:support@orderhappyhour.com" className="text-orange-600 hover:underline">support@orderhappyhour.com</a>
        </p>
      </motion.div>
    </div>
  );
}

