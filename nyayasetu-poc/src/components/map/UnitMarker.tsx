import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Unit } from '../../types';

interface UnitMarkerProps {
  unit: Unit;
}

export const UnitMarker: React.FC<UnitMarkerProps> = ({ unit }) => {
  const bg =
    unit.status === 'available'
      ? '#059669'
      : unit.status === 'assigned'
      ? '#2563eb'
      : unit.status === 'enroute'
      ? '#d97706'
      : '#7c3aed';

  const icon = L.divIcon({
    className: 'unit-marker-icon',
    html: `<div style="background-color:${bg}; color:white; padding:4px 8px; border-radius:12px; font-size:10px; font-weight:bold; font-family:monospace; display:flex; align-items:center; gap:4px; box-shadow:0 3px 10px rgba(0,0,0,0.3); border:2px solid white; white-space:nowrap;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:white;"></span>
            ${unit.callSign.split(' ')[0]}
           </div>`,
    iconSize: [80, 24],
    iconAnchor: [40, 12],
  });

  return (
    <Marker position={[unit.lat, unit.lng]} icon={icon}>
      <Popup>
        <div className="text-xs p-1">
          <strong className="block text-slate-900 font-bold">{unit.callSign}</strong>
          <p className="text-slate-600">{unit.officerName}</p>
          <span className="text-[10px] uppercase font-bold text-slate-500">
            স্ট্যাটাস: {unit.status}
          </span>
        </div>
      </Popup>
    </Marker>
  );
};
