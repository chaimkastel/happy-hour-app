'use client';

import React from 'react';

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-gray-700 leading-7 mb-6">
          Find answers to common questions. If you need more help, contact us at
          {' '}<a href="mailto:support@happyhour.app" className="text-orange-600 hover:underline">support@happyhour.app</a>.
        </p>
        <ul className="space-y-4">
          <li>
            <h2 className="text-lg font-semibold text-gray-900">How do I find deals?</h2>
            <p className="text-gray-700">Visit the Explore page to browse live deals near you.</p>
          </li>
          <li>
            <h2 className="text-lg font-semibold text-gray-900">How do restaurants join?</h2>
            <p className="text-gray-700">Go to the merchant signup page to create an account.</p>
          </li>
        </ul>
      </div>
    </main>
  );
}


