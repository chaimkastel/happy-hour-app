'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Image as ImageIcon, Gift, Calendar, MapPin } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  href?: string;
}

interface OnboardingChecklistProps {
  merchantId: string;
  initialCompleted: string[];
}

export function OnboardingChecklist({ merchantId, initialCompleted }: OnboardingChecklistProps) {
  const [completed, setCompleted] = useState<string[]>(initialCompleted);

  const checklistItems: ChecklistItem[] = [
    {
      id: 'verify-hours',
      title: 'Verify your hours',
      description: 'Make sure your restaurant hours are accurate',
      icon: Clock,
      completed: completed.includes('verify-hours'),
      href: '/merchant/profile#hours'
    },
    {
      id: 'set-tax-tip',
      title: 'Set tax & tip prefs',
      description: 'Configure your payment preferences',
      icon: Calendar,
      completed: completed.includes('set-tax-tip'),
      href: '/merchant/billing'
    },
    {
      id: 'add-scheduled-deal',
      title: 'Add your first Scheduled Happy Hour',
      description: 'Create a recurring happy hour deal',
      icon: Gift,
      completed: completed.includes('add-scheduled-deal'),
      href: '/merchant/deals/new'
    },
    {
      id: 'try-instant-boost',
      title: 'Try an Instant Boost deal',
      description: 'Create a spontaneous deal to attract diners now',
      icon: Gift,
      completed: completed.includes('try-instant-boost'),
      href: '/merchant/boost'
    },
    {
      id: 'upload-hero-photo',
      title: 'Upload a hero photo',
      description: 'Add a beautiful banner image to your profile',
      icon: ImageIcon,
      completed: completed.includes('upload-hero-photo'),
      href: '/merchant/profile#branding'
    }
  ];

  const completedCount = completed.length;
  const totalItems = checklistItems.length;
  const progress = (completedCount / totalItems) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-900">Getting Started</h2>
          <span className="text-sm font-semibold text-slate-600">
            {completedCount} of {totalItems} completed
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        {checklistItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                item.completed
                  ? 'border-green-200 bg-green-50'
                  : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50'
              }`}
            >
              <div className="mt-1">
                {item.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-400" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Icon className="w-5 h-5 text-slate-600" />
                  <h3 className={`font-semibold ${item.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-bold text-green-900">🎉 All set!</h3>
              <p className="text-sm text-green-700">You're ready to start attracting diners!</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
