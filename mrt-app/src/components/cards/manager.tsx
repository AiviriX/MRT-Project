//Card UI Hierarchy
// CardManager --YOU ARE HERE
//  CardEntry - CardEntry is a component that lists the cards inside the parent UI at the manager.tsx file.
//      AddBalanceToCard - AddBalanceToCard is a component that allows the user to add balance to the card.

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateCard from '../cards/createCard';
import CardEntry from './cardEntry';
import { hasSessionToken } from '../../auth/sessionTokenManager';
import { CardData } from './cardData';
import { API_URL } from '../..';
import StationData from '../stations/stationData';
import { useMediaQuery } from '@uidotdev/usehooks';


export const CardManager = () => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [cardAction, setCardAction] = useState('');
    const [reload, triggerReload] = useState(false);
    const navigate = useNavigate();

    const hasToken = hasSessionToken();
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    const handleDelete = async (uuid: string) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            await deleteCard(uuid);
            triggerReload(!reload);
        }
    };

    const refreshCardListFromChild = () => {
        triggerReload(!reload);
    };

    useEffect(() => {
        const refreshCard = async () => {
            try {
                const fetchedCards = await getCardList();
                setCards(fetchedCards);
            } catch (error) {
                console.error(error);
            }
        };
        refreshCard();
    }, [cardAction, reload]);

    return (
        <>
            {hasToken ? (
                <div className="flex flex-col md:flex-row h-screen overflow-hidden">
                    <aside className={`md:w-64 h-auto bg-gray-800 text-white p-6 space-y-6 ${isSmallScreen ? 'md:hidden' : 'md:block'}`}>
                        <h1 className="text-xl font-bold">Card Management</h1>
                        <button
                            onClick={() => setCardAction('create')}
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Create UUID
                        </button>
                        <button
                            onClick={() => setCardAction('read')}
                            className="w-full bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            List UUIDs
                        </button>
                    </aside>

                    <main className="flex-grow px-3 overflow-auto h-screen">
                        {cardAction === 'create' ? (
                            <CreateCard />
                        ) : cards.length > 0 ? (
                            cards.map((card) => (
                                <CardEntry
                                    key={card.uuid}
                                    uuid={card.uuid}
                                    balance={card.balance}
                                    tappedIn={card.tappedIn}
                                    sourceStation={card.sourceStation}
                                    sourceStationName={card.sourceStationName}
                                    handleDelete={handleDelete}
                                    handleRefresh={refreshCardListFromChild}
                                />
                            ))
                        ) : (
                            <h1>No Cards Found</h1>
                        )}
                    </main>
                </div>
            ) : (
                navigate('/noaccess')
            )}
        </>
    );
};

//FETCH REQUESTS
//Handles the deletion of cards/
export const deleteCard = async (uuid: string) => {
    try {
        const response = await fetch(`${API_URL}/cards/delete?uuid=${uuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uuid}), //Values for the card
        });
    
        const data = await response.json();
        if (response.ok){
            alert('Card Deleted Successfully')
        }
    } catch (error) {
        console.error(error);
    }
}

//Sets the balance and uuid instead of adding balance to the cards.
export const updateCard = async (uuid: string, balance: number) => {
    try {
        const response = await fetch(`${API_URL}/manage/cards/update?uuid=${uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uuid, balance}), //Values for the card
        });
    
        const data = await response.json();
        if (response.ok){
            alert('Card Updated Successfully')
        }
    } catch (error) {
        console.error(error);
    }
}

export const tapInCard = async (cardData: CardData, stationData: StationData) => {
    try {
        const response = await fetch(`${API_URL}/cards/tap/in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cardData, stationData}), //Values for the card
        });
    
        const data = await response.json();
        if (response.ok){
            alert('Card Updated Successfully')
        } 

        if (response.status === 403){
            alert('Card is already tapped in. Mismatch fee may occur.')
        }
        
    } catch (error) {
        console.error(error);

    }
}

export const tapOutCard = async (cardData: CardData, stationData: StationData) => {
    try {
        const response = await fetch(`${API_URL}/cards/tap/out`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cardData, stationData}), //Values for the card
        });
    
        const data = await response.json();

        if (response.ok){
            console.log(data)
            alert('Card Tap Out Successful')
        } 

        if (response.status === 403){
            alert('You have insufficient balance to tap out. Please add balance to your card at the booth')
        }

        // if (response.status === 400){
        //     alert('Card is not tapped in. Please tap in at the booth')
        // }
    } catch (error) {
        console.error(error);
    }
}

//Returns the json of the cards fetched from mongodb.
export const getCardList = async () => {   
    try {
        const response = await fetch(`${API_URL}/cards/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }

}

//params idk why
export const getOneCard = async (uuid: string) =>{
    try {
        const response = await fetch(`${API_URL}/cards/getOne?uuid=${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({uuid: uuid})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//Handles the addition of balance to the card.
//Returns true or false since it is called in the addBalanceComponent.tsx
//True if the balance is added successfully, false if not.
export const handleAddBalance = async (inputUuid : String, newBalance: Number) => {
    try {
      const response = await fetch(`${API_URL}/cards/addBalance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ uuid: inputUuid, balance: newBalance})
      });

    
        if (response.ok) {
            return true
        } else if (!response.ok){
            return false;
        }
    } catch (error) {
      console.error(error);
    }
}



export default CardManager