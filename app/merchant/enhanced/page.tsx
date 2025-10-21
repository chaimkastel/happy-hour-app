'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Building2, Tag, MapPin, Clock, Star, Users } from 'lucide-react';

const RestaurantForm = dynamic(() => import('../../../components/RestaurantForm'), { ssr: false });
const DealForm = dynamic(() => import('../../../components/DealForm'), { ssr: false });

interface Restaurant {
  id: string;
  name: string;
  address: string;
  businessType: string;
  priceRange: string;
  isOpen: boolean;
  avgRating: number;
  ratingCount: number;
  deals: Deal[];
}

interface Deal {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  isActive: boolean;
  activatedAt: string | null;
  expiresAt: string | null;
  redemptions: any[];
  restaurant?: {
    id: string;
    name: string;
  };
}

export default function EnhancedMerchantDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [restaurantsRes, dealsRes] = await Promise.all([
        fetch('/api/merchant/restaurant/list'),
        fetch('/api/deals')
      ]);
      
      const restaurantsData = await restaurantsRes.json();
      const dealsData = await dealsRes.json();
      
      setRestaurants(restaurantsData.restaurants || []);
      setDeals(dealsData.deals || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/merchant/restaurant/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('Restaurant created successfully!');
        setShowRestaurantForm(false);
        await loadData();
      } else {
        setMessage(`Error: ${result.error || 'Failed to create restaurant'}`);
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setMessage('Failed to create restaurant');
    }
  };

  const handleDealSubmit = async (data: any) => {
    if (!selectedRestaurant) {
      setMessage('Please select a restaurant first');
      return;
    }

    try {
      const response = await fetch('/api/merchant/deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          restaurantId: selectedRestaurant.id
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('Deal created successfully!');
        setShowDealForm(false);
        setSelectedRestaurant(null);
        await loadData();
      } else {
        setMessage(`Error: ${result.error || 'Failed to create deal'}`);
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      setMessage('Failed to create deal');
    }
  };

  const activateDeal = async (dealId: string) => {
    try {
      const response = await fetch('/api/merchant/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, durationMinutes: 120 })
      });

      if (response.ok) {
        setMessage('Deal activated!');
        await loadData();
      } else {
        setMessage('Failed to activate deal');
      }
    } catch (error) {
      setMessage('Failed to activate deal');
    }
  };

  const deactivateDeal = async (dealId: string) => {
    try {
      const response = await fetch('/api/merchant/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId })
      });

      if (response.ok) {
        setMessage('Deal deactivated!');
        await loadData();
      } else {
        setMessage('Failed to deactivate deal');
      }
    } catch (error) {
      setMessage('Failed to deactivate deal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Enhanced Merchant Dashboard
          </h1>
          <p className="text-xl text-white/70">
            Manage your restaurants and create amazing deals
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            message.includes('successfully') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{restaurants.length}</div>
            <div className="text-white/60">Restaurants</div>
          </div>
          
          <div className="card text-center">
            <Tag className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-white">{deals.length}</div>
            <div className="text-white/60">Total Deals</div>
          </div>
          
          <div className="card text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">
              {deals.reduce((sum, deal) => sum + deal.redemptions.length, 0)}
            </div>
            <div className="text-white/60">Redemptions</div>
          </div>
          
          <div className="card text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">
              {restaurants.reduce((sum, r) => sum + r.avgRating, 0) / Math.max(restaurants.length, 1)}
            </div>
            <div className="text-white/60">Avg Rating</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowRestaurantForm(true)}
            className="btn bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Restaurant
          </button>
          
          <button
            onClick={() => setShowDealForm(true)}
            disabled={!restaurants.length}
            className="btn bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Deal
          </button>
        </div>

        {/* Restaurant Form Modal */}
        {showRestaurantForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Restaurant</h2>
                <button
                  onClick={() => setShowRestaurantForm(false)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <RestaurantForm onSubmit={handleRestaurantSubmit} />
            </div>
          </div>
        )}

        {/* Deal Form Modal */}
        {showDealForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Deal</h2>
                <button
                  onClick={() => setShowDealForm(false)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              {!selectedRestaurant && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-white">Select Restaurant</label>
                  <select
                    onChange={(e) => {
                      const restaurant = restaurants.find((r: Restaurant) => r.id === e.target.value);
                      setSelectedRestaurant(restaurant || null);
                    }}
                    className="input w-full"
                    value={selectedRestaurant ? (selectedRestaurant as Restaurant).id : ''}
                  >
                    <option value="">Choose a restaurant...</option>
                    {restaurants.map((restaurant: Restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name} - {restaurant.businessType}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {selectedRestaurant && (
                <DealForm 
                  onSubmit={handleDealSubmit} 
                  restaurantId={selectedRestaurant.id}
                />
              )}
            </div>
          </div>
        )}

        {/* Restaurants List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Your Restaurants
          </h2>
          
          {restaurants.length === 0 ? (
            <div className="card text-center py-12">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <p className="text-white/60 text-lg">No restaurants yet</p>
              <p className="text-white/40">Create your first restaurant to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <div key={restaurant.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{restaurant.name}</h3>
                      <p className="text-white/60">{restaurant.businessType}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      restaurant.isOpen ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{restaurant.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/70">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm capitalize">{restaurant.priceRange || 'Not specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/70">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">
                        {restaurant.avgRating.toFixed(1)} ({restaurant.ratingCount} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-white/60 mb-2">
                      {restaurant.deals.length} active deals
                    </p>
                    <button
                      onClick={() => {
                        setSelectedRestaurant(restaurant);
                        setShowDealForm(true);
                      }}
                      className="btn-ghost w-full text-sm"
                    >
                      Create Deal for this Restaurant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deals List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Tag className="w-6 h-6" />
            All Deals
          </h2>
          
          {deals.length === 0 ? (
            <div className="card text-center py-12">
              <Tag className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <p className="text-white/60 text-lg">No deals yet</p>
              <p className="text-white/40">Create your first deal to attract customers</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map(deal => (
                <div key={deal.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{deal.title}</h3>
                      <p className="text-white/60 text-sm">{deal.restaurant?.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      deal.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {deal.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4">{deal.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-400">
                      {deal.discountPercent}% OFF
                    </span>
                    <span className="text-white/60 text-sm">
                      {deal.redemptions.length} redemptions
                    </span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    {deal.isActive ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => deactivateDeal(deal.id)}
                          className="btn-ghost flex-1 text-sm"
                        >
                          Deactivate
                        </button>
                        <a
                          href={`/deal/${deal.id}/view`}
                          target="_blank"
                          className="btn bg-blue-600 hover:bg-blue-700 text-sm"
                        >
                          View QR
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={() => activateDeal(deal.id)}
                        className="btn bg-green-600 hover:bg-green-700 w-full text-sm"
                      >
                        Activate Deal
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
