import { MapContainer, TileLayer } from "react-leaflet"
import Select from "react-select"
import { useState, useEffect } from "react"
import { Component } from "react"


import CardData from "../cards/cardData"
import StationData from "../stations/stationData"
import { getOneCard, getCardList } from "../cards/manager"
import { getOneStation, getStationList } from "../stations/manager"
import { calculateDistance } from "../distanceCalculator"

interface TappingManagerProps {
    cardProp?: CardData
    stationProp?: StationData
}

export const TappingManager: React.FC<TappingManagerProps> = (cardProp?, stationProp?) => {
    const [selectedCard, setSelectedCard] = useState<CardData>()
    const [allCards, setAllCards] = useState<CardData[]>([])
    const [selectedStation, setSelectedStation] = useState<StationData>()
    const [allStations, setAllStations] = useState<StationData[]>([])

    //These functions uses the fetch functions from their respective managers to get the data from the database.
    const getCard = async (uuid: string) : Promise<CardData> => {
        return await getOneCard(uuid);
    }

    const getCardList = async () : Promise<CardData[]> => {
        return await getCardList();
    }

    const getStation = async (stationId: string) : Promise<StationData> => {
        return await getOneStation(stationId);
    }

    const getStationList = async () : Promise<StationData[]> => {
        return await getStationList();
    }

    //These functions should launch first when the tab is opened.
    const updateCardList = async (card: CardData) => {
        setAllCards(await getCardList());
    }

    const updateStationList = async (station: StationData) => {
        setAllStations(await getStationList());
    }



  return (
    <>
    <div className="flex flex-row">
        <section className="flex flex-col">
            <div className="relative">
                <input
                className="w-full border border-gray-200 rounded-lg p-4 text-sm font-medium"
                placeholder="Search Card"
                type="text"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                {/* <SearchIcon className="h-5 w-5 text-gray-500" /> */}
                </div>
            </div>
            <div className="grid items-center gap-4 max-w-sm mx-auto">
                <div className="border border-gray-200 rounded-lg p-4">
                    <search className="text-sm font-medium">Card Information</search>
                    {/* Get Card information here */}

                    <div className="flex items-center justify-between space-x-4 text-sm font-medium">
                    <div className="text-gray-500">Remaining balance</div>
                    <div className="text-gray-900">$20.00</div>
                    </div>
                    <div className="border-t my-4" />
                    <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold">Single trip</div>
                    <div className="text-gray-500">$2.75</div>
                </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 mt-4">
                <Select/>
                <div className="text-sm font-medium">Station Information</div>
                <div className="text-gray-500">Station Name: Example Station</div>
                <div className="text-gray-500">Platform: A</div>
                <div className="text-gray-500">Arrival Time: 10:30 AM</div>
                <div className="text-gray-500">Tapped In Location: Platform A, Example Station</div>
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
            <div className="w-full h-full border-2">
            <MapContainer center={[14.60773659867783, 121.0266874139731]} zoom={12} scrollWheelZoom={true}
                className='flex box-border w-auto h-automaxw-32 maxh-32 border-4 pos-center z-0'>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                    crossOrigin="">
                </script>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
            </div>
        </section>

    </div>

    </>
  )
}

