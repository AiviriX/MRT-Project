//mrt3-stations.tsx 
//This file contains the component for the MRT3 Stations.
//Should be replaced by a generalized component that accepts
//  the station line as a parameter and gets the stations from the database
import {  Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Polyline } from 'react-leaflet';
import { useEffect, useState } from "react";
import { LatLng, LatLngExpression } from "leaflet";
import CreateStation from "./crud/createStation";
import StationData from "./stationData";
import { getStation } from "./manager";
import { RetrieveMarker } from "./manager";

 

//Function Component. SelectedMarker is a prop from the manager for it to retrieve clicked marker's info
const MRT3Stations: React.FC<RetrieveMarker> = ({setSelectedMarker}) => {
    const trainLine = 'mrt-3';
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [stations, setStations] = useState<StationData[]>([]);
    const [marker, setMarker] = useState({} as StationData);
    const [markerPosition, setMarkerPosition] = useState<LatLng | [0,0]>();
    const [createStationMapClick, setCreateStationMapClick] = useState(false);
    const [polylinePositions, setPolylinePositions] = useState(stations.map(() => ([0,0])));
    
    //Calls the function component createStation modal
    const invokeCreateStation = () => {
        return <CreateStation isOpen={true} onRequestClose={()=>{setCreateStationMapClick(false)}} coordinates={[lat, lng]}/>
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
                console.log(`Map clicked at coordinates: ${e.latlng.lat}, ${e.latlng.lng}`)
                setMarkerPosition(e.latlng);   
            },
        });
        return null;
    }

    useEffect(() => {
        const fetchStations = async () => {
            const data = await getStation(trainLine);
            console.log('data', data);
            setStations(data);
        } 
        fetchStations();
    }, []);

    const getpolyLines = () => {

        return stations.map((station: StationData) =>
            station.connectedStations?.map((connectedStationId: string) => {
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
                />
                <MapEvents/>
                {putMarker()}
                {createStationMapClick ? invokeCreateStation() : null}
                {/* <Polyline positions={positions} color='red' /> */}

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
                                {stations?.map((station: StationData) =>
                                station.connectedStations.map((connectedStationId: string) => {
                                const connectedStation = stations.find(
                                    (s) => s._id === connectedStationId
                                );
                                if (connectedStation) {
                                    const positions: LatLngExpression[] = [
                                    [station.coordinates[0], station.coordinates[1]],
                                    [
                                        connectedStation.coordinates[0],
                                        connectedStation.coordinates[1],
                                    ],
                                    ];
                                    return <Polyline color="black" positions={positions} />;
                                }
                                return null;
                                })
                            )}
                            <Popup>
                                {station.stationName}
                            </Popup>
                        </Marker>
                        {/* {stations.length > 0 && <Polyline positions={polylinePositions as LatLngExpression[]} color='red' />} */}
                        </>
                    ))
                }
        </>
    );

}

export default MRT3Stations;