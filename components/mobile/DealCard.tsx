'use client';

import { useState } from 'react';
import { Heart, Star, Clock, MapPin, Eye } from 'lucide-react';
import Image from 'next/image';

interface Deal {
  id: string;
  title: string;
  description: string;
  percentOff: number;
  venue: {
    name: string;
    address: string;
  };
  distance: string;
  rating: number;
  isOpen: boolean;
  category: string;
  imageUrl?: string;
  validUntil?: string;
  featured?: boolean;
}

interface DealCardProps {
  deal: Deal;
  onFavorite?: (dealId: string) => void;
  onView?: (dealId: string) => void;
  isFavorited?: boolean;
  variant?: 'standard' | 'featured';
  className?: string;
}

export default function DealCard({ 
  deal, 
  onFavorite, 
  onView, 
  isFavorited = false, 
  variant = 'standard',
  className = ''
}: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(deal.id);
  };

  const handleView = () => {
    onView?.(deal.id);
  };

  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer ${
        variant === 'featured' ? 'ring-2 ring-orange-200' : ''
      } ${className}`}
      style={{
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 25px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {deal.imageUrl ? (
          <Image
            src={deal.imageUrl}
            alt={deal.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <span className="text-4xl">🍔</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wide">
            {deal.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            size={18} 
            className={isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600'} 
          />
        </button>

        {/* Discount Badge */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
            {deal.percentOff}% OFF
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 line-clamp-1">
            {deal.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {deal.description}
          </p>
        </div>

        {/* Venue and Distance */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <MapPin size={14} />
          <span className="font-medium">{deal.venue.name}</span>
          <span>•</span>
          <span>{deal.distance}</span>
        </div>

        {/* Rating and Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{deal.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock size={14} />
            <span className={deal.isOpen ? 'text-green-600 font-medium' : 'text-gray-500'}>
              {deal.isOpen ? `Open until ${deal.validUntil}` : 'Closed'}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          onClick={handleView}
        >
          <Eye size={16} />
          View Deal
        </button>
      </div>
    </div>
  );
}
