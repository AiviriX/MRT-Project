import { MapContainer, TileLayer } from 'react-leaflet';
import { useState, useEffect, Component } from 'react';

import '../stations/station-styles.css';
import MRT3Stations from './mrt3/mrt3-stations';



const Stations = () => {
    const [fare, setFare] = useState();
    const [selectedLine, setSelectedLine] = useState('')
    const [stations, setStations] = useState(<Component/>);

    useEffect(() => {
        if (selectedLine === 'MRT-3') {
            setStations(<MRT3Stations/>)    
            console.log("MEOW!")
        }
    }, [selectedLine])

    useEffect(() => {
        fetchFare();
    }, [])

    const fetchFare = async () => {
        try {
            const response = await fetch('http://localhost:5000/stations/getFare', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            const data = await response.json();
            console.log(data)
            setFare(data[0].farePerKm)
            return data[0];
        } catch (error) {
            console.log(error);
        }
    }

    const handleTrainLineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(event.target.value);
    };


    return (
        <div className='overflow-hidden flex flex-col'> 
            <div className='flex flex-row'>
                <section className='flex w-1/2 bg-blue-500'>
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                        crossOrigin="">
                    </script>

                    {
                    selectedLine === 'MRT-3' ? <MRT3Stations/> : 
                    <MapContainer center={[14.60773659867783, 121.0266874139731]} zoom={12} scrollWheelZoom={true}
                    className='box-border h-32 w-32 p-4 border-4 mx-3 my-3 pos-center z-0'>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                    
                    }
                    
                    {/* <MapContainer center={[14.605711299761166, 121.01869743864975]} zoom={12} scrollWheelZoom={true}
                    className='box-border h-full w-full p-4 border-4 mx-3 my-3 pos-center z-0'>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer> */}
                </section>

                <section className=' items-center w-full flex border-8 bg-gray-500 flex-col '>
                    <h1> Fare Per KM {fare} </h1>
                        <label> Select Line </label> 
                        <select className=''onChange={handleTrainLineChange}>
                            <option value="LRT-1">LRT-1</option>
                            <option value="LRT-2">LRT-2</option>
                            <option value="MRT-3">MRT-3</option>
                        </select>

                    <div className='flex w-full h-full py-12 flex flex-col border-8 border-black items-center space-y-2'>
                        <h1 className='font-bold text-4x1'> Card information </h1>
                        <div className='flex bg-blue-500 h-2/4 w-3/4 rounded'>
                            <h1> NO! </h1>
                        </div>
                        <button className='w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'> Tap IN </button>
                        <button className='w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'> Tap OUT </button>  
                    </div>
                </section>
            </div>
        </div>
    );

}

export default Stations