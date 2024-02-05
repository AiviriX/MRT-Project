import { useState } from 'react';
import Modal from 'react-modal';

import { API_URL } from '../../..';
import StationData from '../stationData';
import { MapContainer, useMapEvents, TileLayer, Marker } from 'react-leaflet';
import { showTileLayer } from '../manager';
import { LatLng } from 'leaflet';

interface UpdateStationProps {
    isOpen: boolean;
    onRequestClose: () => void;
    stationData: StationData
}

const UpdateStation: React.FC<UpdateStationProps> = ({ isOpen, onRequestClose, stationData }) => {
    const [name, setName] = useState(stationData.stationName);
    const [lat, setLat] = useState(stationData.coordinates[0]);
    const [long, setLong] = useState(stationData.coordinates[1])
    const [markerPosition, setMarkerPosition] = useState<LatLng | [0,0]>();

    const [modalIsOpen, setModalIsOpen] = useState(isOpen);

    const getConnectedStations = async () => {
        try {
            const response = await fetch(`${API_URL}/stations/getconnection/${stationData._id}`, {
                method: 'GET'
            });
            const data = await response.json();
            console.log(data.connectedStations)
            if (response.ok) {
                console.log(data)
            }
            return data
        } catch (error) {
            console.error('Error:', error);
        }
    }

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
        
        const updatedStationData: StationData = {
            _id: stationData._id,
            stationName: name,
            coordinates: [lat, long]
        }

        if (!window.confirm(`Are you sure you want to update ${stationData.stationName}?`)) {
            return
        }

        try {
            const response = await fetch(`${API_URL}/stations/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ //Send new details to the server
                    stationId: stationData._id, //station id
                    stationName: name, //new name
                    coordinates: [lat, long] //new coords 
                }), 
            });
    
            const data = await response.json();
            if (response.ok){ 
                alert('Station Updated Successfully')
                onRequestClose()
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
        <Modal isOpen={modalIsOpen} onRequestClose={onRequestClose}
            style={{
                content: {
                width: 'auto',
                height: '500px',
                margin: 'auto',
                },
            }}                
        >
        <div className='flex flex-row space-y-4'>
            <section className='flex flex-col space-y-4'>
                <h1> Update Station </h1>
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
                    onClick={() => getConnectedStations()}
                    className='p-2 bg-blue-500 text-white rounded'
                    > Aweugh </button>    
                <button 
                    onClick={updateStation}
                    className='p-2 bg-green-500 text-white rounded'> Update Station </button>
                <button
                    onClick={onRequestClose}
                    className='p-2 bg-red-500 text-white rounded'> Close </button>               
            </section>

            <MapContainer center={[14.60773659867783, 121.0266874139731]} zoom={12} scrollWheelZoom={true}
                  className='flex box-border w-full h-full maxw-32 maxh-32 border-4 pos-center z-0'>
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
              <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                  integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                  crossOrigin="">
              </script>
              
              <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[lat, long] }> </Marker>
              
                <MapEvents/>
            </MapContainer>
        </div>
        
        </Modal>
        </>
    );
}

export default UpdateStation;