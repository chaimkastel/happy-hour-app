'use client';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25,41], iconAnchor: [12,41]
});

type Position = [number, number] | {lat: number, lng: number};

function Clicker({ onPick, format }: { onPick: (p: Position) => void; format: 'tuple' | 'object' }) {
  useMapEvents({
    click(e) { 
      if (format === 'tuple') {
        onPick([e.latlng.lat, e.latlng.lng]);
      } else {
        onPick({lat: e.latlng.lat, lng: e.latlng.lng});
      }
    }
  });
  return null;
}

export default function MapPicker({
  value, onChange, format = 'object'
}: { 
  value?: Position | null; 
  onChange: (p: Position) => void;
  format?: 'tuple' | 'object';
}) {
  const getCenter = (): [number, number] => {
    if (!value) return [40.7128, -74.0060];
    if (Array.isArray(value)) return value;
    return [value.lat, value.lng];
  };

  const getMarkerPosition = (): [number, number] => {
    if (!value) return [0, 0];
    if (Array.isArray(value)) return value;
    return [value.lat, value.lng];
  };

  const center = getCenter();
  const markerPos = getMarkerPosition();

  return (
    <div style={{height:'260px'}} className="rounded-xl overflow-hidden">
      <MapContainer center={center} zoom={12} style={{height:'100%',width:'100%'}}>
        <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <Clicker onPick={onChange} format={format}/>
        {value && <Marker position={markerPos} icon={icon} />}
      </MapContainer>
    </div>
  );
}
