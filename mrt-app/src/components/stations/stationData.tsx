export interface StationData {
    _id: string,
    stationName: string,
    coordinates: number[],
    stationLineNum?: number
    connectedStation: string[]
}

export default StationData