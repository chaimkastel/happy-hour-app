'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Heart, QrCode, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  actionLink: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'explore',
    title: 'Discover Amazing Deals',
    description: 'Browse restaurants and find incredible discounts on your favorite cuisines.',
    icon: MapPin,
    action: 'Start Exploring',
    actionLink: '/explore',
  },
  {
    id: 'favorites',
    title: 'Save Your Favorites',
    description: 'Heart deals you love to easily find them later in your favorites.',
    icon: Heart,
    action: 'View Favorites',
    actionLink: '/favorites',
  },
  {
    id: 'claim',
    title: 'Claim & Redeem',
    description: 'Claim deals to get vouchers and redeem them at restaurants using QR codes.',
    icon: QrCode,
    action: 'Learn More',
    actionLink: '/how-it-works',
  },
  {
    id: 'review',
    title: 'Share Your Experience',
    description: 'Rate restaurants and share your dining experience with the community.',
    icon: Star,
    action: 'Leave a Review',
    actionLink: '/account',
  },
];

interface OnboardingGuideProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export default function OnboardingGuide({ isVisible, onDismiss }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem('onboarding_completed');
    if (hasCompleted) {
      setIsCompleted(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsCompleted(true);
    onDismiss();
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsCompleted(true);
    onDismiss();
  };

  if (!isVisible || isCompleted) {
    return null;
  }

  const currentStepData = onboardingSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        >
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Step Navigation */}
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ←
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

