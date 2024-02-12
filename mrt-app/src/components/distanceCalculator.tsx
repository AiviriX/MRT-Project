import { LatLng } from 'leaflet';
import StationData from './stations/stationData';
import { getFare } from './stations/fare';

export const calculateDistance = (station1: StationData, station2: StationData): number => {
    const latlng1 = new LatLng(station1.coordinates[0], station1.coordinates[1]);
    const latlng2 = new LatLng(station2.coordinates[0], station2.coordinates[1]);

    const distance = latlng1.distanceTo(latlng2);
    // distance is in meters
    return distance;
}

export default calculateDistance