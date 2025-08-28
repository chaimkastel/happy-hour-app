'use client';
import { useState } from 'react';
import { Calendar, Clock, Tag, Percent, FileText, Users, Zap, DollarSign, Timer } from 'lucide-react';

interface EnhancedDealFormData {
  title: string;
  description: string;
  dealType: 'quiet_time' | 'happy_blast';
  
  // Common fields
  discountPercent: number;
  originalPrice?: number;
  discountedPrice?: number;
  conditions: string[];
  validDays: string[];
  maxRedemptions?: number;
  minOrderAmount?: number;
  validUntil?: string;
  isActive: boolean;
  activationFeeCents: number;
  
  // Quiet time specific
  quietTimeStart: string;
  quietTimeEnd: string;
  
  // Happy blast specific
  hourlyRate: number;
  durationHours: number;
  instantActivation: boolean;
}

const dayOptions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const conditionOptions = [
  'Dine-in only',
  'Cannot combine with other offers',
  'Valid for first-time customers only',
  'Minimum party size required',
  'Reservation required',
  'Valid on specific menu items only',
  'Excludes alcohol',
  'Weekend restrictions apply',
  'Holiday exclusions apply',
  'Valid during specified quiet hours only',
  'Instant activation for happy blast deals'
];

export default function EnhancedDealForm({ onSubmit, initialData, restaurantId }: {
  onSubmit: (data: EnhancedDealFormData) => void;
  initialData?: Partial<EnhancedDealFormData>;
  restaurantId: string;
}) {
  const [formData, setFormData] = useState<EnhancedDealFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dealType: initialData?.dealType || 'quiet_time',
    discountPercent: initialData?.discountPercent || 20,
    originalPrice: initialData?.originalPrice,
    discountedPrice: initialData?.discountedPrice,
    conditions: initialData?.conditions || [],
    validDays: initialData?.validDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    maxRedemptions: initialData?.maxRedemptions,
    minOrderAmount: initialData?.minOrderAmount,
    validUntil: initialData?.validUntil || '',
    isActive: initialData?.isActive || false,
    activationFeeCents: initialData?.activationFeeCents || 0,
    quietTimeStart: initialData?.quietTimeStart || '14:00',
    quietTimeEnd: initialData?.quietTimeEnd || '17:00',
    hourlyRate: initialData?.hourlyRate || 50,
    durationHours: initialData?.durationHours || 1,
    instantActivation: initialData?.instantActivation || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Deal title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.discountPercent < 1 || formData.discountPercent > 100) {
      newErrors.discountPercent = 'Discount must be between 1% and 100%';
    }
    if (formData.validDays.length === 0) newErrors.validDays = 'Select at least one valid day';
    
    if (formData.dealType === 'quiet_time') {
      if (!formData.quietTimeStart || !formData.quietTimeEnd) {
        newErrors.quietTime = 'Please set quiet time hours';
      }
    }
    
    if (formData.dealType === 'happy_blast') {
      if (formData.hourlyRate < 1) newErrors.hourlyRate = 'Hourly rate must be at least $1';
      if (formData.durationHours < 0.5 || formData.durationHours > 24) {
        newErrors.durationHours = 'Duration must be between 0.5 and 24 hours';
      }
    }
    
    if (formData.maxRedemptions && formData.maxRedemptions < 1) {
      newErrors.maxRedemptions = 'Max redemptions must be at least 1';
    }
    if (formData.minOrderAmount && formData.minOrderAmount < 0) {
      newErrors.minOrderAmount = 'Minimum order amount cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      validDays: prev.validDays.includes(day)
        ? prev.validDays.filter(d => d !== day)
        : [...prev.validDays, day]
    }));
  };

  const toggleCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const calculateDiscountedPrice = () => {
    if (formData.originalPrice && formData.discountPercent) {
      return formData.originalPrice * (1 - formData.discountPercent / 100);
    }
    return 0;
  };

  const calculateHappyBlastCost = () => {
    return formData.hourlyRate * formData.durationHours;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Deal Type Selection */}
      <div className="bg-gray-700/50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-3 text-white">Deal Type *</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            formData.dealType === 'quiet_time' 
              ? 'border-blue-500 bg-blue-500/20' 
              : 'border-gray-600 hover:border-gray-500'
          }`}>
            <input
              type="radio"
              name="dealType"
              value="quiet_time"
              checked={formData.dealType === 'quiet_time'}
              onChange={(e) => setFormData(prev => ({ ...prev, dealType: e.target.value as any }))}
              className="mr-3"
            />
            <div>
              <div className="font-semibold text-white">Quiet Time Discount</div>
              <div className="text-sm text-white/60">Scheduled discounts during slow periods</div>
            </div>
          </label>
          
          <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            formData.dealType === 'happy_blast' 
              ? 'border-green-500 bg-green-500/20' 
              : 'border-gray-600 hover:border-gray-500'
          }`}>
            <input
              type="radio"
              name="dealType"
              value="happy_blast"
              checked={formData.dealType === 'happy_blast'}
              onChange={(e) => setFormData(prev => ({ ...prev, dealType: e.target.value as any }))}
              className="mr-3"
            />
            <div>
              <div className="font-semibold text-white">Happy Blast</div>
              <div className="text-sm text-white/60">Instant activation with hourly pricing</div>
            </div>
          </label>
        </div>
      </div>

      {/* Basic Deal Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Deal Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
            placeholder={formData.dealType === 'quiet_time' ? 'e.g., Afternoon Quiet Time Special' : 'e.g., Happy Blast - Instant 30% Off'}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Discount Percentage *
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={formData.discountPercent}
            onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: parseInt(e.target.value) || 0 }))}
            className={`input w-full ${errors.discountPercent ? 'border-red-500' : ''}`}
            placeholder="20"
          />
          {errors.discountPercent && <p className="text-red-500 text-sm mt-1">{errors.discountPercent}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={`input w-full h-24 ${errors.description ? 'border-red-500' : ''}`}
          placeholder={formData.dealType === 'quiet_time' 
            ? "Describe the quiet time deal, what's included, and why customers should visit during these hours..."
            : "Describe the happy blast deal, what customers get, and any special conditions..."
          }
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Deal Type Specific Fields */}
      {formData.dealType === 'quiet_time' && (
        <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Quiet Time Settings
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Start Time</label>
              <input
                type="time"
                value={formData.quietTimeStart}
                onChange={(e) => setFormData(prev => ({ ...prev, quietTimeStart: e.target.value }))}
                className="input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-white">End Time</label>
              <input
                type="time"
                value={formData.quietTimeEnd}
                onChange={(e) => setFormData(prev => ({ ...prev, quietTimeEnd: e.target.value }))}
                className="input w-full"
              />
            </div>
          </div>
          
          {errors.quietTime && <p className="text-red-500 text-sm mt-2">{errors.quietTime}</p>}
          
          <div className="mt-3 p-3 bg-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-200">
              💡 <strong>Quiet Time Strategy:</strong> This deal will automatically activate during the specified hours 
              when business is typically slow. Perfect for filling empty tables and increasing revenue during off-peak times.
            </p>
          </div>
        </div>
      )}

      {formData.dealType === 'happy_blast' && (
        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
          <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Happy Blast Settings
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Hourly Rate ($)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                className={`input w-full ${errors.hourlyRate ? 'border-red-500' : ''}`}
                placeholder="50.00"
              />
              {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Duration (hours)
              </label>
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={formData.durationHours}
                onChange={(e) => setFormData(prev => ({ ...prev, durationHours: parseFloat(e.target.value) || 0 }))}
                className={`input w-full ${errors.durationHours ? 'border-red-500' : ''}`}
                placeholder="2.0"
              />
              {errors.durationHours && <p className="text-red-500 text-sm mt-1">{errors.durationHours}</p>}
            </div>
            
            <div className="flex items-end">
              <div className="text-center w-full">
                <div className="text-sm text-white/60 mb-1">Total Cost</div>
                <div className="text-2xl font-bold text-green-400">
                  ${calculateHappyBlastCost().toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-green-500/20 rounded-lg">
            <p className="text-sm text-green-200">
              ⚡ <strong>Happy Blast Strategy:</strong> Instant activation deals that customers can activate immediately. 
              Perfect for filling last-minute tables and creating urgency. Cost: ${formData.hourlyRate}/hour × {formData.durationHours} hours = ${calculateHappyBlastCost().toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Pricing */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Original Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.originalPrice || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              originalPrice: parseFloat(e.target.value) || undefined 
            }))}
            className="input w-full"
            placeholder="25.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Discounted Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.discountedPrice || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              discountedPrice: parseFloat(e.target.value) || undefined 
            }))}
            className="input w-full"
            placeholder="20.00"
          />
        </div>
        
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              const discounted = calculateDiscountedPrice();
              if (discounted > 0) {
                setFormData(prev => ({ ...prev, discountedPrice: Math.round(discounted * 100) / 100 }));
              }
            }}
            className="btn-ghost text-sm w-full"
          >
            Calculate
          </button>
        </div>
      </div>

      {/* Validity Schedule */}
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Valid Days *
        </label>
        <div className="grid grid-cols-4 gap-3">
          {dayOptions.map(day => (
            <label key={day} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.validDays.includes(day)}
                onChange={() => toggleDay(day)}
                className="mr-2"
              />
              <span className="text-sm capitalize">{day.slice(0, 3)}</span>
            </label>
          ))}
        </div>
        {errors.validDays && <p className="text-red-500 text-sm mt-1">{errors.validDays}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Valid Until</label>
          <input
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
            className="input w-full"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Max Redemptions</label>
          <input
            type="number"
            min="1"
            value={formData.maxRedemptions || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              maxRedemptions: parseInt(e.target.value) || undefined 
            }))}
            className="input w-full"
            placeholder="Unlimited"
          />
          {errors.maxRedemptions && <p className="text-red-500 text-sm mt-1">{errors.maxRedemptions}</p>}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Minimum Order Amount ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.minOrderAmount || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              minOrderAmount: parseFloat(e.target.value) || undefined 
            }))}
            className="input w-full"
            placeholder="No minimum"
          />
          {errors.minOrderAmount && <p className="text-red-500 text-sm mt-1">{errors.minOrderAmount}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Activation Fee (cents)
          </label>
          <input
            type="number"
            min="0"
            value={formData.activationFeeCents}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              activationFeeCents: parseInt(e.target.value) || 0 
            }))}
            className="input w-full"
            placeholder="0"
          />
          <p className="text-sm text-white/60 mt-1">
            Fee charged to customers when they activate this deal
          </p>
        </div>
      </div>

      {/* Conditions */}
      <div>
        <label className="block text-sm font-medium mb-2">Terms & Conditions</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conditionOptions.map(condition => (
            <label key={condition} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.conditions.includes(condition)}
                onChange={() => toggleCondition(condition)}
                className="mr-2"
              />
              <span className="text-sm">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="mr-2"
          />
          <span>Activate deal immediately</span>
        </label>
      </div>

      <button type="submit" className="btn w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
        Create {formData.dealType === 'quiet_time' ? 'Quiet Time' : 'Happy Blast'} Deal
      </button>
    </form>
  );
}

