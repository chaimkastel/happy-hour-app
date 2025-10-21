'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Image as ImageIcon, 
  Clock, 
  Target, 
  Eye, 
  Send,
  AlertCircle,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Upload,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { syncServerTime, getServerTime, formatTimeRemaining } from '@/lib/time-sync';

// Unified Zod schema for the entire form
const dealFormSchema = z.object({
  // Details step
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  image: z.instanceof(File).optional(),
  
  // Schedule step
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  daysOfWeek: z.array(z.string()).min(1, 'At least one day must be selected'),
  
  // Limits step
  maxRedemptions: z.number().min(1, 'Must allow at least 1 redemption').optional(),
  minSpend: z.number().min(0, 'Minimum spend cannot be negative').optional(),
  percentOff: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
  
  // Publish step
  status: z.enum(['DRAFT', 'ACTIVE']),
});

type DealFormData = z.infer<typeof dealFormSchema>;

interface DealStepperProps {
  onComplete?: (data: DealFormData) => void;
  initialData?: Partial<DealFormData>;
  dealId?: string;
}

const steps = [
  { id: 1, title: 'Details', icon: ImageIcon, description: 'Basic deal information' },
  { id: 2, title: 'Schedule', icon: Clock, description: 'When the deal runs' },
  { id: 3, title: 'Limits', icon: Target, description: 'Redemption limits & rules' },
  { id: 4, title: 'Preview', icon: Eye, description: 'Review your deal' },
  { id: 5, title: 'Publish', icon: Send, description: 'Make it live' },
];

export default function DealStepper({ onComplete, initialData, dealId }: DealStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [serverTime, setServerTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState(false);

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      daysOfWeek: [],
      maxRedemptions: undefined,
      minSpend: undefined,
      percentOff: 10,
      status: 'DRAFT',
      ...initialData,
    },
  });

  useEffect(() => {
    syncServerTime();
    const interval = setInterval(() => {
      setServerTime(getServerTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    form.setValue('image', file);
  };

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: DealFormData) => {
    setLoading(true);
    try {
      if (onComplete) {
        await onComplete(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const formData = form.getValues();
    
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Title *
              </label>
              <Input
                {...form.register('title')}
                placeholder="e.g., Happy Hour Special"
                className={cn(form.formState.errors.title && 'border-red-500')}
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...form.register('description')}
                rows={4}
                placeholder="Describe your deal..."
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                  form.formState.errors.description && 'border-red-500'
                )}
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Deal preview"
                      width={200}
                      height={200}
                      className="mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        form.setValue('image', undefined);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload a deal image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <Input
                  type="date"
                  {...form.register('startDate')}
                  className={cn(form.formState.errors.startDate && 'border-red-500')}
                />
                {form.formState.errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <Input
                  type="date"
                  {...form.register('endDate')}
                  className={cn(form.formState.errors.endDate && 'border-red-500')}
                />
                {form.formState.errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <Input
                  type="time"
                  {...form.register('startTime')}
                  className={cn(form.formState.errors.startTime && 'border-red-500')}
                />
                {form.formState.errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.startTime.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <Input
                  type="time"
                  {...form.register('endTime')}
                  className={cn(form.formState.errors.endTime && 'border-red-500')}
                />
                {form.formState.errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days of Week *
              </label>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const days = form.getValues('daysOfWeek');
                      const newDays = days.includes(day)
                        ? days.filter(d => d !== day)
                        : [...days, day];
                      form.setValue('daysOfWeek', newDays);
                    }}
                    className={cn(
                      'p-2 text-sm rounded-md border',
                      form.getValues('daysOfWeek').includes(day)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {form.formState.errors.daysOfWeek && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.daysOfWeek.message}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage *
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                {...form.register('percentOff', { valueAsNumber: true })}
                className={cn(form.formState.errors.percentOff && 'border-red-500')}
              />
              {form.formState.errors.percentOff && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.percentOff.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Redemptions (optional)
              </label>
              <Input
                type="number"
                min="1"
                {...form.register('maxRedemptions', { valueAsNumber: true })}
                placeholder="Leave empty for unlimited"
                className={cn(form.formState.errors.maxRedemptions && 'border-red-500')}
              />
              {form.formState.errors.maxRedemptions && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.maxRedemptions.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Spend (optional)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...form.register('minSpend', { valueAsNumber: true })}
                placeholder="e.g., 25.00"
                className={cn(form.formState.errors.minSpend && 'border-red-500')}
              />
              {form.formState.errors.minSpend && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.minSpend.message}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
        const timeRemaining = endDateTime.getTime() - serverTime;
        
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Deal Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Deal preview"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold">{formData.title}</h3>
                    <p className="text-gray-600">{formData.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {formData.percentOff}% OFF
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTimeRemaining(timeRemaining)} remaining
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formData.startDate} - {formData.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{formData.startTime} - {formData.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {formData.maxRedemptions ? `${formData.maxRedemptions} max` : 'Unlimited'}
                      </span>
                    </div>
                    {formData.minSpend && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>Min ${formData.minSpend}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Available Days:</h4>
                    <div className="flex gap-1">
                      {formData.daysOfWeek.map((day) => (
                        <span
                          key={day}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready to Publish!</h3>
              <p className="text-gray-600 mb-6">
                Your deal looks great. Choose how you'd like to publish it.
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => form.setValue('status', 'DRAFT')}
                className={cn(
                  'w-full p-4 border rounded-lg text-left transition-colors',
                  form.getValues('status') === 'DRAFT'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Save as Draft</h4>
                    <p className="text-sm text-gray-600">Save for later editing</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => form.setValue('status', 'ACTIVE')}
                className={cn(
                  'w-full p-4 border rounded-lg text-left transition-colors',
                  form.getValues('status') === 'ACTIVE'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Send className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Publish Now</h4>
                    <p className="text-sm text-gray-600">Make your deal live immediately</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                      isActive
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-sm font-medium',
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-4',
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={nextStep}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            loading={loading}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {form.getValues('status') === 'ACTIVE' ? 'Publish Deal' : 'Save Draft'}
          </Button>
        )}
      </div>
    </div>
  );
}
