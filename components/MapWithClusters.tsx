'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Deal {
  id: string
  venue: {
    latitude: number
    longitude: number
    name: string
  }
  title?: string
  discount?: number
  percentOff?: number
}

interface MapWithClustersProps {
  deals: Deal[]
  userLocation?: { lat: number; lng: number } | null
}

export default function MapWithClusters({ deals, userLocation }: MapWithClustersProps) {
  if (deals.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            No Deals Available
          </h3>
          <p className="text-blue-600 dark:text-blue-300">
            Check back later for new deals in your area
          </p>
        </div>
      </div>
    );
  }

  // Calculate center point
  const center = userLocation || { 
    lat: deals[0].venue.latitude, 
    lng: deals[0].venue.longitude 
  };

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-3xl"
      >
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {deals.map((deal) => (
          <Marker 
            key={deal.id} 
            position={[deal.venue.latitude, deal.venue.longitude]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-slate-900 mb-1">
                  {deal.venue.name}
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  {deal.title || 'Special Deal'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {deal.discount || deal.percentOff || 0}% OFF
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
