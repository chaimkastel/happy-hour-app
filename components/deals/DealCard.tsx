import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Clock, Star, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

interface DealCardProps {
  deal: Deal;
  index: number;
  onSave?: (dealId: string) => void;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const DealCard = ({ deal, index, onSave }: DealCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      router.push('/login');
      return;
    }
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(deal.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
      whileHover={{ scale: 1.01, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => router.push(`/deal/${deal.id}/view`)}
      className="flex-shrink-0 w-[280px] cursor-pointer group"
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100 will-change-transform">
        {/* Image Container with Aspect Ratio */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {deal.image ? (
            <Image 
              src={deal.image} 
              alt={deal.title}
              fill
              className="object-cover rounded-t-2xl transition-transform duration-300"
              sizes="280px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-300">
              <div className="text-5xl opacity-20 flex items-center justify-center h-full">
                🍽️
              </div>
            </div>
          )}
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/35 via-black/10 to-transparent"></div>

          {/* Discount Badge */}
          {deal.percentOff && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-orange-600 text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-lg"
            >
              {deal.percentOff}% OFF
            </motion.div>
          )}
          
          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 1.2, transition: { duration: 0.15, ease: 'easeOut' } }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isSaved}
            role="button"
          >
            <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'text-red-500 fill-current' : 'text-slate-500 hover:text-red-500'}`} />
          </motion.button>
          
          {/* Time Pill - Pinned bottom-left with Glass Effect */}
          <div className="absolute bottom-3 left-3">
            <div className="backdrop-blur-sm bg-white/70 rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-semibold text-slate-700 shadow-md border border-white/20">
              <Clock className="w-3 h-3 text-orange-600" />
              <span>{formatTime(deal.startAt)}-{formatTime(deal.endAt)}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4">
          <h3 className="font-semibold text-base text-slate-900 mb-1 line-clamp-1">
            {deal.venue.name}
          </h3>
          <p className="text-slate-600 text-sm mb-3 line-clamp-1">
            {deal.title}
          </p>
          
          {/* Rating & Distance - Single line */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            {deal.venue.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="font-semibold text-slate-700">{deal.venue.rating}</span>
              </div>
            )}
            <span>0.8 mi away</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

