//StationModal.tsx
//This file contains the component for the StationModal.
//This component is used to create and update stations.
//The component is used in the MRT3Stations component.

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { MapContainer, useMapEvents, TileLayer, Marker } from 'react-leaflet';
import { LatLng } from 'leaflet';
import Select from 'react-select';
import { fetchStationData, getConnectedStations, getStationList } from '../manager';
import { API_URL } from '../../..';
import { StationData } from '../stationData';
import calculateDistance from '../../distanceCalculator';

interface StationProps {
    isOpen: boolean;
    onRequestClose: () => void;
    mode: 'create' | 'update';
    stationData?: StationData;
    coordinates?: [number, number];
}

const StationModal: React.FC<StationProps> = ({ isOpen, onRequestClose, mode, stationData, coordinates }) => {
    const [name, setName] = useState('');
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [markerPosition, setMarkerPosition] = useState<LatLng | [0,0]>([0,0]);
    const [connectedStationsData, setConnectedStationsData] = useState<StationData[]>([]);
    const [allStations, setAllStations] = useState<StationData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [connectedStations, setConnectedStations] = useState<string[]>([]);
    const [selectedConnectedStations, setSelectedConnectedStations] = useState<string[]>([]);
    const [distances, setDistances] = useState<number>(0);
  

    useEffect(() => {
        if (stationData){
            if (mode === 'update') {
                setName(stationData.stationName);
                setLat(stationData.coordinates[0]);
                setLong(stationData.coordinates[1]);
                setConnectedStations(stationData.connectedStation);
                setSelectedConnectedStations(stationData.connectedStation);
            }
        }
        if (mode === 'create' && coordinates) {
            setLat(coordinates[0]);
            setLong(coordinates[1]);
            setMarkerPosition(new LatLng(coordinates[0], coordinates[1]));
        }
    }, [mode, stationData, coordinates]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const stations = await getStationList('mrt-3');
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

    useEffect(() => {
        const fetchConnectedStations = async () => {
            try {
                if (isOpen && stationData) {
                    const connectedStations = await getConnectedStations(stationData);
                    setConnectedStations(connectedStations);
                }
            } catch (error) {
                console.error('Error fetching connected stations:', error);
            }
        };
    
        fetchConnectedStations();
    }, [isOpen]);
    

    // useEffect(() => {
    //     const fetchConnectedStations = async () => {
    //         try {
    //             if (stationData) {
    //                 const connectedStations = await getConnectedStations(stationData);
    //                 setConnectedStations(connectedStations);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching connected stations:', error);
    //         }
    //     };

    //     if (isOpen && stationData) {
    //         fetchConnectedStations();
    //     }
    // }, [isOpen, stationData]);

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
                setLat(e.latlng.lat);
                setLong(e.latlng.lng);
                setMarkerPosition(e.latlng);   
                allStations.forEach(station => {
                    const distance = calculateDistance(
                        { coordinates: [lat, long] } as StationData, 
                        { coordinates: [station.coordinates[0], station.coordinates[1]] } as StationData
                    );
                    console.log(`Distance to ${station.stationName}: ${distance} meters`);
                });
            },
        });
        return null;
    }

    const handleStationSubmit = async () => {
        if (!name || !lat || !long) {
            alert('Please fill in all fields');
            return;
        }

        try {
            let response;
            const requestData = {
                stationId: stationData?._id,
                stationName: name,
                coordinates: [lat, long],
                connectedStation: selectedConnectedStations
            };

            if (mode === 'create') {
                response = await fetch(`${API_URL}/stations/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
            } else if (mode === 'update' && stationData) {
                requestData['stationId'] = stationData._id;
                response = await fetch(`${API_URL}/stations/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
            }

            if (response && response.ok) {
                alert('Station updated successfully');
                onRequestClose();
            } else {
                alert('Error updating station');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose}
            className="flex items-center justify-center p-4 z-50"
        >
            <div className='flex flex-row space-y-4 bg-white rounded-lg p-6 shadow-lg'>
                <section className='flex flex-col space-y-4 mr-4'>
                    <h1 className='text-2xl font-bold'>{mode === 'create' ? 'Create Station' : 'Update Station'}</h1>
                    <label className='text-lg'>Station Name</label>
                    <input 
                        className='mt-2 p-2 border rounded'
                        placeholder="Station Name"
                        type="text"
                        value={name} 
                        onChange={e => setName(e.target.value)}
                    />

                    <label className='text-lg'>Coordinates (Lat. Long.)</label>
                    <div className='flex flex-row space-x-2'>
                        <input 
                            className='mt-2 p-2 border rounded w-full'
                            placeholder="Latitude"
                            type="number"
                            value={lat}
                            onChange={e => setLat(Number(e.target.value))}
                        />
                        <input 
                            className='mt-2 p-2 border rounded w-full'
                            placeholder="Longitude"
                            type="number"
                            value={long}
                            onChange={e => setLong(Number(e.target.value))}
                        />                    
                    </div>

                    <label className='text-lg'>Connected Stations</label>
                    <Select
                        isMulti
                        options={allStations
                            .filter(station => {
                                const distance = calculateDistance(
                                    { coordinates: [lat, long] } as StationData, 
                                    { coordinates: [station.coordinates[0], station.coordinates[1]] } as StationData
                                );
                                return distance >= 500; // Filter out stations that are under 500 meters apart
                            })
                            .map(station => ({ value: station._id, label: station.stationName }))
                        }
                        value={selectedConnectedStations.map(stationId => ({ value: stationId, label: allStations.find(station => station._id === stationId)?.stationName }))}
                        onChange={(selectedOptions: any) => {
                            const selectedStationIds = selectedOptions.map((option: any) => option.value);
                            setSelectedConnectedStations(selectedStationIds);
                        }}
                    />

                    <button 
                        onClick={handleStationSubmit}
                        className='p-2 bg-green-500 text-white rounded w-full mt-2'
                    > 
                        {mode === 'create' ? 'Create Station' : 'Update Station'}
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
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[lat, long]} />
                    <MapEvents/>
                </MapContainer>
            </div>
        </Modal>
    );
}

export default StationModal;
