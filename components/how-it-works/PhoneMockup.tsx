'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { HowStep } from '@/lib/howitworks/steps';

interface PhoneMockupProps {
  steps: HowStep[];
  activeStepId: string;
}

export function PhoneMockup({ steps, activeStepId }: PhoneMockupProps) {
  const activeStep = steps.find(step => step.id === activeStepId);
  
  if (!activeStep) return null;

  const { phoneMedia } = activeStep;

  return (
    <div className="sticky top-24 h-[640px] flex items-center justify-center">
      {/* Phone Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-[320px] h-[640px] mx-auto"
      >
        {/* Phone Bezel */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-[3rem] shadow-2xl border-8 border-gray-900">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl" />
          
          {/* Screen Area with Safe Area Padding */}
          <div className="absolute inset-[2px] rounded-[2.5rem] bg-black overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative"
              >
                {phoneMedia.type === 'image' ? (
                  <Image
                    src={phoneMedia.src}
                    alt={phoneMedia.alt}
                    fill
                    sizes="320px"
                    className="object-cover"
                    priority={activeStepId === steps[0].id}
                    loading={activeStepId === steps[0].id ? "eager" : "lazy"}
                  />
                ) : (
                  <video
                    src={phoneMedia.src}
                    autoPlay={phoneMedia.videoProps?.autoplay ?? true}
                    loop={phoneMedia.videoProps?.loop ?? true}
                    muted={phoneMedia.videoProps?.muted ?? true}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Subtle Overlay Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  className="absolute inset-0 bg-white pointer-events-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

