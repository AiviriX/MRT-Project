export interface CardData {
    uuid: string;
    balance: number;
    tappedIn: boolean;
    tappedInStation?: string;
};

export default CardData;