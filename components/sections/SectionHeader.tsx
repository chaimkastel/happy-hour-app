import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  emoji: string;
  title: string;
  subtitle: string;
  href?: string;
  showNew?: boolean;
}

export const SectionHeader = ({ emoji, title, subtitle, href, showNew }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 px-4 md:px-6">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
            {emoji} {title}
          </h2>
          {showNew && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
              NEW
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-500">{subtitle}</p>
      </div>
      {href && (
        <Link 
          href={href}
          className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
          aria-label={`View all ${title}`}
        >
          See All
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

