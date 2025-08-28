'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import DealCard from '@/components/DealCard';
import SkeletonCard from '@/components/SkeletonCard';
import SortFilterBar from '@/components/SortFilterBar';

type Query = { q: string; sort: 'nearby' | 'discount' | 'new'; openNow: boolean };

type Item = {
  id: string;
  title: string;
  description?: string | null;
  discountPercent: number;
  isActive: boolean;
  distanceKm?: number | null;
  restaurant: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    avgRating?: number;
    ratingCount?: number;
  };
};

export default function DealsExplorer() {
  const [query, setQuery] = useState<Query>({ q: '', sort: 'nearby', openNow: false });
  const [items, setItems] = useState<Item[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const fetching = useRef(false);
  const { ref: sentinelRef, inView } = useInView({ rootMargin: '600px' });

  useEffect(() => {
    let active = true;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { if (active) setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
        () => { if (active) setCoords(null); },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
    return () => { active = false; };
  }, []);

  const buildParams = useCallback((qv: Query, cur: string | null) => {
    const p = new URLSearchParams();
    if (qv.q) p.set('q', qv.q);
    if (qv.sort) p.set('sort', qv.sort);
    if (qv.openNow) p.set('openNow', '1');
    if (coords) { p.set('lat', String(coords.lat)); p.set('lng', String(coords.lng)); }
    p.set('take', '24');
    if (cur) p.set('cursor', cur);
    return p.toString();
  }, [coords]);

  const load = useCallback(async (qv: Query, cur: string | null, append: boolean) => {
    if (fetching.current) return;
    fetching.current = true;
    if (!append) setLoading(true);

    const res = await fetch('/api/deals?' + buildParams(qv, cur), { cache: 'no-store' });
    const data = await res.json().catch(() => ({ items: [], nextCursor: null }));

    setItems((prev) => (append ? [...prev, ...(data.items || [])] : (data.items || [])));
    setCursor(data.nextCursor || null);
    setLoading(false);
    fetching.current = false;
  }, [buildParams]);

  useEffect(() => { load(query, null, false); }, [query, load]);
  useEffect(() => { if (inView && cursor) load(query, cursor, true); }, [inView, cursor, query, load]);

  const onChangeFilters = useCallback((s: Query) => setQuery(s), []);

  const content = useMemo(() => {
    if (loading && items.length === 0) {
      return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    if (items.length === 0) return <div className="card">No deals match your filters.</div>;
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((d) => <DealCard key={d.id} d={d} />)}
      </div>
    );
  }, [loading, items]);

  return (
    <div className="space-y-4">
      <SortFilterBar onChange={onChangeFilters} />
      {content}
      {items.length > 0 && (
        <div ref={sentinelRef} className="h-8 grid place-items-center text-white/40">
          {cursor ? 'Loading more…' : '— End of results —'}
        </div>
      )}
    </div>
  );
}
