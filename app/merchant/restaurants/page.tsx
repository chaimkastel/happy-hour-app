'use client';
import { useState, useEffect } from 'react';
import { Building2, MapPin, Star, Phone, Globe, Plus, Edit, Trash2, ArrowLeft, Users, Tag, Clock } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  phone: string;
  website: string;
  heroImage: string | null;
  photosJson: string;
  avgRating: number;
  ratingCount: number;
  businessType: string;
  priceRange: string;
  features: string;
  businessHours: string;
  isOpen: boolean;
  quietHours: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
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
}

export default function RestaurantsPage() {
  // Use sample data directly instead of API calls
  const [restaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: 'Crown Heights Trattoria',
      address: '123 Nostrand Ave, Brooklyn, NY',
      lat: 40.6681,
      lng: -73.9442,
      description: 'Neighborhood Italian with spritzes & fresh pasta.',
      phone: '(718) 555-1001',
      website: 'https://trattoria.example',
      heroImage: null,
      photosJson: '[{"url":"https://picsum.photos/seed/pasta/640/360"}]',
      avgRating: 5,
      ratingCount: 1,
              businessType: 'Italian',
      priceRange: '$$',
      features: '["outdoor_seating", "delivery", "takeout"]',
      businessHours: '{"monday":"11:00-22:00","tuesday":"11:00-22:00","wednesday":"11:00-22:00","thursday":"11:00-22:00","friday":"11:00-23:00","saturday":"11:00-23:00","sunday":"12:00-21:00"}',
      isOpen: true,
      quietHours: '{"start":"14:00","end":"17:00"}',
      ownerId: 'owner1',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      deals: [
        {
          id: 'deal1',
          title: 'Late Lunch Happy Hour',
          description: '30% off pastas 3–5pm',
          discountPercent: 30,
          dealType: 'quiet_time',
          isActive: false,
          activatedAt: null,
          expiresAt: null,
          redemptions: []
        }
      ]
    },
    {
      id: '2',
      name: 'Brooklyn Brew House',
      address: '456 Atlantic Ave, Brooklyn, NY',
      lat: 40.6865,
      lng: -73.9965,
      description: 'Craft beer and comfort food in a relaxed atmosphere.',
      phone: '(718) 555-2002',
      website: 'https://brew.example',
      heroImage: null,
      photosJson: '[{"url":"https://picsum.photos/seed/beer/640/360"}]',
      avgRating: 4.8,
      ratingCount: 3,
              businessType: 'American',
      priceRange: '$$',
      features: '["craft_beer", "outdoor_seating", "live_music"]',
      businessHours: '{"monday":"16:00-23:00","tuesday":"16:00-23:00","wednesday":"16:00-23:00","thursday":"16:00-23:00","friday":"16:00-02:00","saturday":"16:00-02:00","sunday":"16:00-22:00"}',
      isOpen: true,
      quietHours: '{"start":"16:00","end":"18:00"}',
      ownerId: 'owner1',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      deals: [
        {
          id: 'deal2',
          title: 'Early Bird Beer Special',
          description: '20% off all craft beers 4-6pm',
          discountPercent: 20,
          dealType: 'quiet_time',
          isActive: true,
          activatedAt: '2025-01-01T00:00:00Z',
          expiresAt: null,
          redemptions: []
        }
      ]
    }
  ]);

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const deleteRestaurant = async (restaurantId: string) => {
    if (confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      // In a real app, this would call the delete API
      console.log('Deleting restaurant:', restaurantId);
    }
  };

  const getFeaturesList = (featuresJson: string) => {
    try {
      const features = JSON.parse(featuresJson);
      return Array.isArray(features) ? features : [];
    } catch {
      return [];
    }
  };

  const getBusinessHours = (hoursJson: string) => {
    try {
      const hours = JSON.parse(hoursJson);
      return hours;
    } catch {
      return {};
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-200">My Restaurants</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Manage your restaurant locations and view performance metrics
        </p>
      </div>

      {/* Back Button */}
      <div className="mb-8">
        <a
          href="/merchant"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Merchant Dashboard
        </a>
      </div>

      {/* Add Restaurant Button */}
      <div className="mb-8 text-center">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
        >
          <Plus className="w-5 h-5" />
          Add New Restaurant
        </button>
      </div>

      {/* Stats Summary */}
      {restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{restaurants.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Restaurants</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Tag className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {restaurants.reduce((sum, r) => sum + (r.deals?.length || 0), 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Deals</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {restaurants.reduce((sum, r) => sum + (r.ratingCount || 0), 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Reviews</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {restaurants.length > 0 ? (restaurants.reduce((sum, r) => sum + (r.avgRating || 0), 0) / restaurants.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</div>
          </div>
        </div>
      )}

      {/* Restaurants List */}
      {restaurants.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-12 h-12 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">No restaurants yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Add your first restaurant to start creating deals</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Add Restaurant
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Restaurant Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">{restaurant.name}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">{restaurant.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          restaurant.isOpen ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}>
                          {restaurant.isOpen ? 'Open' : 'Closed'}
                        </span>

                        <button
                          onClick={() => setSelectedRestaurant(restaurant)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteRestaurant(restaurant.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                          title="Delete Restaurant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Restaurant Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{restaurant.address}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{restaurant.phone}</span>
                      </div>

                      {restaurant.website && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Globe className="w-4 h-4" />
                          <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                            Website
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm">{restaurant.businessType} • {restaurant.priceRange}</span>
                      </div>
                    </div>

                    {/* Rating and Features */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {restaurant.avgRating.toFixed(1)} ({restaurant.ratingCount} reviews)
                        </span>
                      </div>

                      {restaurant.quietHours && (
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Quiet Hours: {JSON.parse(restaurant.quietHours).start} - {JSON.parse(restaurant.quietHours).end}</span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {restaurant.features && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-2 text-slate-800 dark:text-slate-200">Features:</div>
                        <div className="flex flex-wrap gap-2">
                          {getFeaturesList(restaurant.features).map((feature: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300"
                            >
                              {feature.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Deals Summary */}
                  <div className="lg:w-64">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">Active Deals</h4>

                      {restaurant.deals && restaurant.deals.length > 0 ? (
                        <div className="space-y-2">
                          {restaurant.deals.slice(0, 3).map((deal) => (
                            <div key={deal.id} className="text-sm">
                              <div className="font-medium text-slate-800 dark:text-slate-200">{deal.title}</div>
                              <div className="text-slate-600 dark:text-slate-400">{deal.discountPercent}% off</div>
                              <span className={`text-xs px-2 py-1 rounded-full inline-block ${
                                deal.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}>
                                {deal.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          ))}

                          {restaurant.deals.length > 3 && (
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              +{restaurant.deals.length - 3} more deals
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-600 dark:text-slate-400">No deals yet</div>
                      )}

                      <div className="mt-4">
                        <a
                          href="/merchant/dashboard"
                          className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                        >
                          Manage Deals
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
