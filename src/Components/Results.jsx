import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import FuelChart from './FuelChart'

function MapRecenter({ center }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center)
    }, [center, map])
    return null
}

export default function Results({ distance, fuelUsed, cost, mpg, gasPrice, year, make, model, elevation, origin, destination, originCoords, destinationCoords, vehicleType, isMetric }) {

    const fallbackCenter = [41.8, -73.1]
    const startLatLng = originCoords ? [originCoords[1], originCoords[0]] : null
    const endLatLng = destinationCoords ? [destinationCoords[1], destinationCoords[0]] : null
    const center = startLatLng && endLatLng
        ? [(startLatLng[0] + endLatLng[0]) / 2, (startLatLng[1] + endLatLng[1]) / 2]
        : fallbackCenter

    const elevationFuel = elevation ? elevation * 0.00005 : 0
    const baseFuel = fuelUsed ? Math.max(fuelUsed - elevationFuel, 0) : 0

    const distanceUnit = isMetric ? 'km' : 'miles'
    const fuelUnit = vehicleType === 'Electric' ? 'kWh' : isMetric ? 'liters' : 'gallons'
    const priceLabel = vehicleType === 'Electric' ? '⚡ Electricity Cost:' : '⛽ Gas Price:'
    const priceUnit = vehicleType === 'Electric' ? '/kWh' : '/gal'

    return (
        <div className="flex flex-col items-center pt-10 mx-auto w-full max-w-[1600px] px-10">
            <h1 className="font-['Inter'] text-[32px]">🚗 Trip Summary</h1>
            <hr className="border-gray-200 mt-2 w-full mb-10" />

            <div className="flex w-full gap-8 items-start">

                
                <div className="flex flex-col gap-10 w-[280px] shrink-0">
                    <div className="flex flex-col gap-2">
                        <p className="font-['Inter'] text-[18px] text-gray-500">📏 Distance:</p>
                        <p className="font-['Inter'] text-[22px]">{distance.toFixed(2)} {distanceUnit}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-['Inter'] text-[18px] text-gray-500">⛰️ Elevation:</p>
                        <p className="font-['Inter'] text-[22px]">{elevation.toFixed(1)} ft</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-['Inter'] text-[18px] text-gray-500">⛽ Fuel Used:</p>
                        <p className="font-['Inter'] text-[22px]">{fuelUsed.toFixed(1)} {fuelUnit}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-['Inter'] text-[18px] text-gray-500">💰 Est. Cost:</p>
                        <p className="font-['Inter'] text-[22px]">${cost.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-['Inter'] text-[18px] text-gray-500">🚗 Vehicle:</p>
                        <p className="font-['Inter'] text-[22px]">{`${year} ${make.toUpperCase()} ${model.toUpperCase()}`}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-['Inter'] text-[18px] text-gray-500">{priceLabel}</p>
                        <p className="font-['Inter'] text-[22px]">${gasPrice}{priceUnit}</p>
                    </div>
                </div>

               
                <div className="flex flex-col flex-1 gap-4">
                    <div className="w-full h-[450px]">
                        <MapContainer center={center} zoom={8} className="w-full h-full rounded-2xl shadow-sm border border-gray-100">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapRecenter center={center} />
                            {startLatLng && <Marker position={startLatLng}><Popup>Start</Popup></Marker>}
                            {endLatLng && <Marker position={endLatLng}><Popup>Destination</Popup></Marker>}
                            {startLatLng && endLatLng && (
                                <Polyline positions={[startLatLng, endLatLng]} color="blue" weight={4} opacity={0.6} />
                            )}
                        </MapContainer>
                    </div>
                    <div className="text-center font-['Inter'] text-lg">
                        <p className="text-gray-900">{origin}</p>
                        <p className="text-gray-500 text-sm">→ {destination}</p>
                    </div>
                </div>

                
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <FuelChart baseFuel={baseFuel} elevationFuel={elevationFuel} vehicleType={vehicleType} isMetric={isMetric} />
                </div>

            </div>
        </div>
    )
}