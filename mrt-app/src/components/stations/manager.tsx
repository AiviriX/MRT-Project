//stations/manager.tsx
import React, { useState, useEffect } from 'react';
import StationEntry from './stationEntry'; // Import the StationEntry component
import CreateStation from './createStation';
import { MapContainer, TileLayer } from 'react-leaflet';
import MRT3Stations from './mrt3/mrt3-stations';
import { API_URL } from '../../index';
import StationData from './stationData';




type Station = {
  name: string;
  position: [number, number];
};


export const StationsManager = () => {
  const [stations, setStations] = useState<Station[]>([
    // { name: 'Station 1', position: [14.635222115280635, 121.04333937202267] },
    // // Add more initial stations here...
  ]);


  const [stationAction, setStationAction] = useState('');
  const [trainLine, setTrainLine] = useState('');
  const [selectedMarker, setSelectedMarker] = useState({} as StationData);


  const handleTrainLineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTrainLine(event.target.value);
  };



  const renderTrainMap = () => {
    if (trainLine === 'MRT-3') {
      return <MRT3Stations setSelectedMarker={setSelectedMarker} />;
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

    
    <div className="flex h-screen overflow-x">
        <aside className="w-64 h-auto bg-gray-800 text-white p-6 space-y-6">
            <h1 className="text-xl font-bold">Stations Manager</h1>
            <p className='justify'>You can also click the map, and the new marker to create a station</p>
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
                    <h1 className='font-bold text-2xl mb-2'> Selected Station: </h1>
                    {
                      selectedMarker && selectedMarker.coordinates ?
                        <div>
                          <h1 className='text-xl font-bold'> {selectedMarker.stationName} </h1> 
                          <h2> Latitude {selectedMarker.coordinates[0]} </h2>
                          <h2> Longitude {selectedMarker.coordinates[1]} </h2>
                          <button
                            onClick={() => deleteStation(selectedMarker.stationName)}
                            className='p-2 bg-red-500 text-white rounded'> Delete Station </button>
                        </div> 
                      :
                       <h1> No Station Selected </h1>
                    }
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

//Idk why we have 2 of the same code on createStation but i'll put it here just in case.
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

export const deleteStation = async (station: String) => {
  try {
    const response = await fetch(`${API_URL}/stations/delete/${station}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(station),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Station Deleted Successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export default StationsManager;