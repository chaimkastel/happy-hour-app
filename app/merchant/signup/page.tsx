'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignupWizard } from '@/components/merchant/SignupWizard';
import { motion } from 'framer-motion';

export default function MerchantSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/merchant/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create merchant account');
      }

      const result = await response.json();
      
      // Redirect to pending page
      router.push('/merchant/pending');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Become a Merchant
          </h1>
          <p className="text-lg text-gray-600">
            Join restaurants using Happy Hour to attract diners during slower times
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-4 text-gray-700">Creating your account...</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Wizard */}
        <SignupWizard onComplete={handleComplete} />
      </div>
    </div>
  );
}
