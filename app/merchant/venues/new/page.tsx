'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Building2, Tag, DollarSign, Clock, Save, X, Upload, Image, Plus, Phone, Mail, Globe, Wifi, Car, CreditCard, Users, Star, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { AddressData } from '@/types/address';

interface VenueFormData {
  name: string;
  address: string;
  addressData?: AddressData;
  businessType: string[];
  priceTier: string;
  hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  description: string;
  photos: File[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  amenities: string[];
  capacity: number;
  latitude?: number;
  longitude?: number;
}

const businessTypes = [
  'Restaurant', 'Cafe', 'Bar', 'Fast Food', 'Fine Dining', 'Casual Dining',
  'Pizza', 'Sushi', 'Mexican', 'Italian', 'Chinese', 'Indian', 'Thai',
  'American', 'Mediterranean', 'Seafood', 'Steakhouse', 'Bakery', 'Deli'
];

const priceTiers = ['BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY'];

const amenities = [
  'WiFi', 'Parking', 'Outdoor Seating', 'Takeout', 'Delivery', 'Reservations',
  'Credit Cards', 'Cash Only', 'Wheelchair Accessible', 'Pet Friendly',
  'Live Music', 'Sports TV', 'Private Dining', 'Catering', 'Bar', 'Happy Hour'
];

export default function NewVenuePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    address: '',
    addressData: undefined,
    businessType: [],
    priceTier: 'MODERATE',
    hours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    description: '',
    photos: [],
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    amenities: [],
    capacity: 50
  });

  const handleBusinessTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      businessType: prev.businessType.includes(type)
        ? prev.businessType.filter(t => t !== type)
        : [...prev.businessType, type]
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddressChange = (addressData: AddressData) => {
    setFormData(prev => ({
      ...prev,
      address: addressData.formatted,
      addressData: addressData,
      latitude: addressData.coordinates.lat,
      longitude: addressData.coordinates.lng
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Business Details';
      case 3: return 'Photos & Amenities';
      case 4: return 'Review & Create';
      default: return 'Create Venue';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('address', formData.address);
      if (formData.addressData) {
        submitData.append('addressData', JSON.stringify(formData.addressData));
      }
      submitData.append('businessType', JSON.stringify(formData.businessType));
      submitData.append('priceTier', formData.priceTier);
      submitData.append('hours', JSON.stringify(formData.hours));
      submitData.append('description', formData.description);
      submitData.append('contactInfo', JSON.stringify(formData.contactInfo));
      submitData.append('amenities', JSON.stringify(formData.amenities));
      submitData.append('capacity', formData.capacity.toString());
      if (formData.latitude) submitData.append('latitude', formData.latitude.toString());
      if (formData.longitude) submitData.append('longitude', formData.longitude.toString());
      
      // Add photos
      formData.photos.forEach((photo, index) => {
        submitData.append(`photo_${index}`, photo);
      });

      const response = await fetch('/api/merchant/venues', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        router.push('/merchant/venues' as any);
      } else {
        const error = await response.json();
        console.error('Venue creation error:', error);
        alert(`Error: ${error.error || error.message || 'Failed to create venue'}`);
      }
    } catch (error) {
      console.error('Error creating venue:', error);
      alert('Failed to create venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-white/80 hover:text-white mr-6 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back
            </button>
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2 mb-3">
                <Building2 className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">CREATE VENUE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Add</span> New Venue
              </h1>
              <p className="text-xl text-white/80">Create a new restaurant or business location with all the details!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{getStepTitle()}</h2>
            <span className="text-white/80">Step {currentStep} of 4</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="e.g., Downtown Bistro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Price Tier *
                  </label>
                  <select
                    value={formData.priceTier}
                    onChange={(e) => setFormData(prev => ({ ...prev, priceTier: e.target.value }))}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300"
                  >
                    {priceTiers.map(tier => (
                      <option key={tier} value={tier} className="bg-slate-800">
                        {tier.charAt(0) + tier.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Address *
                </label>
                <AddressAutocomplete
                  value={formData.address}
                  onChange={handleAddressChange}
                  placeholder="Start typing your address..."
                  required
                  className="w-full"
                  onError={(error) => console.error('Address error:', error)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                  placeholder="Tell customers about your venue..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Business Details</h3>
              
              <div className="mb-8">
                <h4 className="text-lg font-bold text-white mb-4">Business Type *</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {businessTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleBusinessTypeToggle(type)}
                      className={`p-3 text-sm font-medium rounded-xl border transition-all duration-300 ${
                        formData.businessType.includes(type)
                          ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {formData.businessType.length === 0 && (
                  <p className="text-red-400 text-sm mt-2">Please select at least one business type</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, phone: e.target.value }
                    }))}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, email: e.target.value }
                    }))}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="contact@venue.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.contactInfo.website}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contactInfo: { ...prev.contactInfo, website: e.target.value }
                    }))}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="https://venue.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photos & Amenities */}
          {currentStep === 3 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Photos & Amenities</h3>
              
              {/* Photo Upload */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Venue Photos
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl transition-colors"
                  >
                    <Upload className="w-6 h-6 text-white" />
                    <span className="text-white font-semibold">Upload Photos</span>
                  </button>
                  <p className="text-white/60 mt-2">PNG, JPG up to 10MB each</p>
                </div>
                
                {/* Image Preview */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Venue photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenities.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`p-3 text-sm font-medium rounded-xl border transition-all duration-300 ${
                        formData.amenities.includes(amenity)
                          ? 'bg-green-400/20 border-green-400 text-green-400'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Review & Create</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Venue Summary */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Venue Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">Name:</span>
                        <span className="text-white font-semibold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Price Tier:</span>
                        <span className="text-yellow-400 font-semibold">{formData.priceTier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Business Types:</span>
                        <span className="text-white font-semibold">{formData.businessType.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Capacity:</span>
                        <span className="text-white font-semibold">{formData.capacity} people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Amenities:</span>
                        <span className="text-white font-semibold">{formData.amenities.length} selected</span>
                      </div>
                    </div>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Photos ({formData.photos.length})</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {formData.photos.slice(0, 4).map((photo, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Card */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Customer Preview</h4>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h5 className="text-xl font-bold text-gray-900 mb-2">{formData.name}</h5>
                    <p className="text-gray-600 mb-4">{formData.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {formData.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formData.capacity} capacity
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 1 && (!formData.name || !formData.address)}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || formData.businessType.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Create Venue
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
