import React from 'react';
import UpdateCard from './updateCard';



export interface CardProps {
    uuid: string;
    balance: number;
    tappedIn: boolean;
    sourceStation?: string;
    handleDelete: (uuid: string) => void;
}

const CardEntry: React.FC<CardProps> = (props) => {

    const [updateMode, setUpdateMode] = React.useState(false);

    return (
        <div className='w-full flex justify-between items-center border-y-4 '>
            <div className='mx-4 my-4 flex-col'>
                <span>UUID: {props.uuid}</span> <br/>
                <span>Balance: {props.balance}</span><br/>
                <span>Tapped In: {props.tappedIn} </span>
            </div>


            <div className='flex flex-col'>               
                <div className='flex space-x-1'>
                {/* <button 
                    onClick={()=>setUpdateMode(!updateMode)}
                    className='p-2 bg-blue-500 text-white rounded'>
                    {updateMode ? 'Cancel' : 'Update'}
                </button> */}

                    {updateMode ? null : 
                        <button 
                            onClick={() => setUpdateMode(true)}
                            className='p-2 bg-green-500 text-white rounded'>
                            Update Card
                        </button>
                    }                
                    {updateMode ? <UpdateCard
                                    uuid={props.uuid}
                                    balance={props.balance}
                                    tappedIn={props.tappedIn}
                                    sourceStation=''
                                    /> : null}
                    <button 
                        onClick={()=>props.handleDelete(props.uuid)}
                        className='p-2 bg-red-500 text-white rounded'>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default CardEntry;
