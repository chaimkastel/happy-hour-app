'use client';

import React from 'react';

export default function MerchantBillingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription</h1>
        <p className="text-gray-600 mb-6">Manage your plan and billing details</p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-500">Current plan</div>
              <div className="text-lg font-semibold">Basic</div>
            </div>
            <a href="/pricing" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold">Upgrade</a>
          </div>
          <div className="text-sm text-gray-600">Billing is handled securely by Stripe.</div>
        </div>
      </div>
    </div>
  );
}


