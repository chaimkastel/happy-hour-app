'use client';
import { useState } from 'react';
import { Calendar, Clock, Tag, Percent, FileText, Users, Zap } from 'lucide-react';

interface DealFormData {
  title: string;
  description: string;
  discountPercent: number;
  originalPrice?: number;
  discountedPrice?: number;
  conditions: string[];
  validDays: string[];
  validHours: {
    start: string;
    end: string;
  };
  maxRedemptions?: number;
  minOrderAmount?: number;
  validUntil?: string;
  isActive: boolean;
  activationFeeCents: number;
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
  'Valid during happy hour only',
  'Weekend restrictions apply',
  'Holiday exclusions apply'
];

export default function DealForm({ onSubmit, initialData, restaurantId }: {
  onSubmit: (data: DealFormData) => void;
  initialData?: Partial<DealFormData>;
  restaurantId: string;
}) {
  const [formData, setFormData] = useState<DealFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    discountPercent: initialData?.discountPercent || 20,
    originalPrice: initialData?.originalPrice,
    discountedPrice: initialData?.discountedPrice,
    conditions: initialData?.conditions || [],
    validDays: initialData?.validDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    validHours: initialData?.validHours || { start: '17:00', end: '19:00' },
    maxRedemptions: initialData?.maxRedemptions,
    minOrderAmount: initialData?.minOrderAmount,
    validUntil: initialData?.validUntil || '',
    isActive: initialData?.isActive || false,
    activationFeeCents: initialData?.activationFeeCents || 0,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="e.g., Happy Hour Special, Weekend Brunch"
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
          placeholder="Describe the deal, what's included, and any special details..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

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
            className="btn-ghost text-sm"
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
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Valid Hours
          </label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={formData.validHours.start}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                validHours: { ...prev.validHours, start: e.target.value } 
              }))}
              className="input w-24"
            />
            <span>to</span>
            <input
              type="time"
              value={formData.validHours.end}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                validHours: { ...prev.validHours, end: e.target.value } 
              }))}
              className="input w-24"
            />
          </div>
        </div>
        
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
      </div>

      {/* Additional Settings */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Max Redemptions
          </label>
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
      </div>

      {/* Activation Fee */}
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
          Fee charged to customers when they activate this deal (100 cents = $1.00)
        </p>
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

      <button type="submit" className="btn w-full">
        Create Deal
      </button>
    </form>
  );
}
