'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Clock, Phone, Globe, Image as ImageIcon } from 'lucide-react';

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false });

interface RestaurantFormData {
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  description: string;
  phone: string;
  website: string;
  businessHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  cuisine: string;
  priceRange: 'budget' | 'moderate' | 'expensive';
  features: string[];
}

const defaultHours = {
  monday: { open: '09:00', close: '22:00', closed: false },
  tuesday: { open: '09:00', close: '22:00', closed: false },
  wednesday: { open: '09:00', close: '22:00', closed: false },
  thursday: { open: '09:00', close: '22:00', closed: false },
  friday: { open: '09:00', close: '23:00', closed: false },
  saturday: { open: '10:00', close: '23:00', closed: false },
  sunday: { open: '10:00', close: '21:00', closed: false },
};

const cuisineOptions = [
  'Italian', 'Japanese', 'Chinese', 'Mexican', 'American', 'Indian', 
  'Thai', 'French', 'Mediterranean', 'Korean', 'Vietnamese', 'Greek',
  'Spanish', 'Middle Eastern', 'Caribbean', 'African', 'Other'
];

const featureOptions = [
  'Outdoor Seating', 'Delivery', 'Takeout', 'Reservations', 'Private Dining',
  'Live Music', 'Happy Hour', 'Weekend Brunch', 'Vegan Options', 'Gluten-Free',
  'Wheelchair Accessible', 'Parking Available', 'Pet Friendly'
];

export default function RestaurantForm({ onSubmit, initialData }: {
  onSubmit: (data: RestaurantFormData) => void;
  initialData?: Partial<RestaurantFormData>;
}) {
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    lat: initialData?.lat || null,
    lng: initialData?.lng || null,
    description: initialData?.description || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    businessHours: initialData?.businessHours || defaultHours,
    cuisine: initialData?.cuisine || '',
    priceRange: initialData?.priceRange || 'moderate',
    features: initialData?.features || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.lat || !formData.lng) newErrors.lat = 'Please select a location on the map';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.cuisine) newErrors.cuisine = 'Please select a cuisine type';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateHours = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Restaurant Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter restaurant name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Cuisine Type *</label>
          <select
            value={formData.cuisine}
            onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
            className={`input w-full ${errors.cuisine ? 'border-red-500' : ''}`}
          >
            <option value="">Select cuisine</option>
            {cuisineOptions.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
          {errors.cuisine && <p className="text-red-500 text-sm mt-1">{errors.cuisine}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={`input w-full h-24 ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Describe your restaurant, specialties, and atmosphere..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="input w-full"
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            className="input w-full"
            placeholder="https://yourrestaurant.com"
          />
        </div>
      </div>

      {/* Address and Location */}
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Address *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className={`input w-full ${errors.address ? 'border-red-500' : ''}`}
          placeholder="Enter full street address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Location on Map *</label>
        <MapPicker
          value={formData.lat && formData.lng ? { lat: formData.lat, lng: formData.lng } : null}
          onChange={(pos) => {
            if (Array.isArray(pos)) {
              setFormData(prev => ({ ...prev, lat: pos[0], lng: pos[1] }));
            } else {
              setFormData(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
            }
          }}
          format="object"
        />
        {errors.lat && <p className="text-red-500 text-sm mt-1">{errors.lat}</p>}
      </div>

      {/* Business Hours */}
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Business Hours
        </label>
        <div className="grid gap-3">
          {Object.entries(formData.businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center gap-3">
              <div className="w-20 text-sm font-medium capitalize">{day}</div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!hours.closed}
                  onChange={(e) => updateHours(day, 'closed', !e.target.checked)}
                  className="mr-2"
                />
                Open
              </label>
              {!hours.closed && (
                <>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => updateHours(day, 'open', e.target.value)}
                    className="input w-24"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => updateHours(day, 'close', e.target.value)}
                    className="input w-24"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Price Range</label>
        <div className="flex gap-4">
          {(['budget', 'moderate', 'expensive'] as const).map(range => (
            <label key={range} className="flex items-center gap-2">
              <input
                type="radio"
                name="priceRange"
                value={range}
                checked={formData.priceRange === range}
                onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value as any }))}
                className="mr-2"
              />
              <span className="capitalize">{range}</span>
              <span className="text-white/60">
                {range === 'budget' ? '($)' : range === 'moderate' ? '($$)' : '($$$)'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium mb-2">Features & Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {featureOptions.map(feature => (
            <label key={feature} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => toggleFeature(feature)}
                className="mr-2"
              />
              <span className="text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn w-full">
        Save Restaurant
      </button>
    </form>
  );
}
