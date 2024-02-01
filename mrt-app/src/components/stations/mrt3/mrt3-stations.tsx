import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
// import stations from './stations.json'
import { Polyline } from 'react-leaflet';
import { useEffect, useState } from "react";
import { LatLng } from "leaflet";
import CreateStation from "../createStation";
import { getStation } from "../manager";
import StationData from "../stationData";


//Function Component
const MRT3Stations = () => {
    const trainLine = 'mrt-3';
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [stations, setStations] = useState([] as StationData[]);
    const [markerPosition, setMarkerPosition] = useState<LatLng | [0,0]>();
    const [createStationMapClick, setCreateStationMapClick] = useState(false);


    //Calls the function component createStation modal
    const invokeCreateStation = () => {
        return <CreateStation isOpen={true} onRequestClose={()=>{setCreateStationMapClick(false)}} coordinates={[lat, lng]}/>
    }

    useEffect(() => {
        if (createStationMapClick) {
            invokeCreateStation();
        }

    }, [createStationMapClick])


    const putMarker = () => {
        if (markerPosition) {
            return(
                <Marker position={markerPosition}>
                    <Popup>
                        <button className="bg-blue" onClick={()=>setCreateStationMapClick(true)}> Click here to create station </button>                           
                    </Popup>
                </Marker>
            ) 
        }
    }

    const MapEvents = () => {
        const map = useMapEvents({
            click(e) {
                // Handle map click event here
                setLat(e.latlng.lat);
                setLng(e.latlng.lng);
                console.log('coords', lat, lng)
                console.log(`Map clicked at coordinates: ${e.latlng.lat}, ${e.latlng.lng}`)
                setMarkerPosition(e.latlng);
            },
        });
        return null;
    }

    useEffect(() => {
        const fetchStations = async () => {
            const data = await getStation(trainLine);
            setStations(data);
            console.log('data', data)
        } 
        fetchStations();
    } ,[])

    return (
        <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                crossOrigin="">
            </script>
            <MapContainer center={[14.60773659867783, 121.0266874139731]} zoom={12} scrollWheelZoom={true}
            className='box-border h-32 w-32 p-4 border-4 mx-3 my-3 pos-center z-0'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents/>
                {putMarker()}
                {createStationMapClick ? invokeCreateStation() : null}
                {/* <Polyline positions={positions} color='red' /> */}

                {stations.map((station) => (
                    <Marker 
                        key={station.stationName}
                        position={[station.coordinates[0], station.coordinates[1]]}
                        eventHandlers={{
                            click: () => {
                                console.log('Marker clicked', station.stationName)
                            }
                        }}
                        >
                        <Popup>
                            {station.stationName}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </>
    );

}

// export const MapEvents = () => {
//     const map = useMapEvents({
//         click(e) {
//             // Handle map click event here
//             const {lat, lng} = e.latlng
//             console.log(`Map clicked at coordinates: ${lat}, ${lng}`)
            
//         },
//         locationfound: (location) => {
//             // Handle location found
//             console.log(location)
//             map.flyTo(location.latlng, map.getZoom())
//         }
//     });
//     return null;
// }

export default MRT3Stations;