'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle } from 'lucide-react';

interface MerchantSignupData {
  // Account
  email: string;
  password: string;
  confirmPassword: string;
  contactName: string;
  phone: string;
  
  // Business
  businessName: string;
  legalName: string;
  cuisineTags: string[];
  priceTier: string;
  
  // Location
  address: string;
  city: string;
  state: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  
  // Brand
  logoUrl?: string;
  heroUrl?: string;
  
  // Hours (simplified for now)
  hoursJson?: any;
}

interface SignupWizardProps {
  onComplete: (data: MerchantSignupData) => void;
}

const steps = [
  { id: 'account', title: 'Account' },
  { id: 'business', title: 'Business' },
  { id: 'location', title: 'Location' },
  { id: 'brand', title: 'Brand' },
  { id: 'review', title: 'Review' },
];

export function SignupWizard({ onComplete }: SignupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<MerchantSignupData>>({});

  const updateData = (data: Partial<MerchantSignupData>) => {
    setFormData({ ...formData, ...data });
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(formData as MerchantSignupData);
  };

  const currentStepId = steps[currentStep].id;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    idx <= currentStep
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {idx < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-gray-200">
                  {idx < currentStep && (
                    <div className="h-full bg-orange-600 transition-all" />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl p-8 shadow-lg"
        >
          {currentStepId === 'account' && (
            <AccountStep data={formData} updateData={updateData} />
          )}
          {currentStepId === 'business' && (
            <BusinessStep data={formData} updateData={updateData} />
          )}
          {currentStepId === 'location' && (
            <LocationStep data={formData} updateData={updateData} />
          )}
          {currentStepId === 'brand' && (
            <BrandStep data={formData} updateData={updateData} />
          )}
          {currentStepId === 'review' && (
            <ReviewStep data={formData} onSubmit={handleSubmit} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={prev}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        
        {currentStep < steps.length - 1 ? (
          <button
            onClick={next}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all flex items-center gap-2"
          >
            Submit
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Step Components
function AccountStep({ data, updateData }: { data: any; updateData: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
      <p className="text-gray-600 mb-6">Let's get you set up as a merchant</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Email *
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="your@restaurant.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            value={data.password || ''}
            onChange={(e) => updateData({ password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={data.confirmPassword || ''}
            onChange={(e) => updateData({ confirmPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contact Name *
          </label>
          <input
            type="text"
            value={data.contactName || ''}
            onChange={(e) => updateData({ contactName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => updateData({ phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
    </div>
  );
}

function BusinessStep({ data, updateData }: { data: any; updateData: (data: any) => void }) {
  const cuisineOptions = ['Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Vegetarian', 'Vegan', 'Fast Food'];
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Business Details</h2>
      <p className="text-gray-600 mb-6">Tell us about your restaurant</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            value={data.businessName || ''}
            onChange={(e) => updateData({ businessName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Joe's Pizza"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Legal Name (optional)
          </label>
          <input
            type="text"
            value={data.legalName || ''}
            onChange={(e) => updateData({ legalName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Joe's Pizza LLC"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 mb-3">
            Cuisine Type *
          </label>
          <div className="flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <button
                key={cuisine}
                type="button"
                onClick={() => {
                  const tags = data.cuisineTags || [];
                  const newTags = tags.includes(cuisine)
                    ? tags.filter((t: string) => t !== cuisine)
                    : [...tags, cuisine];
                  updateData({ cuisineTags: newTags });
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  data.cuisineTags?.includes(cuisine)
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price Tier *
          </label>
          <div className="flex gap-4">
            {['$', '$$', '$$$'].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => updateData({ priceTier: tier })}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  data.priceTier === tier
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationStep({ data, updateData }: { data: any; updateData: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Location</h2>
      <p className="text-gray-600 mb-6">Where is your restaurant?</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            value={data.address || ''}
            onChange={(e) => updateData({ address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={data.city || ''}
              onChange={(e) => updateData({ city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Brooklyn"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={data.state || ''}
              onChange={(e) => updateData({ state: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="NY"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            value={data.postalCode || ''}
            onChange={(e) => updateData({ postalCode: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="11201"
          />
        </div>
      </div>
    </div>
  );
}

function BrandStep({ data, updateData }: { data: any; updateData: (data: any) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Branding</h2>
      <p className="text-gray-600 mb-6">Show off your restaurant</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Logo (optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Upload logo image</p>
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Choose File
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hero Image (optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Upload hero image</p>
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Choose File
            </button>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            💡 You can add or update images later in your dashboard
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ data, onSubmit }: { data: any; onSubmit: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Double-check your information before submitting</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Account</h3>
          <p className="text-sm text-gray-600">Email: {data.email}</p>
          <p className="text-sm text-gray-600">Contact: {data.contactName}</p>
          <p className="text-sm text-gray-600">Phone: {data.phone}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Business</h3>
          <p className="text-sm text-gray-600">Name: {data.businessName}</p>
          <p className="text-sm text-gray-600">Legal: {data.legalName || 'N/A'}</p>
          <p className="text-sm text-gray-600">Cuisine: {data.cuisineTags?.join(', ') || 'None'}</p>
          <p className="text-sm text-gray-600">Price Tier: {data.priceTier || 'Not set'}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
          <p className="text-sm text-gray-600">
            {data.address}, {data.city}, {data.state} {data.postalCode}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          📋 After submission, your account will be reviewed by our team. We'll email you once you're approved!
        </p>
      </div>
    </div>
  );
}

