'use client';
import Link from 'next/link';
import MapMini from './MapMini';

export default function DealCard({ d }: { d: any }) {
  const claimedRecently = typeof d.claimsLastHour === 'number' ? d.claimsLastHour : undefined;
  const showMiniMap = d?.restaurant?.latitude && d?.restaurant?.longitude;

  return (
    <Link href={`/deal/${d.id}/view`} className="block">
      <div className="card hover:bg-white/10 transition relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">{d.restaurant?.name || 'Restaurant'}</div>
            <div className="text-sm text-white/60">
              {d.title} • {d.discountPercent}% off {d.isActive ? '' : '• Inactive'}
            </div>
            {d.distanceKm != null && (
              <div className="text-xs text-white/50">{d.distanceKm} km away</div>
            )}
            {d.description && <p className="text-white/70 mt-2 line-clamp-2">{d.description}</p>}
            {d.restaurant?.address && <div className="text-xs text-white/40 mt-2">{d.restaurant.address}</div>}
            {claimedRecently != null && (
              <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
                {claimedRecently} claimed in last hour
              </div>
            )}
          </div>
          {d.isActive && <span className="btn-ghost">See details</span>}
        </div>
        {d.isActive && (
          <div className="mt-3">
            <span className="inline-block text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
              Active now
            </span>
          </div>
        )}
        {showMiniMap && (
          <div className="mt-4">
            <MapMini lat={d.restaurant.latitude} lng={d.restaurant.longitude} label={d.restaurant?.name || 'Restaurant'} />
          </div>
        )}
      </div>
    </Link>
  );
}
