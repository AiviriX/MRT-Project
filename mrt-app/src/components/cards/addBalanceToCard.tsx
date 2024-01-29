import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'
import { useParams } from 'react-router-dom';
import { Card, getCardList } from './manager';
import { handleAddBalance } from './manager';

Modal.setAppElement('#root');


interface UpdateCardProps {
    uuid: string;
    balance: number,
    tappedIn: boolean,
    sourceStation: string;
    handleRefresh: () => void;
}


export const AddBalanceToCard: React.FC<UpdateCardProps> = ({ uuid, balance, tappedIn, sourceStation, handleRefresh }) => {
  const [newBalance, setNewBalance] = useState(balance); //Pass newBalance to handleAddBalance as a parameter to update the balance.
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Gets the value of the input field for adding balance, and sets it as the new balance.
  const getBalanceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setNewBalance(balance + Number(event.target.value));
    }
  };

  const callAddBalance = async (uuid: String, newBalance: Number) => {
    if (await handleAddBalance(uuid, newBalance)) {
      alert('Balance added successfully');
      setIsModalOpen(false);
      //Now apply refresh logic here to update the cards list
      handleRefresh();

      // const updatedCards = await getCardList();
      // setCards(updatedCards);
    } else {
      alert('Balance add failed')
    }
  }

  return (
    <div className='flex space-x-1'>   
      <button className='w-32 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
       onClick={() => setIsModalOpen(true)}>Add Balance
      </button>

      <button className=' h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Tap in
      </button>

      <button className=' h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Tap out
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Balance Modal"
        style={{
            content: {
              width: '500px', // Set the width of the modal
              height: '300px', // Set the height of the modal
              margin: 'auto', // Center the modal on the page
            },
          }}
      >
        <div className='space-y-2'>
            <h1>Add Balance to {uuid}</h1>
            <h1>Current Balance: {balance} </h1>
            <input className='mt-2 p-2 border rounded'
                        placeholder="Additional Balance"
                        type="number"
                        // remove notations & operations
                        onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                        onChange={e => getBalanceInput(e)}
            />
            <button 
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={()=>callAddBalance(uuid, newBalance)}
            >
                  Confirm Add balance 
            </button>
            <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Close
            </button>
        </div>

      </Modal>
    </div>
  );
};



export default AddBalanceToCard;