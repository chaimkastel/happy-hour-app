'use client';
import Link from 'next/link';
import MapMini from './MapMini';
import { Clock, MapPin, Star, Heart } from 'lucide-react';

export default function DealCard({ d }: { d: any }) {
  // Handle both old and new data structures
  const venue = d.venue || d.restaurant;
  const discount = d.percentOff || d.discount || d.discountPercent || 0;
  const isActive = d.status === 'LIVE' || d.isActive;
  const claimedRecently = typeof d.claimsLastHour === 'number' ? d.claimsLastHour : undefined;
  const showMiniMap = venue?.latitude && venue?.longitude;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105">
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&auto=format&q=80)`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50 group-hover:from-black/40 group-hover:to-black/60 transition-all duration-300"></div>
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            {discount}% OFF
          </span>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:text-red-400 transition-colors p-2 rounded-full shadow-lg hover:bg-white/30">
          <Heart className="w-4 h-4" />
        </button>

        {/* Restaurant Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">
            {venue?.name || 'Restaurant'}
          </h3>
          <p className="text-white/90 text-sm flex items-center gap-2">
            <span>{venue?.businessType || 'Restaurant'}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-white/40'}`} />
              ))}
              <span className="ml-1">4.{Math.floor(Math.random() * 3) + 2}</span>
            </div>
          </p>
        </div>
      </div>

      {/* Deal Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 dark:text-slate-400 text-sm">
              {Math.floor(Math.random() * 30) + 10} min away
            </span>
          </div>
          {isActive && (
            <span className="inline-block text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
              Active now
            </span>
          )}
        </div>
        
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {d.title || 'Special Deal'}
        </h4>
        
        {d.description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {d.description}
          </p>
        )}
        
        {venue?.address && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{venue.address}</span>
          </div>
        )}
        
        {claimedRecently != null && (
          <div className="mb-4 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
            {claimedRecently} claimed in last hour
          </div>
        )}
        
        <Link 
          href={`/deal/${d.id}/view`}
          className="block w-full bg-white/30 dark:bg-slate-800/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 py-3 rounded-xl font-bold text-center hover:bg-white/40 dark:hover:bg-slate-800/70 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 border border-white/40 dark:border-slate-600/50"
        >
          Claim This Deal
        </Link>
      </div>

      {/* Mini Map */}
      {showMiniMap && (
        <div className="px-6 pb-6">
          <MapMini 
            lat={venue.latitude} 
            lng={venue.longitude} 
            label={venue?.name || 'Restaurant'} 
          />
        </div>
      )}
    </div>
  );
}
