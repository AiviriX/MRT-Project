//stations/index.tsx
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useState, useEffect, Component } from 'react';
import MRT3Stations from './mrt3/mrt3-stations';
import { CardData, getOneCard } from '../cards/manager';

import '../stations/station-styles.css';
import { getFare } from './fare';
import CardEntry from '../cards/cardEntry';


const Stations = () => {
    const [fare, setFare] = useState();
    const [selectedLine, setSelectedLine] = useState('')

    const [searchUUID, setSearchUUID] = useState('');
    const [searchCardEntry, setSearchCardEntry] = useState<CardData | null | undefined>();
    const [selectedStation, setSelectedStation] = useState();
    const [stations, setStations] = useState(<Component/>);
    const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (selectedLine === 'MRT-3') {
            setStations(<MRT3Stations/>)    
            console.log("MEOW!")
        }
    }, [selectedLine])

    useEffect(() => {
        getFareAndUpdateUI();
    }, [])


    const getCard = async (uuid: string) => {
        try {
            const fetchedCard = await getOneCard(uuid);
            console.log('fetched: ' + fetchedCard)
            setSearchCardEntry(fetchedCard);
        } catch (error) {
            console.error(error);
        }
    }    

    const getFareAndUpdateUI = async () => {
        try {
            const fareData = await getFare();
            setFare(fareData.farePerKm);
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
                <section className='flex w-1/2 bg-gray-800 rounded'>
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                        crossOrigin="">
                    </script>

                    {
                    selectedLine === 'MRT-3' ? <MRT3Stations/> : 
                    <MapContainer
                        center={[14.60773659867783, 121.0266874139731]}
                        zoom={12} scrollWheelZoom={true}
                        className='box-border h-32 w-32 p-4 border-4 mx-3 my-3 pos-center z-0'
                        >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                    
                    }
                </section>

                <section className='flex flex-col items-center w-full space-y-1'>
                    <div className='flex flex-col border-2 w-full items-center'>
                        <h1 className='text-1xl font-bold mb-4'> Fare Per KM {fare} </h1>
                        <label className='mb-2 font-bold'> Select Line </label> 
                        <select 
                            className='w-1/2 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none' 
                            onChange={handleTrainLineChange}
                        >
                            <option value="LRT-1">LRT-1</option>
                            <option value="LRT-2">LRT-2</option>
                            <option value="MRT-3">MRT-3</option>
                        </select>


                        <div className='mb-8 justify-center'>
                            <h2 className='font-bold text-2xl mb-2'> Selected Station </h2>
                            <h1> No Station Selected </h1>
                            {/* <p> Station Name: {} </p>
                            <p> Station ID: {} </p> */}
                            {/* Add more station details as needed */}
                        </div>
                    </div>

                    <div className='flex sm:flex-col w-full h-full py-2 border-2 rounded border-gray-800 items-center space-y-1'>
                        <h1 className='font-bold  mb-4'> Card information </h1>
                        <div className='flex flex-row w-1/2'>
                            <input
                                className='flex px-3 py-2 text-gray-700 border rounded-lg focus:outline-none'
                                type='number'
                                placeholder='Search UUID'
                                onChange={(e)=>setSearchUUID(e.target.value)}
                                /> 
                            <button className='flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                    onClick={()=>getCard(searchUUID)}> Search </button>    
                        </div>
                        <div className='flex bg-blue-500 h-2/4 w-3/4 rounded mb-4'>
                            {searchCardEntry ?
                                <div className='flex flex-col'>
                                    <h1> Card UUID: {searchCardEntry?.uuid} </h1>
                                    <h1> Card Balance: {searchCardEntry?.balance} </h1>
                                    <h1> Card Tapped In: {searchCardEntry?.tappedIn.toString()} </h1>
                                    <h1> Card Source Station: {searchCardEntry?.tappedInStation} </h1>
                                </div>
                                  :
                                <h1> Card Not Found </h1>}
                        </div>
                        <div className='flex space-x-2'>
                            <button className=' bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'> Tap IN </button>
                            <button className=' bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'> Tap OUT </button>  
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

}

//Export function to get data

export default Stations