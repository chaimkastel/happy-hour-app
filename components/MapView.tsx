'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25,41], iconAnchor: [12,41]
});
export default function MapView({ items }:{ items:any[] }){
  const center = items.length? [items[0].restaurant.lat, items[0].restaurant.lng] as any : [40.7128,-74.006] as any;
  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 h-[520px]">
      <MapContainer center={center} zoom={12} style={{height:'100%', width:'100%'}}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {items.map(d=>(
          <Marker key={d.id} position={[d.restaurant.lat, d.restaurant.lng]} icon={icon}>
            <Popup>
              <div className="font-semibold">{d.restaurant.name}</div>
              <div className="text-xs">{d.title} • {d.discountPercent}%</div>
              <div className="text-xs text-white/50">{d.restaurant.address}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
