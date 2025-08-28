'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, MapPin, Tag, Clock, Star } from 'lucide-react';
// confetti removed for optimization

interface Deal {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  dealType: string;
  isActive: boolean;
  expiresAt: string | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
  minOrderAmount: number;
  restaurant: {
    name: string;
    address: string;
    businessType: string;
    priceRange: string;
  };
}

export default function RedeemPage({ params }: { params: { id: string } }) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    orderAmount: ''
  });

  useEffect(() => {
    // Simulate API call to fetch deal details
    setTimeout(() => {
      setDeal({
        id: params.id,
        title: 'Late Lunch Happy Hour',
        description: '30% off pastas 3–5pm',
        discountPercent: 30,
        dealType: 'quiet_time',
        isActive: true,
        expiresAt: '2025-12-31T23:59:59Z',
        maxRedemptions: 100,
        currentRedemptions: 45,
        minOrderAmount: 20.00,
        restaurant: {
          name: 'Crown Heights Trattoria',
          address: '123 Nostrand Ave, Brooklyn, NY',
          businessType: 'Italian',
          priceRange: '$$'
        }
      });
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deal) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Confetti animation removed for optimization
      
    } catch (error) {
      setError('Failed to redeem deal. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Error</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Deal Redeemed!</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Your discount has been applied successfully.</p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Explore More Deals
          </a>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Deal Not Found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The deal you're looking for doesn't exist.</p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Explore Deals
          </a>
        </div>
      </div>
    );
  }

  const getDealTypeLabel = (dealType: string) => {
    switch (dealType) {
      case 'quiet_time':
        return 'Quiet Time';
      case 'happy_blast':
        return 'Happy Blast';
      default:
        return 'Special';
    }
  };

  const getDealTypeColor = (dealType: string) => {
    switch (dealType) {
      case 'quiet_time':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'happy_blast':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Back Button */}
      <div className="pt-8 px-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Deal Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-200">Redeem Your Deal</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Complete your order and enjoy your discount!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Deal Details */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Deal Details</h2>
            
            <div className="space-y-6">
              {/* Deal Title & Description */}
              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">{deal.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{deal.description}</p>
              </div>

              {/* Discount Badge */}
              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-2xl">
                  <div className="text-4xl font-bold">{deal.discountPercent}%</div>
                  <div className="text-sm">OFF</div>
                </div>
              </div>

              {/* Deal Type */}
              <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getDealTypeColor(deal.dealType)}`}>
                  {getDealTypeLabel(deal.dealType)}
                </span>
              </div>

              {/* Restaurant Info */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">{deal.restaurant.name}</h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{deal.restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>{deal.restaurant.businessType} • {deal.restaurant.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Deal Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{deal.currentRedemptions}</div>
                  <div className="text-slate-600 dark:text-slate-400">Redeemed</div>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">${deal.minOrderAmount}</div>
                  <div className="text-slate-600 dark:text-slate-400">Min Order</div>
                </div>
              </div>
            </div>
          </div>

          {/* Redemption Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Complete Your Order</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name */}
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Order Amount */}
              <div>
                <label htmlFor="orderAmount" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Order Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400">$</span>
                  <input
                    type="number"
                    id="orderAmount"
                    name="orderAmount"
                    value={formData.orderAmount}
                    onChange={handleInputChange}
                    required
                    min={deal.minOrderAmount}
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Minimum $${deal.minOrderAmount}`}
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Minimum order amount: ${deal.minOrderAmount}
                </p>
              </div>

              {/* Discount Preview */}
              {formData.orderAmount && parseFloat(formData.orderAmount) >= deal.minOrderAmount && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Your Savings</h4>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    -${(parseFloat(formData.orderAmount) * (deal.discountPercent / 100)).toFixed(2)}
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Final amount: ${(parseFloat(formData.orderAmount) * (1 - deal.discountPercent / 100)).toFixed(2)}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Redeem Deal & Complete Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
