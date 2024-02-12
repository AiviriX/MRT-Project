export interface CardData {
    uuid: string;
    balance: number;
    tappedIn: boolean;
    sourceStation?: string;
};

export default CardData;