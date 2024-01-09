import { Marker } from "leaflet"

interface stationData {
    id: number,
    stationName: string,
    coordinates: number[],
    stationLineNum: number
}

export default stationData