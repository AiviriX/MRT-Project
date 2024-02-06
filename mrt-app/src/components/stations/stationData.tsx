export interface StationData {
    _id: string,
    stationName: string,
    coordinates: number[],
    stationLineNum?: number
    connectedStations?: string[]
}

export default StationData