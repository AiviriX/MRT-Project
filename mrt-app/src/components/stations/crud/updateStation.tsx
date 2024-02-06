import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { API_URL } from '../../..';
import StationData from '../stationData';
import { MapContainer, useMapEvents, TileLayer, Marker } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { fetchStationData, getConnectedStations, getStation } from '../manager';
import Select from 'react-select'
interface UpdateStationProps {
    isOpen: boolean;
    onRequestClose: () => void;
    stationData: StationData
    listOfStations?: StationData[]
}

const UpdateStation: React.FC<UpdateStationProps> = ({ isOpen, onRequestClose, stationData}) => {
    const [name, setName] = useState(stationData.stationName);
    const [lat, setLat] = useState(stationData.coordinates[0]);
    const [long, setLong] = useState(stationData.coordinates[1]);
    const [markerPosition, setMarkerPosition] = useState<LatLng | [0,0]>();
    const [connectedStationsData, setConnectedStationsData] = useState<StationData[]>([]);
    const [allStations, setAllStations] = useState<StationData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState(isOpen);

    const [connectedStations, setConnectedStations] = useState<string[]>([]); //The actual value to pass to the db
    const [selectedConnectedStations, setSelectedConnectedStations] = useState<string[]>([]); //To show on the selection

    useEffect(() => {
        // Initialize selectedConnectedStations with initial connected stations from the database
        setSelectedConnectedStations(connectedStations);
    }, [connectedStations]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const stations = await getStation('mrt-3'); // Fetch all stations using the getStation function
                setAllStations(stations);
                setLoading(false);  
            } catch (error) {
                console.error('Error fetching stations:', error);
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const remainingStations = allStations.filter(station => !connectedStations.includes(station._id));


    //gets connected stations from the thing and puts it in the state variable
    useEffect(() => {
        const fetchConnectedStations = async () => {
            try {
                const connectedStations = await getConnectedStations(stationData);
                setConnectedStations(connectedStations);
            } catch (error) {
                console.error('Error fetching connected stations:', error);
            }
        };


        //Load 
        if (isOpen && stationData) {
            fetchConnectedStations();
        }
    }, [isOpen, stationData]);
    

    useEffect(() => {
        const fetchConnectedStationsData = async () => {
            if (connectedStations && connectedStations.length > 0) {
                const stationsData = await Promise.all(
                    connectedStations.map(async (stationId) => {
                        const data = await fetchStationData(stationId);
                        return data || null;
                    })
                );
                setConnectedStationsData(stationsData.filter(Boolean) as StationData[]);
            }
        };
    
        fetchConnectedStationsData();
    }, [connectedStations]);

    const MapEvents = () => {
        const map = useMapEvents({
            click(e) {
                // Handle map click event here
                console.log(`Map clicked at coordinates: ${e.latlng.lat}, ${e.latlng.lng}`)
                setLat(e.latlng.lat);
                setLong(e.latlng.lng);
                setMarkerPosition(e.latlng);   
            },
        });
        return null;
    }

    const updateStation = async () => {
        if (!name || !lat || !long) {
            alert('Please fill in all fields')
            return
        }
        

        if (!window.confirm(`Are you sure you want to update ${stationData.stationName}?`)) {
            return
        }

        try {
            if (selectedConnectedStations.length > 0) {
                    const response = await fetch(`${API_URL}/stations/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ //Send new details to the server
                            stationId: stationData._id, //station id
                            stationName: name, //new name
                            coordinates: [lat, long], //new coords 
                            connectedStation: connectedStations
                        }), 
                    });
            
                    const data = await response.json();
                    if (response.ok){ 
                        alert('Station Updated Successfully')
                        onRequestClose()
                    } else {
                        alert('Error updating station')
                    }
            } else {
                    const response = await fetch(`${API_URL}/stations/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ //Send new details to the server
                            stationId: stationData._id, //station id
                            stationName: name, //new name
                            coordinates: [lat, long], //new coords 
                        }), 
                    });
            
                    const data = await response.json();
                    if (response.ok){ 
                        alert('Station Updated Successfully')
                        onRequestClose()
                    } else {
                        alert('Error updating station')
                    }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onRequestClose={onRequestClose}
                className="flex items-center justify-center p-4 z-50"
            >
                <div className='flex flex-row space-y-4 bg-white rounded-lg p-6 shadow-lg'>
                    <section className='flex flex-col space-y-4 mr-4'>
                        <h1 className='text-2xl font-bold'> Update Station </h1>
                        <label className='text-lg'> Station Name </label>
                        <input 
                            className='mt-2 p-2 border rounded'
                            placeholder="Station Name"
                            type="text"
                            value={name} 
                            onChange={e => setName(e.target.value)}
                        />

                        <label className='text-lg'> Coordinates (Lat. Long.)  </label>
                        <div className='flex flex-row space-x-2'>
                            <input 
                                className='mt-2 p-2 border rounded w-full'
                                placeholder="Latitude"
                                onKeyDown={(evt) => ["e", "E", "+",].includes(evt.key) && evt.preventDefault()}
                                onChange={e => setLat(Number(e.target.value))}
                                type="number"
                                value={lat}
                            />
                            <input 
                                className='mt-2 p-2 border rounded w-full'
                                placeholder="Longitude"
                                onKeyDown={(evt) => ["e", "E", "+", "."].includes(evt.key) && evt.preventDefault()}
                                onChange={e => setLong(Number(e.target.value))}
                                type="number"
                                value={long}
                            />                    
                        </div>

                        <label className='text-lg'> Connected Stations </label>
                        <Select
                            isMulti
                            options={remainingStations.map(station => ({ value: station._id, label: station.stationName }))}
                            value={selectedConnectedStations.map(stationId => ({ value: stationId, label: allStations.find(station => station._id === stationId)?.stationName}))}
                            onChange={(selectedOptions: any) => {
                                const selectedStationIds = selectedOptions.map((option: any) => option.value);
                                setSelectedConnectedStations(selectedStationIds);
                                setConnectedStations(selectedStationIds);
                            }}
                        />


                        
                        <button 
                            onClick={updateStation}
                            className='p-2 bg-green-500 text-white rounded w-full mt-2'
                        > 
                            Update Station 
                        </button>
                        <button
                            onClick={onRequestClose}
                            className='p-2 bg-red-500 text-white rounded w-full mt-2'
                        > 
                            Close 
                        </button>               
                    </section>

                    <MapContainer 
                        center={[14.60773659867783, 121.0266874139731]} 
                        zoom={12} 
                        scrollWheelZoom={true}
                        className='flex-grow box-border w-full h-full maxw-32 maxh-32 border-4 pos-center z-0'
                    >
                        <link 
                            rel="stylesheet" 
                            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
                            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
                            crossOrigin="" 
                        />
                        <script 
                            src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                            crossOrigin=""
                        >
                        </script>
                        
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[lat, long] }> </Marker>
                    
                        <MapEvents/>
                    </MapContainer>
                </div>
            </Modal>
        </>
    );
    
}

export default UpdateStation;