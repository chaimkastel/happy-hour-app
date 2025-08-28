'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Image, Clock, Calendar, Repeat, Zap, Target, DollarSign, MapPin, Users, Eye, EyeOff, Plus, X, Save, Sparkles, Flame, Gift, Crown, Star, AlertCircle, CheckCircle } from 'lucide-react';

interface DealForm {
  title: string;
  description: string;
  percentOff: number;
  dealType: 'FLASH' | 'SCHEDULED' | 'RECURRING' | 'STANDARD';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  maxRedemptions: number;
  minOrderAmount?: number;
  applicableItems: string;
  terms: string;
  images: File[];
  isActive: boolean;
  // Flash deal specific
  flashDuration?: number; // in minutes
  // Scheduled deal specific
  scheduleDays: string[];
  scheduleFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  scheduleEndDate?: string;
  // Recurring deal specific
  recurringPattern: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recurringInterval: number;
  recurringEndDate?: string;
}

const dealTypes = [
  { id: 'FLASH', name: 'Flash Deal', icon: Zap, description: 'One-time deal for a specific duration', color: 'from-red-500 to-orange-500' },
  { id: 'SCHEDULED', name: 'Scheduled Deal', icon: Calendar, description: 'Recurring deal on specific days/times', color: 'from-blue-500 to-purple-500' },
  { id: 'RECURRING', name: 'Recurring Deal', icon: Repeat, description: 'Automatically repeating deal', color: 'from-green-500 to-teal-500' },
  { id: 'STANDARD', name: 'Standard Deal', icon: Target, description: 'Regular ongoing deal', color: 'from-gray-500 to-slate-500' }
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CreateDealPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<DealForm>({
    title: '',
    description: '',
    percentOff: 20,
    dealType: 'STANDARD',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    maxRedemptions: 100,
    minOrderAmount: 0,
    applicableItems: '',
    terms: '',
    images: [],
    isActive: true,
    flashDuration: 60,
    scheduleDays: [],
    scheduleFrequency: 'WEEKLY',
    scheduleEndDate: '',
    recurringPattern: 'DAILY',
    recurringInterval: 1,
    recurringEndDate: ''
  });

  const handleInputChange = (field: keyof DealForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('percentOff', form.percentOff.toString());
      formData.append('dealType', form.dealType);
      formData.append('startDate', form.startDate);
      formData.append('endDate', form.endDate);
      formData.append('startTime', form.startTime);
      formData.append('endTime', form.endTime);
      formData.append('maxRedemptions', form.maxRedemptions.toString());
      formData.append('minOrderAmount', (form.minOrderAmount || 0).toString());
      formData.append('applicableItems', form.applicableItems);
      formData.append('terms', form.terms);
      formData.append('isActive', form.isActive.toString());
      
      // Add deal type specific data
      if (form.dealType === 'FLASH') {
        formData.append('flashDuration', (form.flashDuration || 60).toString());
      } else if (form.dealType === 'SCHEDULED') {
        formData.append('scheduleDays', JSON.stringify(form.scheduleDays));
        formData.append('scheduleFrequency', form.scheduleFrequency);
        formData.append('scheduleEndDate', form.scheduleEndDate || '');
      } else if (form.dealType === 'RECURRING') {
        formData.append('recurringPattern', form.recurringPattern);
        formData.append('recurringInterval', form.recurringInterval.toString());
        formData.append('recurringEndDate', form.recurringEndDate || '');
      }
      
      // Add images
      form.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await fetch('/api/merchant/deals', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/merchant/deals');
      } else {
        alert('Failed to create deal. Please try again.');
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Error creating deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Deal Type & Basic Info';
      case 2: return 'Deal Details & Timing';
      case 3: return 'Images & Terms';
      case 4: return 'Review & Publish';
      default: return 'Create Deal';
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
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">CREATE DEAL</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                🚀 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Create</span> Amazing Deal
              </h1>
              <p className="text-xl text-white/80">Set up a promotion that will attract customers and boost your revenue!</p>
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
          {/* Step 1: Deal Type & Basic Info */}
          {currentStep === 1 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Choose Deal Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {dealTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleInputChange('dealType', type.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        form.dealType === type.id
                          ? 'border-yellow-400 bg-yellow-400/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{type.name}</h4>
                      <p className="text-white/70">{type.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="e.g., Happy Hour Special, Lunch Rush Deal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Discount Percentage *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={form.percentOff}
                      onChange={(e) => handleInputChange('percentOff', parseInt(e.target.value))}
                      className="w-full px-6 py-4 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    />
                    <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/60">%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                  placeholder="Describe your deal in detail..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Deal Details & Timing */}
          {currentStep === 2 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Deal Details & Timing</h3>
              
              {/* Deal Type Specific Settings */}
              {form.dealType === 'FLASH' && (
                <div className="mb-6 p-6 bg-red-500/20 border border-red-500/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-red-400" />
                    <h4 className="text-xl font-bold text-white">Flash Deal Settings</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2">Duration (minutes)</label>
                      <input
                        type="number"
                        min="5"
                        max="1440"
                        value={form.flashDuration}
                        onChange={(e) => handleInputChange('flashDuration', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">Flash deals are time-sensitive and create urgency!</span>
                    </div>
                  </div>
                </div>
              )}

              {form.dealType === 'SCHEDULED' && (
                <div className="mb-6 p-6 bg-blue-500/20 border border-blue-500/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    <h4 className="text-xl font-bold text-white">Scheduled Deal Settings</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2">Frequency</label>
                      <select
                        value={form.scheduleFrequency}
                        onChange={(e) => handleInputChange('scheduleFrequency', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white"
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2">End Date</label>
                      <input
                        type="date"
                        value={form.scheduleEndDate}
                        onChange={(e) => handleInputChange('scheduleEndDate', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white/90 mb-2">Active Days</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weekDays.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const newDays = form.scheduleDays.includes(day)
                              ? form.scheduleDays.filter(d => d !== day)
                              : [...form.scheduleDays, day];
                            handleInputChange('scheduleDays', newDays);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            form.scheduleDays.includes(day)
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {form.dealType === 'RECURRING' && (
                <div className="mb-6 p-6 bg-green-500/20 border border-green-500/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Repeat className="w-6 h-6 text-green-400" />
                    <h4 className="text-xl font-bold text-white">Recurring Deal Settings</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2">Pattern</label>
                      <select
                        value={form.recurringPattern}
                        onChange={(e) => handleInputChange('recurringPattern', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white"
                      >
                        <option value="HOURLY">Hourly</option>
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2">Interval</label>
                      <input
                        type="number"
                        min="1"
                        value={form.recurringInterval}
                        onChange={(e) => handleInputChange('recurringInterval', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white/90 mb-2">End Date</label>
                      <input
                        type="date"
                        value={form.recurringEndDate}
                        onChange={(e) => handleInputChange('recurringEndDate', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Timing Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Max Redemptions *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.maxRedemptions}
                    onChange={(e) => handleInputChange('maxRedemptions', parseInt(e.target.value))}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Minimum Order Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.minOrderAmount || 0}
                      onChange={(e) => handleInputChange('minOrderAmount', parseFloat(e.target.value))}
                      className="w-full px-6 py-4 pl-8 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white transition-all duration-300"
                    />
                    <DollarSign className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images & Terms */}
          {currentStep === 3 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Images & Terms</h3>
              
              {/* Image Upload */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Deal Images
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
                    <span className="text-white font-semibold">Upload Images</span>
                  </button>
                  <p className="text-white/60 mt-2">PNG, JPG up to 10MB each</p>
                </div>
                
                {/* Image Preview */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {form.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Deal image ${index + 1}`}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-3">
                    Applicable Items
                  </label>
                  <input
                    type="text"
                    value={form.applicableItems}
                    onChange={(e) => handleInputChange('applicableItems', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                    placeholder="e.g., All drinks, Pizza only, etc."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('isActive', !form.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.isActive ? 'bg-yellow-400' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        form.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-white font-semibold">Activate deal immediately</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/90 mb-3">
                  Terms & Conditions
                </label>
                <textarea
                  rows={4}
                  value={form.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white placeholder-white/60 transition-all duration-300"
                  placeholder="Enter terms and conditions for this deal..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Publish */}
          {currentStep === 4 && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Review & Publish</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Deal Summary */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Deal Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">Title:</span>
                        <span className="text-white font-semibold">{form.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Discount:</span>
                        <span className="text-green-400 font-bold">{form.percentOff}% OFF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Type:</span>
                        <span className="text-yellow-400 font-semibold">{form.dealType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Max Redemptions:</span>
                        <span className="text-white font-semibold">{form.maxRedemptions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Duration:</span>
                        <span className="text-white font-semibold">{form.startDate} to {form.endDate}</span>
                      </div>
                    </div>
                  </div>

                  {form.images.length > 0 && (
                    <div className="bg-white/5 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Images ({form.images.length})</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {form.images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
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
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-xl font-bold text-gray-900">{form.title}</h5>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {form.percentOff}% OFF
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{form.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {form.maxRedemptions} available
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {form.startDate} - {form.endDate}
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
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
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
                      Create Deal
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