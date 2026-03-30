export default function Calculate({ isMetric, vehicleType, setGasPrice, setMPG, gasPrice, mpg, handleCalculate }) {
    return (
        <div className="flex flex-col gap-4 bg-white rounded-2xl w-full max-w-[900px] mx-auto mt-3 px-6 pb-2">
            <div className="flex gap-9 mt-3 justify-center">
                <div className="flex flex-1 flex-col">
                    <label className="font-['Inter'] text-[16px] text-center mb-2">
                        {vehicleType === 'Electric' ? 'kWh per 100 miles:' : isMetric ? 'Liters per 100km:' : 'Miles Per Gallon (MPG):'}
                    </label>
                    <input
                        type="text"
                        value={mpg}
                        readOnly
                        onChange={(e) => setMPG(e.target.value)}
                        placeholder="Select a vehicle"
                        className="placeholder-gray text-center border border-gray-200 rounded-full px-6 py-4"
                    />
                </div>
                <div className="flex flex-1 flex-col">
                    <label className="font-['Inter'] text-[16px] text-center mb-2">
                        {vehicleType === 'Electric' ? 'Cost per kWh:' : 'Price Per Gallon (National Avg.):'}
                    </label>
                    <input
                        type="text"
                        value={gasPrice}
                        readOnly
                        onChange={(e) => setGasPrice(e.target.value)}
                        placeholder="Select a vehicle"
                        className="placeholder-gray text-center border border-gray-200 rounded-full px-6 py-4"
                    />
                </div>
            </div>
            <button onClick={handleCalculate} className="font-['Raleway'] font-bold bg-black text-white rounded-full px-6 py-4 mt-10">Calculate Efficiency</button>
        </div>
    )
}