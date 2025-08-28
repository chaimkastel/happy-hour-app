'use client';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapEmbed({ lat, lng }: { lat:number; lng:number }) {
  return (
    <div style={{height:'300px', width:'100%'}}>
      <MapContainer center={[lat,lng]} zoom={15} style={{height:'100%', width:'100%'}}>
        <TileLayer attribution='&copy; OpenStreetMap' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
        <Marker position={[lat,lng] as any}/>
      </MapContainer>
    </div>
  );
}
