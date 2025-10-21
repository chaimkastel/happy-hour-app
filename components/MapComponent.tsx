'use client'
import { useEffect, useRef, useState } from 'react';
import { MapPin, Clock, Star, DollarSign } from 'lucide-react';

interface Deal {
  id: string
  venue: {
    latitude: number
    longitude: number
    name: string
    address?: string
    rating?: number
    isOpen?: boolean
  }
  title?: string
  discount?: number
  percentOff?: number
  distance?: number
  timeRemaining?: string
}

interface MapComponentProps {
  deals: Deal[]
  center: { lat: number; lng: number }
  onDealSelect?: (deal: Deal) => void
  userLocation?: { lat: number; lng: number }
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function MapComponent({ deals, center, onDealSelect, userLocation }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!window.google) {
      loadGoogleMaps();
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (map && deals.length > 0) {
      updateMarkers();
    }
  }, [map, deals]);

  const loadGoogleMaps = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initMap;
    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!mapRef.current || window.google?.maps) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.TOP_LEFT,
      },
    });

    setMap(mapInstance);
    setIsLoaded(true);
  };

  const updateMarkers = () => {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers: any[] = [];

    deals.forEach((deal) => {
      const marker = new window.google.maps.Marker({
        position: { lat: deal.venue.latitude, lng: deal.venue.longitude },
        map: map,
        title: deal.venue.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
                ${deal.percentOff || deal.discount || 0}%
              </text>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-bold text-gray-900 text-sm">${deal.venue.name}</h3>
              <span class="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                ${deal.percentOff || deal.discount || 0}% OFF
              </span>
            </div>
            ${deal.title ? `<p class="text-gray-600 text-xs mb-2">${deal.title}</p>` : ''}
            ${deal.venue.address ? `<p class="text-gray-500 text-xs mb-2">${deal.venue.address}</p>` : ''}
            <div class="flex items-center gap-2 text-xs text-gray-600">
              ${deal.venue.rating ? `
                <div class="flex items-center gap-1">
                  <svg class="w-3 h-3 fill-current text-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span>${deal.venue.rating}</span>
                </div>
              ` : ''}
              ${deal.distance ? `<span>${deal.distance.toFixed(1)} km</span>` : ''}
              ${deal.venue.isOpen !== undefined ? `
                <span class="${deal.venue.isOpen ? 'text-green-600' : 'text-red-600'}">
                  ${deal.venue.isOpen ? 'Open' : 'Closed'}
                </span>
              ` : ''}
            </div>
            ${deal.timeRemaining ? `
              <div class="flex items-center gap-1 mt-2 text-xs text-orange-600">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <span>${deal.timeRemaining} left</span>
              </div>
            ` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onDealSelect) {
          onDealSelect(deal);
        }
      });

      newMarkers.push(marker);
    });

    // Add user location marker if available
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Your Location',
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="#ffffff" stroke-width="3"/>
              <circle cx="16" cy="16" r="6" fill="#ffffff"/>
            </svg>
          `)}`,
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16),
        },
      });
      newMarkers.push(userMarker);
    }

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
      
      // Don't zoom in too much if there's only one marker
      if (newMarkers.length === 1) {
        map.setZoom(15);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full rounded-3xl bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="w-full h-full rounded-3xl bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Deals Available</h3>
          <p className="text-gray-500">Check back later for new deals in your area</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full rounded-3xl" />
    </div>
  );
}
