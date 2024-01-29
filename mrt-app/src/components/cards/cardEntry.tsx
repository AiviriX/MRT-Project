//This component holds the card information and the card actions.

import React from 'react';
import AddBalanceToCard from './addBalanceToCard';

export interface CardProps {
    uuid: string;
    balance: number;
    tappedIn: boolean;
    sourceStation?: string;
    handleDelete: (uuid: string) => void;
    handleRefresh: () => void;
}

const CardEntry: React.FC<CardProps> = (props) => {
    //UpdateMode is used to determine whether the user is updating the card or not.
    const [updateMode, setUpdateMode] = React.useState(false);
    console.log("Tapped? " + props.tappedIn)
    return (
        <div className='w-full flex justify-between items-center border-y-4 '>
            <div className='mx-4 my-4 flex flex-col'>
                <span>UUID: {props.uuid}</span>
                <span>Balance: {props.balance}</span>
                <span>Tapped In: {props.tappedIn ? 'True' : 'False'} </span>
                <span>Tapped From: {props.sourceStation ? props.sourceStation:"N/A"}</span>
            </div>


            <div className='flex flex-col'>               
                <div className='flex space-x-1'>
                    {
                     updateMode ? null : 
                     <>
                        <button 
                            onClick={() => setUpdateMode(true)}
                            className='p-2 bg-green-500 text-white rounded'>
                            Update Card
                        </button>
                    </>
                    }                
                    {
                     updateMode ? <AddBalanceToCard
                                    uuid={props.uuid}
                                    balance={props.balance}
                                    tappedIn={props.tappedIn}
                                    sourceStation=''
                                    handleRefresh={props.handleRefresh}
                                    /> : null
                    }
                        <button 
                        onClick={()=>props.handleDelete(props.uuid)}
                        className='p-2 bg-red-500 text-white rounded'>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default CardEntry;
