import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import FuelChart from './FuelChart';

function MapRecenter({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default function Route({
    start,
    end,
    originAddress,
    destinationAddress,
    distance,
    mpg,
    fuelUsed,
    elevation
}) {

    const fallbackCenter = [41.8, -73.1];

    const startLatLng = start ? [start[1], start[0]] : null;
    const endLatLng = end ? [end[1], end[0]] : null;

    const center = startLatLng && endLatLng
        ? [(startLatLng[0] + endLatLng[0]) / 2, (startLatLng[1] + endLatLng[1]) / 2]
        : startLatLng || endLatLng || fallbackCenter;


    const elevationFuel = elevation ? elevation * 0.00005 : 0;
    const baseFuel = fuelUsed ? Math.max(fuelUsed - elevationFuel, 0) : 0;

    return (
        <div className="flex flex-col items-center mx-auto w-full max-w-[1100px] px-8 mt-10">


            <div className="font-['Inter'] text-[32px] flex w-full justify-between items-center mb-4">


            </div>

            <hr className="border-gray-200 w-full mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-start">


                <div className="flex flex-col gap-6">
                    <div className="w-full h-[400px]">
                        <MapContainer center={center} zoom={13} className="w-full h-full rounded-2xl shadow-sm border border-gray-100">
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
                        <p className=" text-gray-900">{originAddress || "Starting Point"}</p>
                        <p className="text-gray-500 text-sm mb-2">{destinationAddress || "Destination"}</p>
                        <div className="inline-block px-4 py-1 ">
                            {distance?.toFixed(2) || "0.00"} miles
                        </div>
                    </div>
                </div>


                <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <FuelChart baseFuel={baseFuel} elevationFuel={elevationFuel} />
                </div>

            </div>
        </div>
    );
}