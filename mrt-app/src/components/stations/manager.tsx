//stations/manager.tsx
import React, { useState, useEffect } from 'react';
import StationEntry from './stationEntry'; // Import the StationEntry component
import CreateStation from './createStation';
import { MapContainer, TileLayer } from 'react-leaflet';
import MRT3Stations from './mrt3/mrt3-stations';

//import url from index
import { API_URL } from '../../index';

type Station = {
  name: string;
  position: [number, number];
};

const StationsManager = () => {
  const [stations, setStations] = useState<Station[]>([
    // { name: 'Station 1', position: [14.635222115280635, 121.04333937202267] },
    // // Add more initial stations here...
  ]);


  const [stationAction, setStationAction] = useState('');
  const [trainLine, setTrainLine] = useState('');
  


  const handleTrainLineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTrainLine(event.target.value);
  };

  const deleteStation = (name: string) => {
    setStations(prevStations => prevStations.filter(station => station.name !== name));
  };

  const renderTrainMap = () => {
    if (trainLine === 'MRT-3') {
      return <MRT3Stations/>;
    }
  }

  useEffect(() => {
    const renderAction = () => {
      if (stationAction === 'create') {
        return <CreateStation isOpen={true} onRequestClose={() => setStationAction('')}/>;
      }
  
      if (stationAction === 'read') {
        return stations.map((station, index) => (
          <StationEntry key={index} name={station.name} position={station.position} handleDelete={deleteStation} handleRefresh={() => {}} />
        ));
      }
    };

    renderAction()
  },[stationAction])



  return (

    
    <div className="flex h-screen overflow-hidden">
        <aside className="w-64 h-auto bg-gray-800 text-white p-6 space-y-6">
            <h1 className="text-xl font-bold">Stations Manager</h1>
            <p className='justify'>You can also click the map twice to create a station</p>
            <button
              onClick={() => setStationAction('create')}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create Station
            </button>
            <button
              onClick={() => setStationAction('read')}
              className="w-full bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              List Stations
            </button>
        </aside>
        <div className='bg-blue-500'>
            <main className="flex-grow overflow-auto h-screen">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                        crossOrigin="">
                    </script>
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                    {renderTrainMap()}
                    {/* <MapContainer center={[14.60773659867783, 121.0266874139731]} zoom={12} scrollWheelZoom={true}
                        className='box-border h-32 w-32 p-4 border-4 mx-3 my-3 pos-center z-0'>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                    {}
                    </MapContainer> */}
            </main>
    </div>

    <section className='flex flex-col items-center w-1/2 space-y-1'>
            <div className='flex flex-col border-2 w-full items-center'>
                <h1 className='text-1xl font-bold mb-4'> Fare Per KM {} </h1>
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
        </section>
        <section>
        <div className='bg-blue-500'>
            <main className="flex-grow overflow-auto h-screen">
                {stationAction === 'create' && <CreateStation isOpen={true} onRequestClose={() => setStationAction('')}/>} {/* Render CreateStation when stationAction is 'create' */}
            </main>
        </div>
        </section>
    </div>
  );
};

const createStation = async (station: Station) => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(station),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Station Added Successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

//Returns the list of stations from the db
export const getStation = async (trainLine: String) => {
  try {
    const response = await fetch(`${API_URL}/stations/get/${trainLine}`);
    const data = await response.json();
    if (response.ok) {
      return data
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export default StationsManager;