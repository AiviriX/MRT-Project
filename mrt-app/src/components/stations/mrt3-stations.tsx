//mrt3-stations.tsx 
//This file contains the component for the MRT3 Stations.
//Should be replaced by a generalized component that accepts
//  the station line as a parameter and gets the stations from the database
import {  Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Polyline } from 'react-leaflet';
import { useEffect, useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import StationData from "./stationData";
import { getStationList } from "./manager";
import { RetrieveMarker } from "./manager";
import StationModal from "./crud/stationModal";

 

//Function Component. SelectedMarker is a prop from the manager for it to retrieve clicked marker's info
const MRT3Stations: React.FC<RetrieveMarker> = ({setSelectedMarker}) => {
    const trainLine = 'mrt-3';
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [stations, setStations] = useState<StationData[]>([]);
    const [marker, setMarker] = useState({} as StationData);
    const [markerPosition, setMarkerPosition] = useState<LatLng | [0,0]>();
    const [createStationMapClick, setCreateStationMapClick] = useState(false);

    //Calls the function component createStation modal
    const invokeCreateStation = () => {
        console.log('invokeCreateStation', lat, lng)
        return <StationModal isOpen={true} onRequestClose={()=>{setCreateStationMapClick(false)}}
        coordinates={[lat,lng]} mode='create'/>
    }

    useEffect(() => {
        if (createStationMapClick) {
            invokeCreateStation();
        }

    }, [createStationMapClick])

    useEffect(() => {
        if (marker) {
            setSelectedMarker && setSelectedMarker(marker);
        }
    }, [marker, setSelectedMarker]);


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
                
                setMarkerPosition(e.latlng);   
            },
        });
        return null;
    }

    useEffect(() => {
        const fetchStations = async () => {
            const data = await getStationList(trainLine);
            console.log('data', data);
            setStations(data);
            // data.map((station: StationData) => {
            //     console.log('station', station.stationName, station.connectedStation);
            // })
        } 
        fetchStations();
    }, []);

    const getpolyLines = () => {
        return stations.map((station: StationData) =>
            station.connectedStation?.map((connectedStationId: string) => {
                const connectedStation = stations.find((s) => s._id === connectedStationId);
                if (connectedStation) {
                    const positions: LatLngExpression[] = [
                        [station.coordinates[0], station.coordinates[1]],
                        [connectedStation.coordinates[0], connectedStation.coordinates[1]],
                    ];
                    return <Polyline color="black" positions={positions} />;
                }
                return null;
            })
        );
    }
    
    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="z-1"
            />
            <MapEvents/>
            {putMarker()}
            {createStationMapClick ? invokeCreateStation() : null}

            {
                stations && stations.map((station) => (
                    <>
                        <Marker 
                            key={station.stationName}
                            position={[station.coordinates[0], station.coordinates[1]]}
                            eventHandlers={{
                                click: () => {
                                    setMarker(station)
                                    setSelectedMarker && setSelectedMarker(station);                         
                                    console.log('Marker clicked', station.stationName, station.coordinates)
                                }
                            }}
                        >
                            <Popup>
                                {station.stationName}
                            </Popup>
                        </Marker>
                        {getpolyLines()}
                        {station.connectedStation?.map((connectedStationId: string) => {
                            // console.log('Connected station ID:', connectedStationId);
                            return null;
                        })}
                    </>
                ))
            }
        </>
    );

}


export const MRT3StationsExport: React.FC<RetrieveMarker> = ({ setSelectedMarker }) => {    
    const trainLine = 'mrt-3';
    const [stations, setStations] = useState<StationData[]>([]);
    const [marker, setMarker] = useState({} as StationData);

    useEffect(() => {
        const fetchStations = async () => {
            const data = await getStationList(trainLine);
            setStations(data);
        } 
        fetchStations();
    }, []);

    const polyLines = stations.flatMap((station: StationData) =>
        station.connectedStation?.map((connectedStationId: string) => {
            const connectedStation = stations.find((s) => s._id === connectedStationId);
            if (connectedStation) {
                const positions: LatLngExpression[] = [
                    [station.coordinates[0], station.coordinates[1]],
                    [connectedStation.coordinates[0], connectedStation.coordinates[1]],
                ];
                return <Polyline key={`${station._id}-${connectedStation._id}`} color="black" positions={positions} />;
            }
            return null;
        }) || []
    );

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="z-0"
            />
            {stations.map((station) => (
                <>
                    <Marker 
                        position={[station.coordinates[0], station.coordinates[1]]}
                        eventHandlers={{
                            click: () => {
                                setMarker(station);
                                setSelectedMarker && setSelectedMarker(station);
                            }
                        }}
                    >
                        <Popup>{station.stationName}</Popup>
                    </Marker>
                </>
            ))}
            {polyLines}
        </>
    );
}




export default MRT3Stations;