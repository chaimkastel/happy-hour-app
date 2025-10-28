'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { HowStep } from '@/lib/howitworks/steps';

interface StepListProps {
  steps: HowStep[];
  activeStepId: string;
  onStepActivate: (stepId: string) => void;
  onStepHover?: (stepId: string | null) => void;
}

export function StepList({ steps, activeStepId, onStepActivate, onStepHover }: StepListProps) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const isActive = step.id === activeStepId;
        
        return (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            isActive={isActive}
            onActivate={() => onStepActivate(step.id)}
            onHover={onStepHover}
          />
        );
      })}
    </div>
  );
}

function StepCard({ 
  step, 
  index, 
  isActive, 
  onActivate,
  onHover
}: { 
  step: HowStep; 
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onHover?: (stepId: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.6 });

  React.useEffect(() => {
    if (isInView && !isActive) {
      onActivate();
    }
  }, [isInView, isActive, onActivate]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isActive ? 1.02 : 1
      }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1 
      }}
      className={`
        relative rounded-2xl border-2 p-6 transition-all duration-300
        ${isActive 
          ? 'border-orange-500 bg-orange-50/50 shadow-lg' 
          : 'border-gray-200 bg-white shadow-sm hover:border-orange-200'
        }
      `}
      onClick={onActivate}
      onMouseEnter={() => onHover?.(step.id)}
      onMouseLeave={() => onHover?.(null)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      aria-current={isActive ? "step" : undefined}
      aria-label={`${step.title}: ${step.description}`}
    >
      {/* Badge */}
      {step.badge && (
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            {step.badge}
          </span>
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className={`text-2xl font-bold mb-2 ${isActive ? 'text-orange-900' : 'text-gray-900'}`}>
        {step.title}
      </h3>

      {/* Subtitle */}
      {step.subtitle && (
        <p className="text-sm text-gray-600 mb-3">
          {step.subtitle}
        </p>
      )}

      {/* Description */}
      <p className="text-gray-700 leading-relaxed">
        {step.description}
      </p>

      {/* CTA */}
      {step.cta && isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <a
            href={step.cta.href}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
          >
            {step.cta.label}
          </a>
        </motion.div>
      )}

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-pink-500 rounded-l-2xl"
          layoutId="activeIndicator"
        />
      )}
    </motion.div>
  );
}

