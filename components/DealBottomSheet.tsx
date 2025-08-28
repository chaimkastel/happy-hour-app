'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DealBottomSheet({ open, onClose, deal }:{ open:boolean; onClose:()=>void; deal:any }){
  useEffect(()=>{
    if(!open) return;
    const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  },[open,onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
          <motion.div
            className="fixed bottom-0 inset-x-0 z-50 bg-[#0b0d12] border-t border-white/10 rounded-t-2xl p-4"
            initial={{ y: 400 }} animate={{ y: 0 }} exit={{ y: 400 }} transition={{ type:'spring', stiffness: 240, damping: 22 }}
          >
            <div className="h-1.5 w-10 bg-white/15 rounded-full mx-auto mb-3" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{deal.restaurant.name}</div>
                <div className="text-white/60 text-sm">{deal.title} • {deal.discountPercent}% off</div>
                <div className="text-xs text-white/40 mt-1">{deal.restaurant.address}</div>
                {deal.restaurant.avgRating ? (
                  <div className="text-xs mt-1">⭐ {deal.restaurant.avgRating.toFixed(1)} ({deal.restaurant.ratingCount})</div>
                ) : null}
              </div>
              {deal.isActive && (
                <Link href={`/redeem/${deal.id}`} className="btn">Get QR</Link>
              )}
            </div>
            {deal.description && <p className="text-white/70 mt-3">{deal.description}</p>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
