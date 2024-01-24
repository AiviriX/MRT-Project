import React from 'react';
import { Link } from 'react-router-dom';



interface Props {
    uuid: string;
    balance: number;
    tappedIn?: boolean;
    sourceStation?: string;
    handleUpdate: (uuid: string) => void;
}

const CardEntry: React.FC<Props> = (props) => {
    return (
        <div className='w-full flex justify-between items-center border-y-4 '>
            <div className='mx-4 my-4'>
                <span>UUID: {props.uuid}</span> <br/>
                <span>Balance: {props.balance}</span>
            </div>
            <div className='flex space-x-1'>
                <button className='p-2 bg-green-500 text-white rounded'>
                {/* Ref: http://localhost:3000/cards/manage/edit-card?152782488772 */}
                    <Link to={`edit-card/${props.uuid}`}>Edit</Link>
                </button>
                <button 
                    onClick={()=>props.handleUpdate(props.uuid)}
                    className='p-2 bg-red-500 text-white rounded'>Delete</button>
            </div>
            

        </div>
    );
};

export default CardEntry;
