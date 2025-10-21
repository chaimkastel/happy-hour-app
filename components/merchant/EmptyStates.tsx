'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Building2, 
  Target, 
  TrendingUp, 
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface EmptyStateProps {
  type: 'deals' | 'venues' | 'analytics' | 'subscription';
  onCreateNew?: () => void;
  onUpgrade?: () => void;
  className?: string;
}

export function EmptyDealsState({ onCreateNew, className = '' }: Omit<EmptyStateProps, 'type'>) {
  return (
    <Card className={className}>
      <CardContent className="p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-12 h-12 text-orange-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">No Deals Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Create your first deal to start attracting customers and driving sales. 
              Deals help increase foot traffic during slower periods.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Deal
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>💡 <strong>Pro tip:</strong> Start with a simple happy hour deal</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Attract Customers</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Boost Sales</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600">Fill Slow Times</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export function EmptyVenuesState({ onCreateNew, className = '' }: Omit<EmptyStateProps, 'type'>) {
  return (
    <Card className={className}>
      <CardContent className="p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">No Venues Added</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Add your restaurant or venue to start creating deals and managing your business.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Venue
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>📍 <strong>Quick setup:</strong> Add location, hours, and contact info</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-gray-600">Location</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Hours</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600">Deals</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export function EmptyAnalyticsState({ className = '' }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-12 h-12 text-purple-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">No Analytics Data Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Analytics will appear here once you start creating deals and customers begin redeeming them.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              <p>📊 <strong>Coming soon:</strong> Revenue tracking, customer insights, and performance metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto pt-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Revenue</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Customers</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-gray-600">Redemptions</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600">Growth</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export function EmptySubscriptionState({ onUpgrade, className = '' }: Omit<EmptyStateProps, 'type'>) {
  return (
    <Card className={className}>
      <CardContent className="p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
            <Gift className="w-12 h-12 text-yellow-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">Free Trial Active</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              You're currently on a free trial. Upgrade to unlock premium features and remove limits.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Upgrade to Pro
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>⭐ <strong>Pro benefits:</strong> Unlimited deals, advanced analytics, priority support</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Unlimited Deals</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Analytics</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600">Support</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export function TestModeBanner({ className = '' }: { className?: string }) {
  const isTestMode = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_');
  
  if (!isTestMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <Gift className="w-4 h-4 text-yellow-600" />
        </div>
        <div>
          <h4 className="font-medium text-yellow-800">Test Mode Active</h4>
          <p className="text-sm text-yellow-700">
            You're in test mode. Switch to live keys for production.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

