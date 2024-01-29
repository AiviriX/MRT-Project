import React, { useState } from 'react';
import Modal from 'react-modal';

// This line is needed to bind the modal to your appElement
Modal.setAppElement('#root');

const Fare: React.FC = () => {
  const [fare, setFare] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleFareChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFare(Number(event.target.value));
  };

  const handleUpdateFare = async () => {
    try {
      const response = await fetch(`http://localhost:5000/stations/setFare`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fare })
      });

      if (!response.ok) {
        throw new Error('Failed to update fare');
      }

      alert('Fare updated successfully');
      console.log(isModalOpen)
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex-row justify-center items-center h-screen bg-gray-200 p-4'>   
        <h1 className='text-2xl font-bold mb-4'>Update fare per KM </h1>
        <h1 className='text-2xl font-bold mb-4'>Current Fare: {} </h1>

        <input className='border-2 border-gray-300 p-2 w-full mb-4 rounded-md' type="number" onChange={handleFareChange} />
        <button className='w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700' onClick={handleUpdateFare}>Update Fare</button>
        <button className='w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 mt-4' onClick={() => setIsModalOpen(false)}>Close</button>
      {/* </Modal> */}
    </div>
  );
};

export default Fare;