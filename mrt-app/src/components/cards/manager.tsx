import React from 'react'
import { useState, useEffect } from 'react';
import CreateCard from '../cards/createCard';
import { GetCardList } from './getCardList';
import CardEntry from './cardEntry';


const CardManager = () => {
    interface Card {
        uuid: string;
        balance: number;
    };

    const [cards, setCards] = useState<Card[]>([]);
    const [cardAction, setCardAction] = useState('');
    

    useEffect(() => {
        let x = GetCardList();
        x.then((data) => {
            setCards(data);
        });
    }, []);

    return (
        <>
            <div className="flex">
                <aside className="w-64 h-screen bg-gray-800 text-white p-6 space-y-6">
                    <h1 className="text-xl font-bold">Card Management</h1>
                    <button
                        onClick={() => setCardAction('create')}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create UUID
                    </button>
                    <button
                        onClick={() => setCardAction('read')}
                        className="w-full bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Read UUID
                    </button>
                </aside>

                <main className="flex-grow p-6">
                    {
                        cardAction === 'create' ? <CreateCard/> :
                        cards.map((card, index) => (
                            <CardEntry
                                key={index}
                                uuid={card.uuid}
                                balance={card.balance}
                            />
                        )) 
                    }

                </main>
            </div>
        </>
    )
}

export default CardManager