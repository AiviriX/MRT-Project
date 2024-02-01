import { useState } from 'react';
import Modal from 'react-modal';    

import { API_URL } from '../..';

//Select stations when marker is clicked

interface CreateStationProps {
    isOpen: boolean;
    onRequestClose: () => void;
    coordinates? : [number, number];
}

//Note: The CreateStation component relies on the hooks of the (parent) component that called it to close
//the modal. This is because the CreateStation component does not have
//access to the state of the parent component.
const CreateStation: React.FC<CreateStationProps> = ({ isOpen, onRequestClose: onrequestClose, coordinates }) => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState([0,0]);
    const [lat, setLat] = useState(coordinates ? coordinates[0] : 0);
    const [long, setLong] = useState(coordinates ? coordinates[1] : 0);
    const [modalIsOpen, setModalIsOpen] = useState(isOpen);

    const addStation = async () => {
        let newLat, newLong;
        //Manual input from create station button
        if (!name || !position) {
            alert('Please fill in all fields')
            return
        }

        //Auto input from map click
        if (coordinates) {
            console.log('CR', coordinates)
            newLat = coordinates[0];
            newLong = coordinates[1];
            setLat(newLat);
            setLong(newLong);
            console.log('CR', newLat, newLong)
        }



        try {
            console.log(`${API_URL}/stations/add`)
            const response = await fetch(`${API_URL}/stations/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    stationName: name,
                    coordinates: [newLat, newLong]
                }), 
            });
    
            const data = await response.json();
            if (response.ok){ 
                alert('Station Added Successfully')
                onrequestClose()
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
                            value={lat}
                        />
                        <input className='mt-2 p-2 border rounded'
                            placeholder="Longitude"
                            onKeyDown={(evt) => ["e", "E", "+", "."].includes(evt.key) && evt.preventDefault()}
                            onChange={e => setLong(Number(e.target.value))}
                            type="number"
                            value={long}
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