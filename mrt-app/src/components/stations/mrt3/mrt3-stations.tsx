import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import stations from './stations.json'



const MRT3Stations = () => {
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

                {/*TODO Add to json late her */}
                <Marker position={[14.652208254624389, 121.03234323138653]}>
                    <Popup>
                        North Avenue Station
                    </Popup>
                </Marker>

                <Marker position={[14.643348953836682, 121.03796281550703]}>
                    <Popup>
                        Quezon Avenue Station
                    </Popup>
                </Marker>

                <Marker position={[14.635222115280635, 121.04333937202267]}>
                    <Popup>
                        GMA Kamuning Station
                    </Popup>
                </Marker>

                <Marker position={[14.619525829473252, 121.05111117373505]}>
                    <Popup>
                        Araneta Center Cubao Station
                    </Popup>
                </Marker>

                <Marker position={[14.607496535782303, 121.05658583669512]}>
                    <Popup>
                        Santolan Annapolis Station
                    </Popup>
                </Marker>

                <Marker position={[14.587884030596898, 121.05672494296502]}>
                    <Popup>
                        Ortigas Station
                    </Popup>
                </Marker>

                <Marker position={[14.581807881398193, 121.05418292043099]}>
                    <Popup>
                        Shaw Boulevard Station
                    </Popup>
                </Marker>

                <Marker position={[14.573784079170085, 121.04818553322576]}>
                    <Popup>
                        Boni Avenue Station
                    </Popup>
                </Marker>

                <Marker position={[14.566931347769977, 121.04554092499848]}>
                    <Popup>
                        Guadalupe Station
                    </Popup>
                </Marker>

                <Marker position={[14.55508836413639, 121.03439464706184]}>
                    <Popup>
                        Buendia Station
                    </Popup>
                </Marker>

                <Marker position={[14.549573475275071, 121.02832335007369]}>
                    <Popup>
                        Ayala Station
                    </Popup>
                </Marker>

                <Marker position={[14.542491312207575, 121.01941878138396]}>
                    <Popup>
                        Magallanes Station
                    </Popup>    
                </Marker>

                <Marker position={[14.537699807729172, 121.0021913874413]}>
                    <Popup>
                        Taft Avenue Station
                    </Popup>
                </Marker>
            </MapContainer>
        </>
    );

}

export default MRT3Stations;