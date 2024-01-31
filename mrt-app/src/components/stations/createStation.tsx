import { useState } from 'react';
import Modal from 'react-modal';    

import { API_URL } from '../..';

interface CreateStationProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

const CreateStation: React.FC<CreateStationProps> = ({ isOpen, onRequestClose: onrequestClose }) => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState<[number, number]>([0, 0]);
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(isOpen);

    const addStation = async () => {
        if (!name || !position) {
            alert('Please fill in all fields')
            return
        }

        setPosition([lat, long]);

        try {
            console.log(`${API_URL}/stations/add`)
            const response = await fetch(`${API_URL}/stations/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    stationName: name,
                    coordinates: position
                }), 
            });
    
            const data = await response.json();
            if (response.ok){ 
                alert('Station Added Successfully')
                setModalIsOpen(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <Modal isOpen={modalIsOpen} onRequestClose={onrequestClose}
                style={{
                    content: {
                    width: '500px', // Set the width of the modal
                    height: '500px', // Set the height of the modal
                    margin: 'auto', // Center the modal on the page
                    },
                }}                
            >
                <div className='flex flex-col space-y-4'>
                    <h1> Create Station </h1>
                    <label className='text-xl w-1/2'> Station Name </label>
                    <input className='mt-2 p-2 border rounded'
                            placeholder="Station Name"
                            type="text"
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            />

                    <label className='text-xl'> Coordinates (Lat. Long.)  </label>
                    <div className='flex flex-row'>
                        <input className='mt-2 p-2 border rounded'
                            placeholder="Latitude"
                            onKeyDown={(evt) => ["e", "E", "+",].includes(evt.key) && evt.preventDefault()}
                            onChange={e => setLat(Number(e.target.value))}
                            type="number"
                        />
                        <input className='mt-2 p-2 border rounded'
                            placeholder="Longitude"
                            onKeyDown={(evt) => ["e", "E", "+", "."].includes(evt.key) && evt.preventDefault()}
                            onChange={e => setLong(Number(e.target.value))}
                            type="number"
                        />                            
                    </div>
                    <button 
                        onClick={addStation}
                        className='p-2 bg-green-500 text-white rounded'> Add Station </button>
                    <button
                        onClick={onrequestClose}
                        className='p-2 bg-red-500 text-white rounded'> Close </button>
                    
                </div>
            </Modal>
        </>
    );
}

export default CreateStation;