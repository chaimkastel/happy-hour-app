'use client';

import { useState } from 'react';
import { Check, Star, Building2, Zap, TrendingUp, Crown, AlertCircle } from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  venueLimit: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49.99,
    venueLimit: '1 venue',
    description: 'Perfect for single-location businesses',
    features: [
      'Create unlimited deals',
      'Basic analytics dashboard',
      'QR code generation',
      'Email support',
      'Standard deal templates'
    ],
    icon: <Building2 className="w-8 h-8" />
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 100,
    venueLimit: '2-5 venues',
    description: 'Ideal for growing business groups',
    popular: true,
    features: [
      'Everything in Basic',
      'Multi-venue management',
      'Advanced analytics',
      'Bulk deal creation',
      'Priority support',
      'Custom deal templates',
      'Performance insights'
    ],
    icon: <TrendingUp className="w-8 h-8" />
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 250,
    venueLimit: 'Up to 25 venues',
    description: 'For large business chains and groups',
    features: [
      'Everything in Growth',
      'Unlimited venue scaling',
      'White-label options',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced reporting',
      'Multi-location analytics'
    ],
    icon: <Crown className="w-8 h-8" />
  }
];

export default function SubscriptionTiers() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (planId: string, action: 'start-trial' | 'subscribe' = 'subscribe') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/merchant/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plan: planId,
          action: action,
          returnUrl: window.location.href
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // If Stripe is configured, redirect to checkout
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        
        // Otherwise, show success message for database-only subscription
        console.log('Subscription response:', data);
        setSelectedPlan(planId);
        alert(data.message || 'Subscription updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to subscribe:', errorData);
        alert(errorData.error || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('An error occurred while updating your subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-6">
          Choose Your Plan
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Scale your business with flexible subscription plans. 
          Start with one location and grow as you expand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden ${
              tier.popular ? 'ring-4 ring-indigo-500 scale-105' : ''
            }`}
          >
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  <Star className="w-4 h-4 inline mr-2" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-indigo-600 dark:text-indigo-400">
                    {tier.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
                  {tier.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {tier.description}
                </p>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">
                  ${tier.price}
                  <span className="text-lg font-normal text-slate-500">/month</span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                  {tier.venueLimit}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <ul className="space-y-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Free Trial Button */}
                <button
                  onClick={() => handleSubscribe(tier.id, 'start-trial')}
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-full font-bold text-lg transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    'Start Free Trial'
                  )}
                </button>
                
                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(tier.id, 'subscribe')}
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-all duration-300 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-full px-6 py-3 mb-8">
          <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-emerald-800 dark:text-emerald-200 font-semibold">
            Start with a 14-day free trial - no credit card required!
          </span>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Need more than 25 venues? <a href="#" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Contact us</a> for custom enterprise pricing.
        </p>
      </div>
    </div>
  );
}
