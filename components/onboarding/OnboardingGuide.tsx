'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Heart, QrCode, Star, ArrowRight, Sparkles } from 'lucide-react';

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
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-gradient-to-br from-white via-orange-50/30 to-pink-50/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative border border-slate-200"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 p-6">
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentStepData.title}
              </h2>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 bg-white/50">
            <div className="flex justify-center space-x-2">
              {onboardingSteps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`h-2 rounded-full transition-all ${
                    index <= currentStep 
                      ? 'bg-orange-500 w-8' 
                      : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-center text-slate-700 leading-relaxed mb-8">
              {currentStepData.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSkip}
                className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-slate-400 transition-all"
              >
                Skip
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Step Navigation */}
          {currentStep > 0 && (
            <motion.button
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="absolute left-8 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
            >
              <ArrowRight className="w-5 h-5 text-slate-700 rotate-180" />
            </motion.button>
          )}
          {currentStep < onboardingSteps.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
            >
              <ArrowRight className="w-5 h-5 text-slate-700" />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

