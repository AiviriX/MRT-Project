import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'
import { useParams } from 'react-router-dom';

Modal.setAppElement('#root');

interface UpdateCardProps {
    uuid: string;
    balance: number,
    tappedIn: boolean,
    sourceStation: string;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ uuid, balance, tappedIn, sourceStation }) => {
  const [newBbalance, setNewBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  


  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewBalance(balance + Number(event.target.value));
  };

  const handleAddBalance = async () => {
    try {
      const response = await fetch(`http://localhost:5000/cards/addBalance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uuid, balance: newBbalance})
      });

      if (!response.ok) {
        throw new Error('Failed to add balance');
      } 
      

      alert('Balance added successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex'>   
      <button className='w-32 h-16 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setIsModalOpen(true)}>Add Balance</button>

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
                        onChange={e => handleBalanceChange(e)}
                        />
            <button 
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddBalance}>
                    Add Balance
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

export default UpdateCard;