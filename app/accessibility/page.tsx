'use client';

import React from 'react';

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Accessibility Commitment</h1>
        <p className="text-gray-700 leading-7 mb-6">
          We are committed to making Happy Hour accessible to everyone. Our goal is to conform to
          WCAG 2.1 AA standards and continuously improve the experience for all users.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Need assistance?</h2>
        <p className="text-gray-700 leading-7">
          If you experience any difficulty using our website, please contact us at
          {' '}<a href="mailto:support@happyhour.app" className="text-orange-600 hover:underline">support@happyhour.app</a>
          {' '}or call <a href="tel:1415555HAPPY" className="text-orange-600 hover:underline">(415) 555-HAPPY</a>.
        </p>
      </div>
    </main>
  );
}


