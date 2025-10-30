'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, DollarSign, Image as ImageIcon, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CreateDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    percentOff: '',
    maxRedemptions: '',
    startTime: '',
    endTime: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/merchant/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          percentOff: Number(formData.percentOff),
          maxRedemptions: formData.maxRedemptions ? Number(formData.maxRedemptions) : undefined,
          startTime: formData.startTime,
          endTime: formData.endTime,
          imageUrl: formData.imageUrl,
          type: 'SCHEDULED'
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create deal');
      }

      router.push('/merchant/dashboard');
    } catch (error) {
      console.error('Error creating deal:', error);
      alert((error as Error).message || 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/20">
      <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
            <button
              onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
            <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
            <h1 className="text-3xl font-bold text-slate-900">Create Scheduled Deal</h1>
            <p className="text-slate-600">Set up a recurring happy hour for off-peak times</p>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            id="section-details"
          >
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900">Deal Details</h2>
              </div>

            <div className="space-y-4">
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Deal Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="50% off all appetizers"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell diners what makes this deal special..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discount (%) *
                  </label>
                  <input
                    name="percentOff"
                    type="number"
                    value={formData.percentOff}
                    onChange={(e) => setFormData({ ...formData, percentOff: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
              </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Max Redemptions
                  </label>
                  <input
                    name="maxRedemptions"
                    type="number"
                    value={formData.maxRedemptions}
                    onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value })}
                    placeholder="Unlimited"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => document.getElementById('section-hours')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Next
                </button>
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            id="section-hours"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Hours</h2>
                </div>
                
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Time *
                  </label>
                <input
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Time *
                </label>
                <input
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => document.getElementById('section-image')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg"
              >
                Next
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            id="section-image"
          >
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-slate-900">Image</h2>
            </div>

            <input
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg"
              >
                Next
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
                  type="submit"
                  disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {loading ? 'Creating...' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
