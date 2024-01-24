import React from 'react';
import { useState, useEffect } from 'react';

const CreateCard = () => {
    const [uuid, setUUID] = useState(0);
    const [balance, setBalance] = useState(0);


    const addCard = async () => {
        const response = await fetch('http://localhost:5000/cards/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uuid, balance}), //Values for the card
        });

        const data = await response.json();
        if (response.ok){
            alert('Card Added Successfully')
        }
        
    }

    const randomizeUUID = () => {
        const randomUUID = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        setUUID(parseInt(randomUUID));
    }

    return (
        <div className='flex flex-col space-y-4'>
            <h1> Create Card </h1>
            <label className='text-xl w-1/2'> UUID </label>
            <div className='flex-row space-x-6 sm:space-y-2'>
                <input className='mt-2 p-2 border rounded'
                        placeholder="UUID"
                        type="number"
                        value={uuid} 
                        // remove notations & operations
                        onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                        onChange={e => setUUID(parseInt(e.target.value))}
                        />
                <button 
                    onClick={() => randomizeUUID()}
                    className='bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'> Randomize </button>
            </div>


            <label className='text-xl'> Initial Balance </label>
                <input className='mt-2 p-2 border rounded'
                       placeholder="Initial Balance"
                       onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                       onChange={e => setBalance(parseInt(e.target.value))}
                       type="number"
                       />
            <button 
                onClick={addCard}
                className='p-2 bg-blue-500 text-white rounded'> Submit </button>
        </div>
    );
};

export default CreateCard;