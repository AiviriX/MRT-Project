import React from 'react';

interface Props {
    uuid: string;
    balance: number;
    tappedIn?: boolean;
    sourceStation?: string;
}

const CardEntry: React.FC<Props> = (props) => {
    return (
        <div className='w-64 flex justify-between items-center border-y-4'>
            <div className='mx-4 my-4'>
                <span>UUID: {props.uuid}</span> <br/>
                <span>Balance: {props.balance}</span>
            </div>
            <div className='flex space-x-1'>
                <button className='p-2 bg-green-500 text-white rounded'>Edit</button>
                <button className='p-2 bg-red-500 text-white rounded'>Delete</button>
            </div>
            

        </div>
    );
};

export default CardEntry;
