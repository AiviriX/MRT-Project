import { StationModel } from "../src/stations";
import { StationSchema } from "../db/schemas";

interface Station {
    _id: string;
    stationName: string;
    coordinates: [number, number];
    connectedStation: string[];
}

export async function findShortestPath(startStationId: string, targetStationId: string): Promise<string[] | null> {
    const queue: string[] = [];
    const visited: Set<string> = new Set();
    const parentStations: Map<string, string> = new Map();

    queue.push(startStationId);
    visited.add(startStationId);

    while (queue.length > 0) {
        const currentStationId: string = queue.shift()!;
        const currentStation: Station | null = await StationModel.findById(currentStationId);

        if (currentStation && currentStation._id.toString() === targetStationId.toString()) {
            const path: string[] = [];
            let station: string | undefined = currentStationId;
            while (station) {
                path.unshift(station);
                station = parentStations.get(station);
            }
            return path;
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
    return null;
}

export default findShortestPath;