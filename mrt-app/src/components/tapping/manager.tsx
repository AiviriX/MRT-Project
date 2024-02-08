import { MapContainer, TileLayer } from "react-leaflet"
import Select from "react-select"
import { useState, useEffect } from "react"
import { Component } from "react"


import CardData from "../cards/cardData"
import StationData from "../stations/stationData"
import { getOneCard, getCardList } from "../cards/manager"
import { getOneStation, getStationList } from "../stations/manager"
import { calculateDistance } from "../distanceCalculator"
import MRT3Stations, { MRT3StationsExport } from "../stations/mrt3-stations"

import { API_URL } from "../.."

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

    //When marker is clicked, set it as the selected station
    const handleMarkerClick = (marker: StationData) => {
        setSelectedStation(marker);
    }

    const searchForCard = async (param: string) => {     
        if (param) {
            const cardData = await getCard(param)
            setSelectedCard(cardData)
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

    useEffect(() => {
        if (selectedCard) {
            updateCardList(selectedCard);
        }
    }, [selectedCard])


    //This function is called to display the station information when a marker is clicked.
    useEffect(() => {
        if (selectedStation) {
            updateStationList(selectedStation);
        }
    }
    , [selectedStation])

    //
    useEffect(() => {
        const fetchStations = async () => {
            const data = await getStationList('mrt-3');
            setAllStations(data);
        };
        fetchStations();
    }, []);



  return (
    <>
    <div className="flex flex-row">
        <section className="flex flex-col">
            <div className="relative">
                <input
                    className="w-full border border-gray-200 rounded-lg p-4 text-sm font-medium"
                    placeholder="Search Card"
                    type="number"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchForCard(e.currentTarget.value)
                        }
                    }}
                />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                </div>
            </div>
            <div className="grid items-center gap-4 max-w-sm mx-auto">
                <div className="border border-gray-200 rounded-lg p-4">
                    <search className="text-sm font-medium">Card Information</search>
                    
                    {/* Get Card information here */}
                    <div className="flex items-center justify-between space-x-4 text-sm font-medium">
                        {
                            selectedCard ? (
                                <div>
                                    <div className="text-gray-500">Card UID: {selectedCard.uuid}</div>
                                    <div className="text-gray-900">Remaining Balance: {selectedCard.balance} </div>
                                    <div className="text-gray-900">Tapped In: {selectedCard.tappedIn.toString()} </div>
                                    <div className="text-gray-900">Station Source: {selectedCard.tappedInStation}</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-gray-500">Card UID: No card selected</div>
                                </div>
                            )
                        }
                    </div>
                    <div className="border-t my-4" />

            </div>
            <div className="border border-gray-200 rounded-lg p-4 mt-4">
                <Select/>
                {
                    selectedStation ? (
                        <div>
                            <div className="text-sm font-medium">Station Information</div>
                            <div> Station Name: {selectedStation.stationName} </div>
                            <div> Coordinates: {selectedStation.coordinates[0]}, {selectedStation.coordinates[1]} </div>
                        </div>

                    ) : (
                        <div>
                            <div className="text-sm font-medium">Station Information</div>
                            <div className="text-gray-500">Station Name: No station selected</div>
                        </div>
                    )
                }
            </div>
            <div className="space-y-2">
                    <button className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Tap IN
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Tap OUT
                    </button>
                </div>
            </div>
        </section>
        <section>
            <div className="w-full h-full border-2 rounded">
            <MapContainer center={[14.60773659867783, 121.0266874139731]} zoom={12} scrollWheelZoom={true}
                className='flex box-border w-auto h-automaxw-32 maxh-32 border-4 pos-center z-0'>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                    crossOrigin="">
                </script>
                <MRT3StationsExport setSelectedMarker={handleMarkerClick}/>
            </MapContainer>
            </div>
        </section>

    </div>

    </>
  )
}

