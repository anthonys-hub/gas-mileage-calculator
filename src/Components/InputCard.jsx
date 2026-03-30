import { useState } from 'react'

export default function InputCard({ origin, setOrigin, destination, setDestination }) {
    const [originSuggestions, setOriginSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])

    async function fetchSuggestions(text, setSuggestions) {
        if (!text || text.length < 3) { setSuggestions([]); return }
        const res = await fetch(`https://api.openrouteservice.org/geocode/autocomplete?api_key=${import.meta.env.VITE_ORS_API_KEY}&text=${text}`)
        const data = await res.json()
        setSuggestions(data.features?.map(f => f.properties.label) || [])
    }

    return (
        <div className="flex flex-col gap-4 bg-white rounded-2xl w-full max-w-[900px] mx-auto mt-3 px-6 pb-2">
            <div className="flex gap-8 items-start">

                
                <div className="flex flex-col flex-1 relative">
                    <label className="text-center font-['Inter'] text-[20px] mb-2">Enter your starting point:</label>
                    <input
                        type="text"
                        value={origin}
                        onChange={(e) => {
                            setOrigin(e.target.value)
                            fetchSuggestions(e.target.value, setOriginSuggestions)
                        }}
                        placeholder="Ex: 293 Rock Dr...."
                        className="text-center border border-gray-200 rounded-full px-6 py-4"
                    />
                    {originSuggestions.length > 0 && (
                        <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-48 overflow-y-auto">
                            {originSuggestions.map((s, i) => (
                                <li
                                    key={i}
                                    onClick={() => { setOrigin(s); setOriginSuggestions([]) }}
                                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 font-['Inter'] text-sm"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-5 ml-3 mr-3 w-px h-20 bg-gray-200"></div>

               
                <div className="flex flex-col flex-1 relative">
                    <label className="text-center font-['Inter'] text-[20px] mb-2">Enter your destination:</label>
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => {
                            setDestination(e.target.value)
                            fetchSuggestions(e.target.value, setDestinationSuggestions)
                        }}
                        placeholder="Ex: 67 Fish Street...."
                        className="text-center border border-gray-200 rounded-full px-6 py-4"
                    />
                    {destinationSuggestions.length > 0 && (
                        <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-48 overflow-y-auto">
                            {destinationSuggestions.map((s, i) => (
                                <li
                                    key={i}
                                    onClick={() => { setDestination(s); setDestinationSuggestions([]) }}
                                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 font-['Inter'] text-sm"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
            <hr className="border-gray-200 mt-2" />
        </div>
    )
}