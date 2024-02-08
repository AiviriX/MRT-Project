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


export const CardManager = () => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [cardAction, setCardAction] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); //Search Query for the cards.

    //Token Hooks :(
    const [hasToken, setToken] = useState(hasSessionToken());

    //Handle Reload when updating datas
    const [reload, triggerReload] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async (uuid: string) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            await deleteCard(uuid);
            triggerReload(!reload); //Triggers reload everytime this is toggled.
          }
    };

    const refreshCardListFromChild = () => {
        triggerReload(!reload);
    }

    //Refreshes the list of cards.
    useEffect(() => {
        const refreshCard = async () => {
            try {
                const fetchedCards = await getCardList();
                setCards(fetchedCards);

            } catch (error) {   
                console.error(error);
            }
            // console.log(cards[2])
        }
        // let x = GetCardList();
        // x.then((data) => {
        //     setCards(data);
        // });
        refreshCard()
        // console.log(cards)

    }, [cardAction, reload]);



    return (
        <>
         {
            hasToken ? (
                
                <div className="flex h-screen overflow-hidden">
                    <aside className="w-64 h-auto bg-gray-800 text-white p-6 space-y-6">
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
                        {   
                                cardAction === 'create' ? <CreateCard/> :

                                    cards ? cards.map((card) => {
                                        return (
                                            <CardEntry
                                                uuid={card.uuid}
                                                balance={card.balance}
                                                tappedIn={card.tappedIn}
                                                sourceStation={card.tappedInStation}
                                                handleDelete={handleDelete}
                                                handleRefresh={refreshCardListFromChild}
                                            />
                                        )
                                    }) : (<h1> No Cards Found </h1>)

                            }

                    </main>
                </div>
            ) : (
                navigate('/noaccess')
            )
         }
            {/* Ref: http://localhost:3000/cards/manage/edit-card?152782488772 */}
        </>
    )
}

//FETCH REQUESTS
//Handles the deletion of cards/
export const deleteCard = async (uuid: string) => {
    try {
        const response = await fetch(`http://localhost:5000/cards/delete?uuid=${uuid}`, {
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
export const overwriteCard = async (uuid: string, balance: number) => {
    try {
        const response = await fetch(`http://localhost:5000/manage/cards/update?uuid=${uuid}`, {
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

//Returns the json of the cards fetched from mongodb.
export const getCardList = async () => {   
    try {
        const response = await fetch('http://localhost:5000/cards/get', {
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

export const getOneCard = async (uuid: string) =>{
    try {
        const response = await fetch(`http://localhost:5000/cards/getOne?uuid=${uuid}`, {
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
      const response = await fetch(`http://localhost:5000/cards/addBalance`, {
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