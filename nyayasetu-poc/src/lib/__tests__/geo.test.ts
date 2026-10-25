import { describe, it, expect } from 'vitest';
import {
  calculateHaversineDistance,
  findNearestUnits,
  generateSafeRoutes,
} from '../geo';
import { Unit } from '../../types';

describe('Geospatial & Haversine Utilities', () => {
  it('calculates accurate distance between Dhanmondi and Gulshan', () => {
    // Dhanmondi ~ (23.7461, 90.3742) to Gulshan ~ (23.7925, 90.4167)
    const dist = calculateHaversineDistance(23.7461, 90.3742, 23.7925, 90.4167);
    expect(dist).toBeGreaterThan(6.0);
    expect(dist).toBeLessThan(7.5);
  });

  it('sorts and returns nearest available units with ETA', () => {
    const mockUnits: Unit[] = [
      {
        id: 'u-far',
        callSign: 'FAR-1',
        stationId: 'savar',
        lat: 23.8443,
        lng: 90.2589,
        status: 'available',
        officerName: 'Savar Team',
        phone: '01700-111111',
        vehicleType: 'Jeep',
      },
      {
        id: 'u-near',
        callSign: 'NEAR-1',
        stationId: 'dhanmondi',
        lat: 23.7485,
        lng: 90.3725,
        status: 'available',
        officerName: 'Dhanmondi Team',
        phone: '01700-222222',
        vehicleType: 'Bike',
      },
    ];

    // Target incident at Dhanmondi (23.7465, 90.3745)
    const nearest = findNearestUnits(23.7465, 90.3745, mockUnits, 2);
    expect(nearest).toHaveLength(2);
    expect(nearest[0].unit.id).toBe('u-near');
    expect(nearest[0].distanceKm).toBeLessThan(1.0);
    expect(nearest[0].etaMinutes).toBeGreaterThanOrEqual(2);
  });

  it('generates safe route options with high CCTV score', () => {
    const routes = generateSafeRoutes(23.7461, 90.3742, 23.807, 90.3686);
    expect(routes.length).toBeGreaterThan(0);
    expect(routes[0].safetyScore).toBeGreaterThan(80);
    expect(routes[0].waypoints.length).toBeGreaterThan(2);
  });
});
