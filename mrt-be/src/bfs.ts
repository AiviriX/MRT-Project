import { Fare, StationModel } from "../src/stations";
import { StationSchema } from "../db/schemas";

interface Station {
    _id: string;
    stationName: string;
    coordinates: [number, number];
    connectedStation: string[];
}

export async function findShortestPath(startStationId: string, targetStationId: string): Promise<{ path?: string[] | null, stationNames?: string[] | null, coordinates?: [number, number][] | null }> {    const queue: string[] = [];
    const visited: Set<string> = new Set();
    const parentStations: Map<string, string> = new Map();
    const stationNames: string[] = [];
    const coordinates: [number, number][] = [];

    queue.push(startStationId);
    visited.add(startStationId);

    while (queue.length > 0) {
        const currentStationId: string = queue.shift()!;
        const currentStation: Station | null = await StationModel.findById(currentStationId);

        if (currentStation && currentStation._id.toString() === targetStationId.toString()) {
            const path: string[] = [];
            const names: string[] = [];
            const coords: [number, number][] = [];

            let station: string | undefined = currentStationId;
            
            while (station) {
                const currentStation: Station | null = await StationModel.findById(station);
                if (currentStation) {
                    path.unshift(station);
                    stationNames.unshift(currentStation.stationName); // Push the name of the current station
                    coordinates.unshift(currentStation.coordinates); // Push the coordinates of the current station
                    station = parentStations.get(station);
                } else {
                    station = undefined;
                }
            }

            return {
                path,
                stationNames,
                coordinates
            };
        }

        if (currentStation) {
            for (const connectedStationId of currentStation.connectedStation) {
                if (!visited.has(connectedStationId)) {
                    queue.push(connectedStationId);
                    visited.add(connectedStationId);
                    parentStations.set(connectedStationId, currentStationId);
                }
            }
        }
    }
    return { path: null, stationNames: null, coordinates: null };
}

// Haversine formula to calculate distance between two points
export const calculateTotalFare = async (coords: [number, number][] = [], farePerKm: number): Promise<number> => {
    const earthRadiusKm = 6371; // Earth's radius in kilometers

    let totalDistance = 0;
    for (let i = 0; i < coords.length - 1; i++) {
        const [lat1, lon1] = coords[i];
        const [lat2, lon2] = coords[i + 1];

        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = earthRadiusKm * c;
        totalDistance += distance;
    }

    const fare = totalDistance * farePerKm;
    console.log(`Total distance: ${totalDistance} km`);
    return fare;
}

function degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

// Haversine formula to calculate distance between two points
export const calculateDistance = (coords: [number, number][] = []): number => {
    const earthRadiusKm = 6371; // Earth's radius in kilometers

    let totalDistance = 0;
    for (let i = 0; i < coords.length - 1; i++) {
        const [lat1, lon1] = coords[i];
        const [lat2, lon2] = coords[i + 1];

        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        totalDistance += earthRadiusKm * c;
    }

    return totalDistance;
}

// export const calculateFare = async (coords: [number, number][] = [], farePerKm: number): Promise<number> => {
//     let totalDistance = 0;
//     for (let i = 0; i < coords.length - 1; i++) {
//         const [lat1, lon1] = coords[i];
//         const [lat2, lon2] = coords[i + 1];
//         totalDistance += calculateDistance([lat1, lon1], [lat2, lon2]);
//     }

//     const fare = totalDistance * farePerKm;
//     console.log(`Total distance: ${totalDistance} km`);
//     return fare;
// }



export default findShortestPath;
