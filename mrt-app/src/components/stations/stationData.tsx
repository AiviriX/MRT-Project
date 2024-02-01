import { Marker } from "leaflet"

interface StationData {
    _id: number,
    stationName: string,
    coordinates: number[],
    stationLineNum?: number
}

export default StationData