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

interface MapComponentProps {
  deals: Deal[]
  center: { lat: number; lng: number }
}

export default function MapComponent({ deals, center }: MapComponentProps) {
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
  );
}
