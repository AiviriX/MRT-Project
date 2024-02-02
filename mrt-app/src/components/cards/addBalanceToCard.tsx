import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'
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
  const [isSuccessModalOpen, setSuccessModal] = useState(false);
  const [newBalance, setNewBalance] = useState(balance); //Pass newBalance to handleAddBalance as a parameter to update the balance.
  const [isBalanceModalOpen, setIsBalanceModal] = useState(false);
  const [isFailureModalOpen, setFailModal] = useState(false);

  //Gets the value of the input field for adding balance, and sets it as the new balance.
  const getBalanceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setNewBalance(balance + Number(event.target.value));
    }
  };

  const callAddBalance = async (uuid: String, newBalance: number) => {
    if (newBalance < 0) {
      alert('Balance cannot be negative')
      return
    }

    if (balance > 10000) {
      alert('Balance cannot be greater than 10000')
      return
    }
    
    if (await handleAddBalance(uuid, newBalance)) {
      setIsBalanceModal(false);
      setSuccessModal(true);
      handleRefresh();
    } else {
      setSuccessModal(false);
      setFailModal(true);
    }
  }

  return (
    <div className='flex space-x-1'>   
      <button className='w-32 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
       onClick={() => setIsBalanceModal(true)}>Add Balance
      </button>

      <button className=' h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Tap in
      </button>

      <button className=' h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
        Tap out
      </button>

      <Modal
        isOpen={isBalanceModalOpen}
        onRequestClose={() => setIsBalanceModal(false)}
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
                onClick={() => setIsBalanceModal(false)}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Close
            </button>
        </div>

      </Modal>

      
      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={() => {}}
        contentLabel="Success Modal"
        style={{
          content: {
            width: '500px', // Set the width of the modal
            height: '300px', // Set the height of the modal
            margin: 'auto', // Center the modal on the page
          },
        }}
      >
        <p>Balance added successfully</p>
        <button className='w-32 h-10 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => setSuccessModal(false)}>OK
        </button>
      </Modal>

      <Modal
        isOpen={isFailureModalOpen}
        onRequestClose={() => {}}
        contentLabel="Failure Modal"
        style={{
          content: {
            width: '500px', // Set the width of the modal
            height: '300px', // Set the height of the modal
            margin: 'auto', // Center the modal on the page
          },
        }}
      >
        <p>Balance add failed</p>
        <button className='w-32 h-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => setFailModal(false)}>OK
        </button>
    </Modal>
      </div>
  );
};



export default AddBalanceToCard;