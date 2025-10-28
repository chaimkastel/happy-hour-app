import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../sections/SectionHeader';
import { DealCard } from './DealCard';
import { SkeletonDealCard } from '../skeletons/SkeletonDealCard';

interface Deal {
  id: string;
  title: string;
  percentOff?: number;
  startAt: string;
  endAt: string;
  image?: string;
  venue: {
    name: string;
    rating?: number;
    businessType?: string[];
  };
}

interface DealRowProps {
  emoji: string;
  title: string;
  subtitle: string;
  deals: Deal[];
  filter?: string;
  loading?: boolean;
}

export const DealRow = ({ emoji, title, subtitle, deals, filter, loading }: DealRowProps) => {
  if (loading) {
    return (
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <SectionHeader emoji={emoji} title={title} subtitle={subtitle} />
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 md:px-2 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonDealCard key={i} />
          ))}
        </div>
      </motion.section>
    );
  }

  if (deals.length === 0) {
    return (
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <SectionHeader emoji={emoji} title={title} subtitle={subtitle} />
        <div className="px-4 md:px-6">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-neutral-500 mb-3">Try these filters:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all">
                Later today
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all">
                ≤3 mi
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all">
                Italian
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }
    
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <SectionHeader 
        emoji={emoji} 
        title={title} 
        subtitle={subtitle}
        href={filter ? `/explore?${filter}` : undefined}
        showNew={title === 'New This Week'}
      />

      {/* Cards with Edge Padding */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.02,
            },
          },
          hidden: {},
        }}
        className="flex gap-4 md:gap-5 overflow-x-auto pb-4 px-1 md:px-2 scrollbar-hide"
      >
        {deals.map((deal, index) => (
          <DealCard key={deal.id} deal={deal} index={index} />
        ))}
      </motion.div>
    </motion.section>
  );
};

