import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { DHAKA_LOCATIONS } from '../../lib/geo';

// Clean custom SVG pin icon
const incidentIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="background-color:#006A4E; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-center; box-shadow:0 4px 12px rgba(0,0,0,0.3); border:2px solid white;">
          <svg style="width:18px;height:18px;margin:auto;display:block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
         </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

interface IncidentMapProps {
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  interactive?: boolean;
  onLocationSelected?: (lat: number, lng: number, address: string) => void;
  className?: string;
}

// Subcomponent to handle click events on the map
const LocationPicker: React.FC<{
  onSelect: (lat: number, lng: number) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const IncidentMap: React.FC<IncidentMapProps> = ({
  centerLat = 23.7465,
  centerLng = 90.3745,
  zoom = 14,
  interactive = true,
  onLocationSelected,
  className = 'h-64 sm:h-80',
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: centerLat,
    lng: centerLng,
  });
  const [tileError, setTileError] = useState(false);

  const handleSelect = (lat: number, lng: number) => {
    setPosition({ lat, lng });
    if (onLocationSelected) {
      onLocationSelected(
        lat,
        lng,
        `অক্ষাংশ ${lat.toFixed(4)}, দ্রাঘিমাংশ ${lng.toFixed(4)} (ধানমন্ডি এলাকা, ঢাকা)`
      );
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-soft ${className}`}>
      {/* Graceful Fallback Grid if map tiles fail or offline */}
      {tileError && (
        <div className="absolute inset-0 bg-emerald-950/90 text-white z-20 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
          <h4 className="text-sm font-bold">অফলাইন ফলব্যাক গ্রিড (Dhaka Coordinates Active)</h4>
          <p className="text-xs text-slate-300 mt-1 max-w-sm">
            ইন্টারনেট বা ম্যাপ সার্ভার সংযোগ না থাকলেও অফলাইন জিও-কোঅর্ডিনেটস সংরক্ষিত হয়েছে: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </p>
        </div>
      )}

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => setTileError(true),
          }}
        />

        {interactive && <LocationPicker onSelect={handleSelect} />}

        <Marker position={[position.lat, position.lng]} icon={incidentIcon}>
          <Popup>
            <div className="text-xs p-1">
              <strong className="block text-slate-900 font-bold">ঘটনাস্থল (Incident Location)</strong>
              <span className="text-slate-600 block mt-0.5">
                অক্ষাংশ: {position.lat.toFixed(4)}, দ্রাঘিমাংশ: {position.lng.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Instructions */}
      <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1.5">
        <Navigation className="w-3.5 h-3.5 text-brand-600" />
        <span>{interactive ? 'ম্যাপে ক্লিক করে অবস্থান চিহ্নিত করুন' : 'ঘটনাস্থলের অবস্থান'}</span>
      </div>
    </div>
  );
};
