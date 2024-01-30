import { useState } from 'react';

const CreateStation = () => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState<[number, number]>([0, 0]);

    const addStation = async () => {
        if (!name || !position) {
            alert('Please fill in all fields')
            return
        }

        try {
            const response = await fetch('http://localhost:5000/stations/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    position
                }), //Values for the station
            });
    
            const data = await response.json();
            if (response.ok){
                alert('Station Added Successfully')
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='flex flex-col space-y-4'>
            <h1> Create Station </h1>
            <label className='text-xl w-1/2'> Name </label>
            <input className='mt-2 p-2 border rounded'
                    placeholder="Name"
                    type="text"
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    />

            <label className='text-xl'> Position </label>
            <input className='mt-2 p-2 border rounded'
                   placeholder="Position"
                   onChange={e => setPosition(e.target.value.split(',').map(Number) as [number, number])}
                   type="text"
                   />
            <button 
                onClick={addStation}
                className='p-2 bg-blue-500 text-white rounded'> Submit </button>
        </div>
    );
};

export default CreateStation;