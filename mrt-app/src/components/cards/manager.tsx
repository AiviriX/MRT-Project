import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateCard from '../cards/createCard';
import CardEntry from './cardEntry';
import { hasSessionToken } from '../../auth/sessionTokenManager';

export interface Card {
    uuid: string;
    balance: number;
    tappedIn: boolean;
    tappedInStation?: string;
};

export const CardManager = () => {


    const [cards, setCards] = useState<Card[]>([]);
    const [cardAction, setCardAction] = useState('');
    const navigate = useNavigate();

    //Token Hooks :(
    const [hasToken, setToken] = useState(hasSessionToken());

    //Handle Reload when updating datas
    const [reload, triggerReload] = useState(false);

    const handleDelete = async (uuid: string) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            await deleteCard(uuid);
            triggerReload(!reload);
          }
    };

    //Refreshes the list of cards.
    useEffect(() => {
        let x = GetCardList();
        x.then((data) => {
            setCards(data);
        });
    }, [cardAction, reload]);



    return (
        <>
         {
            hasToken ? (
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

                <main className="flex-grow p-6 overflow-auto h-screen">
                    <div className=''>                        {
                            cardAction === 'create' ? <CreateCard/> :
                            cards.map((card, index) => (
                                <>
                                    <CardEntry
                                        key={index}
                                        uuid={card.uuid}
                                        tappedIn={card.tappedIn}
                                        balance={card.balance}
                                        handleDelete={handleDelete}
                                    />                                    
                                </>

                            )) 
                        }
                    </div>
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
        console.log(error);
    }
}

export const updateCard = async (uuid: string, balance: number) => {
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
        console.log(error);
    }
}


export const GetCardList = async () => {   
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
        console.log(error);
    }

}


export default CardManager