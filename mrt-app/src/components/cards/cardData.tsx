export interface CardData {
    uuid: string;
    balance: number;
    tappedIn: boolean;
    sourceStation?: string;
    sourceStationName?: string;
    coordinates? : [number, number];
};

export default CardData;