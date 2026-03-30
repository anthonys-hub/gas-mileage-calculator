import { useEffect, useState } from "react"

export default function VehicleSelect({ year, setYear, make, setMake, model, setModel, vehicleType, setVehicleType, setMPG, setGasPrice }) {
    const [makes, setMakes] = useState([])
    const [models, setModels] = useState([])

    const years = []
    for (let y = new Date().getFullYear(); y >= 1984; y--) {
        years.push(y)
    }

    
    useEffect(() => {
        if (!year) return
        setMake('')
        setModel('')
        setMakes([])
        setModels([])
        fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`)
            .then(res => res.text())
            .then(data => {
                const parse = new DOMParser()
                const xml = parse.parseFromString(data, 'text/xml')
                const values = [...xml.querySelectorAll('value')].map(v => v.textContent)
                setMakes(values)
            })
    }, [year])

    
    useEffect(() => {
        if (!year || !make) return
        setModel('')
        setModels([])
        fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${make}`)
            .then(res => res.text())
            .then(data => {
                const parse = new DOMParser()
                const xml = parse.parseFromString(data, 'text/xml')
                const values = [...xml.querySelectorAll('value')].map(v => v.textContent)
                setModels(values)
            })
    }, [year, make])

    
    useEffect(() => {
        if (!year || !make || !model) return
        fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`)
            .then(res => res.text())
            .then(data => {
                const parse = new DOMParser()
                const xml = parse.parseFromString(data, 'text/xml')
                const valueEl = xml.querySelector('value')
                if (!valueEl) return null
                return xml.querySelector('value').textContent
            })
            .then(id => {
                if (!id || id === 'null') return
                fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/${id}`)
                    .then(res => res.text())
                    .then(data => {
                        const parse = new DOMParser()
                        const xml = parse.parseFromString(data, 'text/xml')
                        const fuelType = xml.querySelector('fuelType1')?.textContent
                        const isElectric = fuelType === 'Electricity'

                        if (isElectric) {
                            const kwhPer100 = xml.querySelector('charge240')?.textContent || xml.querySelector('combE')?.textContent
                            setMPG(kwhPer100)
                            setGasPrice('0.16')
                        } else {
                            const mpg = xml.querySelector('comb08').textContent
                            setMPG(mpg)
                            fetch('https://www.fueleconomy.gov/ws/rest/fuelprices')
                                .then(res => res.text())
                                .then(priceData => {
                                    const parse = new DOMParser()
                                    const xml = parse.parseFromString(priceData, 'text/xml')
                                    if (fuelType === 'Premium Gasoline') {
                                        setGasPrice(xml.querySelector('premium').textContent)
                                    } else if (fuelType === 'Regular Gasoline') {
                                        setGasPrice(xml.querySelector('regular').textContent)
                                    } else if (fuelType === 'Diesel') {
                                        setGasPrice(xml.querySelector('diesel').textContent)
                                    }
                                })
                        }
                    })
            })
    }, [year, make, model])

    return (
        <div className="flex flex-col gap-4 bg-white rounded-2xl w-full max-w-[900px] mx-auto mt-3 px-6 pb-2">
            <div className="flex flex-col items-center gap-3">
                <h2 className="font-['Inter'] text-[25px]">Select your vehicle type:</h2>
                <div className="flex bg-gray-200 rounded-full p-1 w-210">
                    <button onClick={() => setVehicleType('Car')} className={`flex-1 py-3 px-3 rounded-full text-sm font-medium cursor-pointer transition duration-200 ${vehicleType === 'Car' ? 'bg-white' : 'text-gray-500'}`}>Car</button>
                    <button onClick={() => setVehicleType('SUV')} className={`flex-1 py-3 px-3 rounded-full text-sm font-medium cursor-pointer transition duration-200 ${vehicleType === 'SUV' ? 'bg-white' : 'text-gray-500'}`}>SUV</button>
                    <button onClick={() => setVehicleType('Truck')} className={`flex-1 py-3 px-3 rounded-full text-sm font-medium cursor-pointer transition duration-200 ${vehicleType === 'Truck' ? 'bg-white' : 'text-gray-500'}`}>Truck</button>
                    <button onClick={() => setVehicleType('Electric')} className={`flex-1 py-3 px-3 rounded-full text-sm font-medium cursor-pointer transition duration-200 ${vehicleType === 'Electric' ? 'bg-white' : 'text-gray-500'}`}>Electric</button>
                </div>
            </div>

            <div className="flex gap-6 mt-3 justify-center">
               
                <div className="flex flex-col">
                    <label className="font-['Inter'] text-[16px] px-15 text-center mb-2">Year:</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="text-center border border-gray-200 rounded-full px-6 py-4 bg-white cursor-pointer"
                    >
                        <option value="">Select</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                <div className="mt-5 ml-3 mr-3 w-px h-20 bg-gray-200"></div>

                
                <div className="flex flex-col">
                    <label className="font-['Inter'] text-[16px] px-15 text-center mb-2">Make:</label>
                    <select
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        disabled={!year || makes.length === 0}
                        className="text-center border border-gray-200 rounded-full px-6 py-4 bg-white cursor-pointer disabled:opacity-50"
                    >
                        <option value="">Select</option>
                        {makes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                <div className="mt-5 ml-3 mr-3 w-px h-20 bg-gray-200"></div>

               
                <div className="flex flex-col">
                    <label className="font-['Inter'] text-[16px] px-15 text-center mb-2">Model:</label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        disabled={!make || models.length === 0}
                        className="text-center border border-gray-200 rounded-full px-6 py-4 bg-white cursor-pointer disabled:opacity-50"
                    >
                        <option value="">Select</option>
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>
            <hr className="border-gray-200 mt-2" />
        </div>
    )
}