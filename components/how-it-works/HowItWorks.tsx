'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneMockup } from './PhoneMockup';
import { StepList } from './StepList';
import type { HowStep } from '@/lib/howitworks/steps';
import { steps as defaultSteps, defaultInitialStepId } from '@/lib/howitworks/steps';

interface HowItWorksProps {
  steps?: HowStep[];
  initialStepId?: string;
  className?: string;
}

export function HowItWorks({ 
  steps = defaultSteps, 
  initialStepId = defaultInitialStepId,
  className = ''
}: HowItWorksProps) {
  const [activeStepId, setActiveStepId] = useState(initialStepId);

  return (
    <section 
      id="how-it-works"
      className={`relative py-20 bg-white ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Grab last-minute happy-hour deals in three quick steps.
          </p>
        </motion.div>

        {/* Desktop: Two-Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Left: Steps */}
          <div className="space-y-6">
            <StepList
              steps={steps}
              activeStepId={activeStepId}
              onStepActivate={setActiveStepId}
            />
          </div>

          {/* Right: Sticky Phone */}
          <PhoneMockup steps={steps} activeStepId={activeStepId} />
        </div>

        {/* Mobile: Stacked Layout */}
        <div className="lg:hidden space-y-8">
          {/* Phone Carousel */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mx-4 px-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex-shrink-0 w-[280px] snap-center"
                >
                  <motion.div
                    className="relative w-[280px] h-[560px] mx-auto"
                  >
                    {/* Phone Frame */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] shadow-2xl border-8 border-gray-900">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl" />
                      <div className="absolute inset-[2px] rounded-[2rem] bg-black overflow-hidden">
                        {/* Image will be added when assets are ready */}
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {step.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Steps List */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  const element = document.getElementById(`mobile-step-${step.id}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                  setActiveStepId(step.id);
                }}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                  activeStepId === step.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {step.badge && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold mb-2 inline-block">
                    {step.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="text-sm text-gray-600 mb-2">
                    {step.subtitle}
                  </p>
                )}
                <p className="text-gray-700 text-sm">
                  {step.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <a
            href="/explore"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-lg font-semibold rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            See today's deals
          </a>
        </motion.div>
      </div>
    </section>
  );
}

