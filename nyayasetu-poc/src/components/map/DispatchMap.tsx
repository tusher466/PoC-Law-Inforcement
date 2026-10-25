import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Unit, Incident } from '../../types';
import { findNearestUnits, DHAKA_CENTER } from '../../lib/geo';
import { Radio, Car, AlertOctagon, PhoneCall, Shield } from 'lucide-react';

interface DispatchMapProps {
  units: Unit[];
  incidents: Incident[];
  selectedIncidentId?: string;
  onSelectIncident?: (incident: Incident) => void;
  className?: string;
}

// Generate Unit icons by status
const createUnitIcon = (status: Unit['status'], callSign: string) => {
  const bg =
    status === 'available'
      ? '#059669' // Emerald
      : status === 'assigned'
      ? '#2563eb' // Blue
      : status === 'enroute'
      ? '#d97706' // Amber
      : '#7c3aed'; // Purple (onscene)

  return L.divIcon({
    className: 'custom-unit-icon',
    html: `<div style="background-color:${bg}; color:white; padding:4px 8px; border-radius:12px; font-size:10px; font-weight:bold; font-family:monospace; display:flex; align-items:center; gap:4px; box-shadow:0 3px 10px rgba(0,0,0,0.3); border:2px solid white; white-space:nowrap;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:white;"></span>
            ${callSign.split(' ')[0]}
           </div>`,
    iconSize: [80, 24],
    iconAnchor: [40, 12],
  });
};

// Generate Incident icons by severity
const createIncidentIcon = (severity: Incident['severity'], isSelected: boolean) => {
  const bg =
    severity === 'critical' ? '#dc2626' : severity === 'high' ? '#ea580c' : '#0284c7';
  const pulseClass = severity === 'critical' ? 'animate-ping' : '';

  return L.divIcon({
    className: 'custom-incident-icon',
    html: `<div style="position:relative; width:32px; height:32px;">
            <div style="position:absolute; inset:0; border-radius:50%; background-color:${bg}; opacity:0.3; transform:scale(${isSelected ? 1.8 : 1.2});"></div>
            <div style="position:relative; background-color:${bg}; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2.5px solid white; box-shadow:0 4px 12px rgba(0,0,0,0.4);">
              <svg style="width:16px;height:16px;margin:auto;display:block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
            </div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const DispatchMap: React.FC<DispatchMapProps> = ({
  units,
  incidents,
  selectedIncidentId,
  onSelectIncident,
  className = 'h-[500px]',
}) => {
  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  // If an incident is selected, calculate nearest units for polyline highlight
  const nearestResults = selectedIncident
    ? findNearestUnits(selectedIncident.lat, selectedIncident.lng, units, 3)
    : [];

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-elevated ${className}`}>
      <MapContainer
        center={[DHAKA_CENTER.lat, DHAKA_CENTER.lng]}
        zoom={DHAKA_CENTER.zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Polylines to nearest 3 units from selected incident */}
        {selectedIncident &&
          nearestResults.map(({ unit, distanceKm }, idx) => (
            <Polyline
              key={unit.id}
              positions={[
                [selectedIncident.lat, selectedIncident.lng],
                [unit.lat, unit.lng],
              ]}
              pathOptions={{
                color: idx === 0 ? '#059669' : idx === 1 ? '#2563eb' : '#9333ea',
                weight: idx === 0 ? 3.5 : 2,
                dashArray: idx === 0 ? undefined : '5, 8',
                opacity: 0.8,
              }}
            />
          ))}

        {/* Units Markers */}
        {units.map((unit) => (
          <Marker
            key={unit.id}
            position={[unit.lat, unit.lng]}
            icon={createUnitIcon(unit.status, unit.callSign)}
          >
            <Popup>
              <div className="text-xs p-1 min-w-[180px]">
                <strong className="block text-slate-900 font-bold mb-0.5">
                  {unit.callSign}
                </strong>
                <p className="text-slate-600">অফিসার: {unit.officerName}</p>
                <p className="text-slate-600">ফোন: {unit.phone}</p>
                <p className="text-slate-600">যানবাহন: {unit.vehicleType}</p>
                <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    স্ট্যাটাস:
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      unit.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : unit.status === 'enroute'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {unit.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incidents Markers */}
        {incidents.map((incident) => {
          const isSelected = incident.id === selectedIncidentId;
          return (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              icon={createIncidentIcon(incident.severity, isSelected)}
              eventHandlers={{
                click: () => onSelectIncident && onSelectIncident(incident),
              }}
            >
              <Popup>
                <div className="text-xs p-1 max-w-xs">
                  <div className="flex items-center gap-1 font-bold text-red-700 mb-1">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>{incident.source.toUpperCase()} - {incident.id}</span>
                  </div>
                  <p className="text-slate-800 font-medium font-bengali mb-1">
                    {incident.description}
                  </p>
                  <p className="text-[11px] text-slate-500">{incident.address}</p>
                  {incident.callerPhone && (
                    <p className="text-[11px] text-slate-500">
                      কলার: {incident.callerName || 'অজ্ঞাত'} ({incident.callerPhone})
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Status Bar */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-200 shadow-card text-xs flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-800">
            {units.filter((u) => u.status === 'available').length} টহল টিম সক্রিয় (GPS Live)
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500 border-l border-slate-200 pl-3">
          <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
          <span>{incidents.filter((i) => i.status !== 'resolved').length} টি ইনসিডেন্ট চলমান</span>
        </div>
      </div>
    </div>
  );
};
