import { Unit, LocationInfo } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula (returned in kilometers).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // 2 decimal places
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export interface NearestUnitResult {
  unit: Unit;
  distanceKm: number;
  etaMinutes: number;
}

/**
 * Finds the nearest patrol units to a given incident location, sorted by distance.
 * Speed assumption: 35 km/h urban Dhaka traffic.
 */
export function findNearestUnits(
  targetLat: number,
  targetLng: number,
  units: Unit[],
  limit: number = 3
): NearestUnitResult[] {
  const averageUrbanSpeedKmh = 30; // ~30 km/h in Dhaka traffic

  return units
    .filter((u) => u.status === 'available' || u.status === 'assigned')
    .map((unit) => {
      const distanceKm = calculateHaversineDistance(
        targetLat,
        targetLng,
        unit.lat,
        unit.lng
      );
      // ETA in minutes with a 2-minute baseline dispatch overhead
      const travelTimeMinutes = (distanceKm / averageUrbanSpeedKmh) * 60;
      const etaMinutes = Math.max(2, Math.round(travelTimeMinutes + 2));

      return {
        unit,
        distanceKm,
        etaMinutes,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/**
 * Bounding center of Dhaka Metropolitan Area
 */
export const DHAKA_CENTER = {
  lat: 23.7806,
  lng: 90.4071,
  zoom: 12,
};

/**
 * Known police stations & key locations in Dhaka
 */
export const DHAKA_LOCATIONS: Record<string, LocationInfo> = {
  dhanmondi: {
    lat: 23.7461,
    lng: 90.3742,
    address: 'Dhanmondi Police Station, Road 7A, Dhanmondi, Dhaka',
  },
  gulshan: {
    lat: 23.7925,
    lng: 90.4167,
    address: 'Gulshan Model Thana, Road 103, Gulshan-2, Dhaka',
  },
  mirpur: {
    lat: 23.807,
    lng: 90.3686,
    address: 'Mirpur Model Thana, Section 2, Mirpur, Dhaka',
  },
  ramna: {
    lat: 23.738,
    lng: 90.404,
    address: 'Ramna Police Station, Mintoo Road, Ramna, Dhaka',
  },
  uttara: {
    lat: 23.8728,
    lng: 90.3984,
    address: 'Uttara East Police Station, Sector 4, Uttara, Dhaka',
  },
  savar: {
    lat: 23.8443,
    lng: 90.2589,
    address: 'Savar Model Thana, Upazila Road, Savar, Dhaka',
  },
};

/**
 * Safe Route calculation mock (finding route with high street-lighting, CCTV, and regular patrol frequency)
 */
export interface SafeRouteOption {
  id: string;
  name: string;
  distanceKm: number;
  estimatedMinutes: number;
  safetyScore: number; // 0-100
  cctvCoverage: string;
  lightingLevel: string;
  patrolFrequency: string;
  waypoints: [number, number][];
  recommendationNoteBn: string;
  recommendationNoteEn: string;
}

export function generateSafeRoutes(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): SafeRouteOption[] {
  const directDist = calculateHaversineDistance(fromLat, fromLng, toLat, toLng);
  const midLat = (fromLat + toLat) / 2;
  const midLng = (fromLng + toLng) / 2;

  return [
    {
      id: 'route-arterial',
      name: 'Main Arterial Safe Corridor (VIP/Metro Road)',
      distanceKm: Math.round((directDist * 1.15) * 10) / 10,
      estimatedMinutes: Math.round(directDist * 3.5),
      safetyScore: 94,
      cctvCoverage: '92% Active Surveillance',
      lightingLevel: 'LED High Mast Lights Every 50m',
      patrolFrequency: 'Patrol pass every 12 mins',
      waypoints: [
        [fromLat, fromLng],
        [midLat + 0.005, midLng - 0.004],
        [midLat, midLng],
        [midLat - 0.003, midLng + 0.004],
        [toLat, toLng],
      ],
      recommendationNoteBn: 'রাতের বেলা চলাচলের জন্য সর্বোচ্চ নিরাপদ: পর্যাপ্ত রোডলাইট, সিসিটিভি ক্যামেরা ও নিয়মিত পুলিশ টহল রয়েছে।',
      recommendationNoteEn: 'Highest safety rating for night travel: dense CCTV coverage, active smart LED street lighting, and regular patrol coverage.',
    },
    {
      id: 'route-direct',
      name: 'Shortest Path (Through Residential / Alleys)',
      distanceKm: Math.round(directDist * 10) / 10,
      estimatedMinutes: Math.round(directDist * 2.8),
      safetyScore: 68,
      cctvCoverage: '45% Partial Coverage',
      lightingLevel: 'Moderate residential lighting',
      patrolFrequency: 'Patrol pass every 45 mins',
      waypoints: [
        [fromLat, fromLng],
        [midLat - 0.002, midLng - 0.001],
        [toLat, toLng],
      ],
      recommendationNoteBn: 'দূরত্ব কম হলেও কম আলো ও বিচ্ছিন্ন গলিপথের কারণে রাত ৯টার পর প্রধান সড়ক ব্যবহারের পরামর্শ দেওয়া হচ্ছে।',
      recommendationNoteEn: 'Shorter distance, but secondary alleys have lower illumination; recommended to use Main Arterial route after 21:00.',
    },
  ];
}
