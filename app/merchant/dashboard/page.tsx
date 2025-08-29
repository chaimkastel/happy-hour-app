'use client';
import { useState, useEffect } from 'react';
import { Plus, Building2, Tag, MapPin, Clock, Star, Users, Zap, DollarSign, Timer, TrendingUp, BarChart3, Activity, Settings, Bell } from 'lucide-react';
import AIAnalytics from '../../../components/AIAnalytics';

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
  dealType: string;
  isActive: boolean;
  activatedAt: string | null;
  expiresAt: string | null;
  redemptions: any[];
  hourlyRate?: number;
  durationHours?: number;
  quietTimeStart?: string;
  quietTimeEnd?: string;
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dealType: 'quiet_time' as 'quiet_time' | 'happy_blast',
    discountPercent: 20,
    quietTimeStart: '14:00',
    quietTimeEnd: '17:00',
    hourlyRate: 50,
    durationHours: 1
  });

  useEffect(() => {
    // Check if user is logged in
    const merchantSession = localStorage.getItem('merchant_session');
    if (!merchantSession) {
      // Redirect to login if not authenticated
      window.location.href = '/merchant/login';
      return;
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [venuesRes, dealsRes] = await Promise.all([
        fetch('/api/merchant/venues'),
        fetch('/api/merchant/deals')
      ]);
      
      const venuesData = await venuesRes.json();
      const dealsData = await dealsRes.json();
      
      // Transform venues to restaurants format
      const transformedVenues = (venuesData.venues || []).map((venue: any) => ({
        id: venue.id,
        name: venue.name,
        address: venue.address,
        businessType: venue.businessType,
        priceRange: venue.priceTier || '$$',
        isOpen: true,
        avgRating: venue.rating || 0,
        ratingCount: 0,
        deals: []
      }));
      
      setRestaurants(transformedVenues);
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
      const response = await fetch('/api/merchant/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('✅ Venue created successfully!');
        setShowRestaurantForm(false);
        await loadData();
      } else {
        setMessage(`❌ ${result.error || 'Failed to create venue'}`);
      }
    } catch (error) {
      console.error('Error creating venue:', error);
      setMessage('❌ Failed to create venue');
    }
  };

  const handleDealSubmit = async (data: any) => {
    if (!selectedRestaurant) {
      setMessage('❌ Please select a venue first');
      return;
    }

    try {
      const response = await fetch('/api/merchant/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          venueId: selectedRestaurant.id || ''
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage('✅ Deal created successfully!');
        setShowDealForm(false);
        setSelectedRestaurant(null);
        await loadData();
      } else {
        setMessage(`❌ ${result.error || 'Failed to create deal'}`);
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      setMessage('❌ Failed to create deal');
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
        setMessage('✅ Deal activated!');
        await loadData();
      } else {
        setMessage('❌ Failed to activate deal');
      }
    } catch (error) {
      setMessage('❌ Failed to activate deal');
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
        setMessage('✅ Deal deactivated!');
        await loadData();
      } else {
        setMessage('❌ Failed to activate deal');
      }
    } catch (error) {
      setMessage('❌ Failed to activate deal');
    }
  };

  const getDealTypeIcon = (dealType: string) => {
    return dealType === 'quiet_time' ? <Clock className="w-4 h-4" /> : <Zap className="w-4 h-4" />;
  };

  const getDealTypeColor = (dealType: string) => {
    return dealType === 'quiet_time' ? 'text-blue-400' : 'text-green-400';
  };

  const getDealTypeLabel = (dealType: string) => {
    return dealType === 'quiet_time' ? 'Quiet Time' : 'Happy Blast';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                🏪 Happy Hour Ultra
              </h1>
              <p className="text-slate-600 mt-1">Merchant Dashboard</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Display */}
        {message && (
          <div className={`mb-8 p-4 rounded-2xl text-center ${
            message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Restaurants</p>
                <p className="text-3xl font-bold text-slate-800">{restaurants.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Deals</p>
                <p className="text-3xl font-bold text-slate-800">{deals.filter(d => d.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Redemptions</p>
                <p className="text-3xl font-bold text-slate-800">
                  {deals?.reduce((sum, deal) => sum + (deal.redemptions?.length || 0), 0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Rating</p>
                <p className="text-3xl font-bold text-slate-800">
                  {restaurants?.length ? (restaurants.reduce((sum, r) => sum + r.avgRating, 0) / restaurants.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowRestaurantForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Add Restaurant
          </button>
          
          <button
            onClick={() => setShowDealForm(true)}
            disabled={!restaurants || !restaurants.length}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Create Deal
          </button>
        </div>

        {/* Restaurant Form Modal */}
        {showRestaurantForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Add New Venue</h2>
                <button
                  onClick={() => setShowRestaurantForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-3xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = {
                  name: formData.get('name') as string,
                  address: formData.get('address') as string,
                  businessType: [formData.get('businessType') as string],
                  priceTier: formData.get('priceTier') as string,
                  description: formData.get('description') as string,
                  contactInfo: {
                    phone: formData.get('phone') as string,
                    email: formData.get('email') as string,
                    website: formData.get('website') as string
                  },
                  amenities: [],
                  capacity: parseInt(formData.get('capacity') as string) || 50
                };
                handleRestaurantSubmit(data);
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="e.g., Bella Vista Restaurant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Select type</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Cafe">Cafe</option>
                      <option value="Bar">Bar</option>
                      <option value="Fast Food">Fast Food</option>
                      <option value="Fine Dining">Fine Dining</option>
                      <option value="Casual Dining">Casual Dining</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g., 123 Main St, New York, NY 10001"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Price Tier
                    </label>
                    <select
                      name="priceTier"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="BUDGET">Budget ($)</option>
                      <option value="MODERATE">Moderate ($$)</option>
                      <option value="EXPENSIVE">Expensive ($$$)</option>
                      <option value="LUXURY">Luxury ($$$$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Describe your venue..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="contact@venue.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="https://venue.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowRestaurantForm(false)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Create Venue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Deal Form Modal */}
        {showDealForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Create New Deal</h2>
                <button
                  onClick={() => setShowDealForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-3xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              
              {!selectedRestaurant && (
                <div className="mb-8">
                  <label className="block text-lg font-semibold mb-3 text-slate-700">Select Restaurant</label>
                  <select
                    onChange={(e) => {
                      const restaurant = restaurants?.find(r => r.id === e.target.value);
                      setSelectedRestaurant(restaurant || null);
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={selectedRestaurant ? (selectedRestaurant as Restaurant).id : ''}
                  >
                    <option value="">Choose a restaurant...</option>
                    {restaurants?.map((restaurant: Restaurant) => (
                      <option key={restaurant.id || 'unknown'} value={restaurant.id || ''}>
                        {restaurant.name || 'Unnamed Restaurant'} - {restaurant.businessType || 'No business type specified'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {selectedRestaurant && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold mb-3 text-slate-700">Deal Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Happy Hour Special"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold mb-3 text-slate-700">Description</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      rows={3}
                      placeholder="Describe your deal..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-semibold mb-3 text-slate-700">Discount %</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={formData.discountPercent}
                        onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-lg font-semibold mb-3 text-slate-700">Deal Type</label>
                      <select
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={formData.dealType}
                        onChange={(e) => setFormData(prev => ({ ...prev, dealType: e.target.value as 'quiet_time' | 'happy_blast' }))}
                      >
                        <option value="quiet_time">Quiet Time</option>
                        <option value="happy_blast">Happy Blast</option>
                      </select>
                    </div>
                  </div>
                  
                  {formData.dealType === 'quiet_time' && (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-slate-700">Quiet Time Start</label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={formData.quietTimeStart}
                          onChange={(e) => setFormData(prev => ({ ...prev, quietTimeStart: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-slate-700">Quiet Time End</label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={formData.quietTimeEnd}
                          onChange={(e) => setFormData(prev => ({ ...prev, quietTimeEnd: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                  
                  {formData.dealType === 'happy_blast' && (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-slate-700">Hourly Rate ($)</label>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-slate-700">Duration (Hours)</label>
                        <input
                          type="number"
                          min="0.5"
                          max="24"
                          step="0.5"
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={formData.durationHours}
                          onChange={(e) => setFormData(prev => ({ ...prev, durationHours: parseFloat(e.target.value) }))}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => handleDealSubmit(formData)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Create Deal
                    </button>
                    <button
                      onClick={() => setShowDealForm(false)}
                      className="flex-1 bg-slate-100 text-slate-700 py-4 px-6 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Restaurants List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-600" />
            Your Restaurants
          </h2>
          
          {!restaurants || restaurants.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
              <Building2 className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">No restaurants yet</h3>
              <p className="text-slate-500 mb-6">Create your first restaurant to get started</p>
              <button
                onClick={() => setShowRestaurantForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Add Restaurant
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants?.map(restaurant => (
                <div key={restaurant.id || 'unknown'} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">{restaurant.name || 'Unnamed Restaurant'}</h3>
                      <p className="text-slate-500">{restaurant.businessType || 'No business type specified'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{restaurant.address || 'No address specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm capitalize">{restaurant.priceRange || 'Not specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">
                        {(restaurant.avgRating || 0).toFixed(1)} ({restaurant.ratingCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500 mb-3">
                      {restaurant.deals?.length || 0} active deals
                    </p>
                    <button
                      onClick={() => {
                        setSelectedRestaurant(restaurant);
                        setShowDealForm(true);
                      }}
                      className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors duration-200"
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
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <Tag className="w-7 h-7 text-green-600" />
            All Deals
          </h2>
          
          {!deals || deals.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
              <Tag className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-slate-700 mb-2">No deals yet</h3>
              <p className="text-slate-500 mb-6">Create your first deal to attract customers</p>
              <button
                onClick={() => setShowDealForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                Create Deal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals?.map(deal => (
                <div key={deal.id || 'unknown'} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{deal.title || 'Untitled Deal'}</h3>
                      <p className="text-slate-500 text-sm">{deal.restaurant?.name || 'Unknown Restaurant'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        deal.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {deal.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        deal.dealType === 'quiet_time' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {getDealTypeIcon(deal.dealType || 'quiet_time')}
                        {getDealTypeLabel(deal.dealType || 'quiet_time')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4">{deal.description || 'No description provided'}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        {deal.discountPercent || 0}% OFF
                      </span>
                      <span className="text-slate-500 text-sm">
                        {(deal.redemptions?.length || 0)} redemptions
                      </span>
                    </div>
                    
                    {/* Deal Type Specific Info */}
                    {deal.dealType === 'quiet_time' && deal.quietTimeStart && deal.quietTimeEnd && (
                      <div className="flex items-center gap-2 text-blue-600 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Quiet Time: {deal.quietTimeStart || 'Not set'} - {deal.quietTimeEnd || 'Not set'}</span>
                      </div>
                    )}
                    
                    {deal.dealType === 'happy_blast' && deal.hourlyRate && deal.durationHours && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <Zap className="w-4 h-4" />
                        <span>${deal.hourlyRate || 0}/hr × {deal.durationHours || 0}hrs = ${((deal.hourlyRate || 0) * (deal.durationHours || 0)).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    {deal.isActive ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => deactivateDeal(deal.id || '')}
                          className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors duration-200"
                        >
                          Deactivate
                        </button>
                        <a
                          href={`/deal/${deal.id || 'unknown'}/view`}
                          target="_blank"
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
                        >
                          View QR
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={() => activateDeal(deal.id || '')}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-200"
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

      {/* AI Analytics Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 mb-8">
              AI Analytics Dashboard
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Get intelligent insights and predictions about your deals, customer behavior, and business performance.
            </p>
          </div>
          
          <AIAnalytics 
            deals={deals.map(deal => ({
              id: deal.id || '',
              title: deal.title || '',
              percentOff: deal.discountPercent || 0,
              maxRedemptions: 100, // Default value
              redeemedCount: deal.redemptions?.length || 0,
              startAt: deal.activatedAt || new Date().toISOString(),
              endAt: deal.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              revenue: (deal.redemptions?.length || 0) * 25, // Estimate $25 per redemption
              venue: {
                name: deal.restaurant?.name || 'Unknown',
                businessType: ['General']
              }
            }))}
            timeRange="30d"
          />
        </div>
      </div>
    </div>
  );
}
