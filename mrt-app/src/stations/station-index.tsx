import { MapContainer, TileLayer } from 'react-leaflet';
import { useState, useEffect } from 'react';

import '../stations/station-styles.css';
import MRT3Stations from './mrt3/mrt3-stations';
import mrt3Stations from './mrt3/mrt3-stations';


const Stations = () => {
    
    const [selectedLine, setSelectedLine] = useState(null)
    const [stations, setStations] = useState([]);

    useEffect(() => {
        if (selectedLine === 'MRT-3') {
            //setStations()    
        }
    }, [selectedLine])



    return (
        <div className='flex justify-between'> 
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                crossOrigin="">
            </script>
            <MapContainer center={[14.605711299761166, 121.01869743864975]} zoom={12} scrollWheelZoom={true}
            className='box-border h-32 w-32 p-4 border-4 mx-3 my-3 pos-center z-0'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>

            <select className='relative border p-2 h-32 w-32 stationDrop'>
                <option>Select a Train Line</option>
                    <option>LRT-1</option>
                    <option>LRT-2</option>
                    <option>MRT-3</option>
            </select>
        </div>
    );

}

export default Stations