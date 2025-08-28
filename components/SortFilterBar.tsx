'use client';
import { useEffect, useState } from 'react';

interface Filters {
  cuisine: string;
  maxDistance: number;
  minDiscount: number;
  openNow: boolean;
}

interface SortFilterBarProps {
  filters?: Filters;
  onFiltersChange?: (filters: Filters) => void;
  dealsCount?: number;
  // Legacy interface support
  onChange?: (s: {q: string; sort: 'nearby'|'discount'|'new'; openNow: boolean}) => void;
}

export default function SortFilterBar({ filters, onFiltersChange, dealsCount, onChange }: SortFilterBarProps) {
  const [sort, setSort] = useState<'nearby'|'discount'|'new'>('nearby');
  const [q, setQ] = useState('');
  const [openNow, setOpenNow] = useState(false);

  // Legacy mode - use old interface
  if (onChange && !filters) {
    useEffect(() => { onChange({ q, sort, openNow }); }, [q, sort, openNow, onChange]);
    return (
      <div className="card sticky top-2 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5">
        <div className="grid lg:grid-cols-3 gap-3 items-center">
          <input className="input" placeholder="Search restaurants, streets, deals…" value={q} onChange={e=>setQ(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={()=>setSort('nearby')}   className={`btn-ghost ${sort==='nearby'?'ring-1 ring-white/30':''}`}>Nearby</button>
            <button onClick={()=>setSort('discount')} className={`btn-ghost ${sort==='discount'?'ring-1 ring-white/30':''}`}>Best discount</button>
            <button onClick={()=>setSort('new')}      className={`btn-ghost ${sort==='new'?'ring-1 ring-white/30':''}`}>Newest</button>
          </div>
          <label className="inline-flex items-center gap-2 justify-self-end">
            <input type="checkbox" checked={openNow} onChange={e=>setOpenNow(e.target.checked)} />
            <span className="text-sm">Open now</span>
          </label>
        </div>
      </div>
    );
  }

  // New mode - use new interface
  if (!filters || !onFiltersChange) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setSort('nearby')}   
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sort === 'nearby' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Nearby
            </button>
            <button 
              onClick={() => setSort('discount')} 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sort === 'discount' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Best discount
            </button>
            <button 
              onClick={() => setSort('new')}      
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sort === 'new' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Newest
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Max Distance:
            </label>
            <select 
              value={filters.maxDistance}
              onChange={(e) => onFiltersChange({...filters, maxDistance: Number(e.target.value)})}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Min Discount:
            </label>
            <select 
              value={filters.minDiscount}
              onChange={(e) => onFiltersChange({...filters, minDiscount: Number(e.target.value)})}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value={0}>Any</option>
              <option value={10}>10%+</option>
              <option value={20}>20%+</option>
              <option value={30}>30%+</option>
              <option value={40}>40%+</option>
              <option value={50}>50%+</option>
            </select>
          </div>
          
          <label className="inline-flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={filters.openNow} 
              onChange={(e) => onFiltersChange({...filters, openNow: e.target.checked})}
              className="rounded border-slate-300 dark:border-slate-600"
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Open now</span>
          </label>
        </div>
        
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {dealsCount} deals found
        </div>
      </div>
    </div>
  );
}
