import { MapContainer, Marker, TileLayer } from "react-leaflet"
import Select from "react-select"
import { useState, useEffect } from "react"
import Modal from 'react-modal'


import CardData from "../cards/cardData";
import StationData from "../stations/stationData";
import { getOneCard, getCardList, tapInCard, tapOutCard } from "../cards/manager";
import { getOneStation, getStationList } from "../stations/manager";
// import { calculateDistance } from "../distanceCalculator"
import { MRT3StationsExport } from "../stations/mrt3-stations";
import { updateCard } from "../cards/manager"; 

import { API_URL } from "../.."
import calculateDistance from "../distanceCalculator";
import path from "path";
import { LatLngExpression } from "leaflet";

interface TappingManagerProps {
    cardProp?: CardData
    stationProp?: StationData
}

export const TappingManager: React.FC<TappingManagerProps> = ({cardProp, stationProp}) => {
    const [selectedCard, setSelectedCard] = useState<CardData>()
    const [allCards, setAllCards] = useState<CardData[]>([])
    const [selectedStation, setSelectedStation] = useState<StationData>()
    const [allStations, setAllStations] = useState<StationData[]>([])
    const [fare, setFare] = useState(0);
    const [tapInOpen, setTapInOpen] = useState(false);
    const [tapOutOpen, setTapOutOpen] = useState(false);
    const [pathNames, setPathNames] = useState([])
    const [pathCoords, setPathCoords] = useState([])
    const [totalDistance, setTotalDistance] = useState(0)
    const [cardSearch, setCardSearch] = useState('')
    const mismatchFee = 50

    //When marker is clicked, set it as the selected station
    const handleMarkerClick = (marker: StationData) => {
        setSelectedStation(marker);
        if (selectedCard && selectedStation){
            findPathRequester(selectedCard, selectedStation);
        }
    }

    const findPathRequester = async (cardData: CardData, stationData: StationData) => {
        const result = await findPathRequest(cardData, stationData);  
        const resultCoords = await findPathCoordsRequest(cardData, stationData); 
        const resultDistance = await findDistanceRequest(resultCoords);     

        console.log('result', resultDistance)

        setPathNames([])
        setPathNames(result);
        setPathCoords(resultCoords);
        setTotalDistance(resultDistance);

        const resultFare = await getFareRequest(resultCoords);
        setFare(Math.round(resultFare));
    }

    const findDistanceRequest = async (coords: [number, number]) => {
        try {
            const response = await fetch(`${API_URL}/cards/calculateTotalDistance`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({coords: coords})
                }
            );
            const data = await response.json();
            return data.distance;
        } catch (error) {
            console.error(error);
        }
    }

    const searchForCardStation = async (param: string) => {     
        if (param) {
            const cardData = await getCard(param)
            setSelectedCard(cardData)
            try {
                if (cardData.sourceStation) {
                    // const stationData = await getStation(cardData.sourceStation);
                    // setSelectedCardThing(stationData);
                }
            } catch (error) {
                
            }
        }
    }
    

    //These functions uses the fetch functions from their respective managers to get the data from the database.
    const getCard = async (uuid: string) : Promise<CardData> => {
        return await getOneCard(uuid);
    }

    const _getCardList = async () : Promise<CardData[]> => {
        return await getCardList();
    }

    const getStation = async (stationId: string) : Promise<StationData> => {
        return await getOneStation(stationId);
    }

    const getStationsList = async () : Promise<StationData[]> => {
        return await getStationList('mrt-3');
    }

    //These functions should launch first when the tab is opened.
    const updateCardList = async (card: CardData) => {
        setAllCards(await _getCardList());
    }

    const updateStationList = async (station: StationData) => {
        setAllStations(await getStationsList());
    }

    const handleTapIn = async (cardData: CardData, stationData:StationData) => {
            await tapInCard(cardData, stationData);
            setTapInOpen(true);
    }

    const handleTapOut = async (cardData: CardData, stationData:StationData) => {
            await tapOutCard(cardData, stationData);
            setTapOutOpen(true);
    }

    const calculateBeforeTapOut = async (cardData: CardData, stationData: StationData) => {
        const distance = findPathRequest(cardData, stationData);
        
    }

    //This function is called to display the station information when a marker is clicked.
    useEffect(() => {
        if (selectedCard) {
            updateCardList(selectedCard);
        }

        if (selectedStation) {
            updateStationList(selectedStation);
        }

        if (selectedCard && selectedStation){
            findPathRequester(selectedCard, selectedStation);
        }
    }
    , [selectedStation, selectedCard], )

    //
    useEffect(() => {
        const fetchStations = async () => {
            const data = await getStationList('mrt-3');
            setAllStations(data);
        };
        fetchStations();
    }, []);
    
    useEffect(() => {
        console.log('selectedCard', selectedCard)
    }, [selectedCard])

    const checkIfStationAndCardAvailable = () => {
        if (selectedCard && selectedStation){
            return true;
        }
        alert('Please select a card and a station')
        return false;
    }


  return (
    <>
    <div className="flex flex-col w-full">
        <div className="flex flex-row">
            <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-6 ">
                <div className="border-2 border-black rounded-lg ">
                    <p className="py-2 px-2 w-full text-sm font-medium">Card Information</p>
                    <div className="flex flex-col mx-2">
                    <div className="flex flex-col items-center justify-between  text-sm font-medium border-2 border-black ">
                        <input
                            className="border border-gray-200 rounded-lg p-4 text-sm font-medium w-full "
                            placeholder="Search Card"
                            type="number"
                            onChange={(e) => setCardSearch(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    searchForCardStation(e.currentTarget.value)
                                }
                            }}
                        />
                        {
                            selectedCard ? (
                                <div>
                                    <div className="text-gray-500">Card UID: {selectedCard.uuid}</div>
                                    <div className="text-gray-900">Remaining Balance: {selectedCard.balance} </div>
                                    <div className="text-gray-900">Tapped In: {selectedCard.tappedIn.toString()} </div>
                                    <div className="text-gray-900">Station Source: {selectedCard.sourceStationName}</div>
                                    <div className="text-gray-900">Coordinates: {selectedCard.coordinates?.join(' ')}</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-gray-500">Card UID: No card selected</div>
                                </div>
                            )
                        }
                    </div>
                    <div className="space-y-2 space-x-2">
                        <button className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => checkIfStationAndCardAvailable() ? setTapInOpen(true) : null}
                        >
                            Tap IN
                        </button>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => checkIfStationAndCardAvailable() ? setTapOutOpen(true) : null}
                        >
                            Tap OUT
                        </button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    try {
                                        searchForCardStation(cardSearch);
                                    } catch (error) {
                                    }

                                }}
                        >
                            Search Card
                        </button>
                    </div>
                </div>
                    <div className="border-t my-4" />
                </div>
                <div className="border-2 border-black rounded-lg ">
                    <div className="p-2">
                        <Select/>
                        {
                            selectedStation ? (
                                <div>
                                    <div className="text-sm font-medium">Station Information</div>
                                    <div> Station Name: {selectedStation.stationName} </div>
                                    <div> Coordinates: {selectedStation.coordinates[0]}, {selectedStation.coordinates[1]} </div>
                                    {/* <div> Connected Stations: {selectedStation.connectedStation} </div> */}
                                </div>

                            ) : (
                                <div>
                                    <div className="text-sm font-medium">Station Information</div>
                                    <div className="text-gray-500">Station Name: No station selected. Click a marker!</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>            
            
        </div>
                
        <section>
        <div className="m-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 relative z-0 h-[625px] w-[screen] lg:w-[90%]">
            <MapContainer 
                center={[14.60773659867783, 121.0266874139731]} 
                zoom={12} 
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                    crossOrigin="">
                </script>
                <MRT3StationsExport setSelectedMarker={handleMarkerClick}/>
            </MapContainer>
            </div>
        </section>


        <section className="mt-10">    
        {

            tapInOpen && selectedCard && selectedStation &&
            <Modal
                isOpen={tapInOpen}
                style={{
                    content: {
                        width: 'auto', // Set the width of the modal
                        height: 'auto', // Set the height of the modal
                        margin: 'auto'
                    },
                }}
            >
                <div className="flex flex-col lg:flex-row ">
                    <div className="flex flex-col space-y-4">
                        <h1 className="text-2xl font-bold">Are you sure to tap in?</h1>
                            <div>Card ID: {selectedCard.uuid} </div>
                            <div>Card Balance: {selectedCard.balance}</div>
                            <div>Base Fare:</div>
                        <div className='border-2 rounded '></div>
                            <div>From:</div>
                            {/* <div>Station ID: {selectedStation._id}</div> */}
                            <div>Station Name: {selectedStation.stationName}</div>
                        <div className="text-xs italic">Note: Source station will be registered in the card for fare calculation.</div>
                        <div className="text-xs italic">Misuse of card tapping may incur an entry mismatch fee</div>
                        <button
                            onClick={()=>handleTapIn(selectedCard, selectedStation)} //tap logic here
                            className="p-2 bg-green-500 text-white rounded w-full"
                        >
                            Submit
                        </button>
                        <button
                            onClick={()=>setTapInOpen(false)} //close modal
                            className="p-2 bg-red-500 text-white rounded w-full"
                        >
                            Close
                        </button>
                    </div>
                    <div className="m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 relative z-0 h-[625px] w-[100%] lg:w-[100%]">
                        <MapContainer center={selectedStation.coordinates as LatLngExpression} zoom={15} scrollWheelZoom={false} dragging={false}
                               style={{ height: "100%", width: "100%" }}>
                            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                                crossOrigin="">
                            </script>
                            <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedStation.coordinates as LatLngExpression}/>
                        </MapContainer>
                    </div>
                </div>
            </Modal>
        }

        {
        tapOutOpen && selectedCard && selectedStation &&
            <Modal
                isOpen={tapOutOpen}
                style={{
                    content: {
                        width: 'auto', // Set the width of the modal
                        height: 'auto', // Set the height of the modal
                        margin: 'auto'
                    },
                }}
                >
                <>  
                    <div className="flex flex-col lg:flex-row spacex-2">
                        <div className="flex flex-col space-y-4 w-full">
                            <h1 className="text-2xl font-bold">Are you sure you want to tap out?</h1>
                            <div>Card ID: {selectedCard.uuid} </div>
                            <div>Card Balance: {selectedCard.balance}</div>
                            <div>Tapped in at: {selectedCard.sourceStationName} </div>
                            <div>Coordinates: </div>
                                <div>{selectedCard.coordinates?.[0]}</div>
                                <div>{selectedCard.coordinates?.[1]}</div>
                            <div className='border-2 rounded '></div>
                            <div>Tapping out at: {selectedStation.stationName}</div>
                            <div>Coordinates: {selectedStation.coordinates.join(' ')} </div>
                            <div>Path: { pathNames.join("->")  }</div>
                            <div>Total Distance: { totalDistance } km</div>                            
                            { selectedCard.sourceStation === selectedStation._id ?
                                <>
                                    <div>Entry Mismatch Fee {mismatchFee} </div>
                                    <div>Balance after tapping out : { selectedCard.balance - mismatchFee }</div>
                                </>
                                :
                                <>
                                    <div>Fare {fare} </div> 
                                    <div>Balance after tapping out: { selectedCard.balance - fare < 0 ? 'Insufficient Balance' : selectedCard.balance - fare }</div>
                                </>
                            }

                            {/* <div className="text-xs italic">Note: Destination station will be registered in the card for fare calculation.</div>
                            <div className="text-xs italic">Misuse of card tapping may incur an entry mismatch fee</div> */}
                            <button
                                onClick={()=>handleTapOut(selectedCard, selectedStation)} //tap out logic here
                                className="p-2 bg-green-500 text-white rounded w-full"
                            >
                                Submit
                            </button>
                            <button
                                onClick={()=>setTapOutOpen(false)} //close modal
                                className="p-2 bg-red-500 text-white rounded w-full"
                            >
                                Close
                            </button>
                        </div>
                        <div className="m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white-800 dark:border-gray-700 relative z-0 h-[625px] w-[100%] lg:w-[50%]">
                            <MapContainer center={selectedStation.coordinates as LatLngExpression} zoom={12} scrollWheelZoom={false} dragging={false}
                                    style={
                                        { height: "100%", width: "100%" }
                                    }>
                                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                                    crossOrigin="">
                                </script>
                                <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                { selectedCard.coordinates ? <Marker position={selectedCard.coordinates as LatLngExpression}/> : null }
                                <Marker position={selectedStation.coordinates as LatLngExpression}/>
                            </MapContainer>
                        </div>
                    </div>
                </>
            </Modal>
        }
        </section>
        </div>
    </>
  )
}

const findPathRequest = async (cardData: CardData, stationData: StationData) => {
    try {
        const response = await fetch(`${API_URL}/cards/findShortestPath/${cardData.sourceStation}/${stationData._id}`);
        const data = await response.json();
        console.log('eep!', data.stationNames );
        return data.stationNames;
    } catch (error) {
        console.error(error);
    }
}

const findPathCoordsRequest = async (cardData: CardData, stationData: StationData) => {
    try {
        const response = await fetch(`${API_URL}/cards/findShortestPath/${cardData.sourceStation}/${stationData._id}`);
        const data = await response.json();
        return data.coordinates;
    } catch (error) {
        console.error(error);
    }
}

const getFareRequest = async (pathCoords: [number, number]) => {
    try {
        const response = await fetch(`${API_URL}/cards/calculateFare`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({coords: pathCoords})
            }
        );
        const data = await response.json();
        console.log( data );
        return data.fare;
    } catch (error) {
        console.error(error);
    }
}

