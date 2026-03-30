import { useState, useRef } from 'react'
import InputCard from './Components/InputCard'
import Header from './Components/Header'
import VehicleSelect from './Components/VehicleSelect'
import Calculate from './Components/Calculate'
import Conversion from './Components/Conversion'
import Results from './Components/Results'

function App() {
  const [elevation, setElevation] = useState(null)
  const [distance, setDistance] = useState(null)
  const [isMetric, setIsMetric] = useState(false)
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [vehicleType, setVehicleType] = useState('Car')
  const [mpg, setMPG] = useState('')
  const [gasPrice, setGasPrice] = useState('')
  const [fuelUsed, setFuelUsed] = useState(null)
  const [cost, setCost] = useState(null)
  const [calculated, setCalculated] = useState(false)
  const [originCoords, setOriginCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)
  const resultsRef = useRef(null)

  async function handleCalculate() {
    try {
      const originRes = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${import.meta.env.VITE_ORS_API_KEY}&text=${origin}`)
      const destinationRes = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${import.meta.env.VITE_ORS_API_KEY}&text=${destination}`)

      const data = await originRes.json()
      const originCoords = data.features[0].geometry.coordinates
      setOriginCoords(originCoords)

      const dest = await destinationRes.json()
      const destinationCoords = dest.features[0].geometry.coordinates
      setDestinationCoords(destinationCoords)

      const directionsRes = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': import.meta.env.VITE_ORS_API_KEY
        },
        body: JSON.stringify({ coordinates: [originCoords, destinationCoords], elevation: true })
      })

      const directionsData = await directionsRes.json()
      const distanceMiles = directionsData.routes[0].summary.distance / 1609.34

      setElevation(directionsData.routes[0].summary.ascent)
      setDistance(distanceMiles)

      let fuelUsed
      if (vehicleType === 'Electric') {
        fuelUsed = distanceMiles * mpg / 100
      } else {
        fuelUsed = distanceMiles / mpg
      }

      const cost = fuelUsed * parseFloat(gasPrice)
      setFuelUsed(fuelUsed)
      setCost(cost)
      setCalculated(true)

      if (isMetric) {
        setDistance(distanceMiles * 1.60934)
        setFuelUsed(235.214 / mpg)
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)

    } catch (error) {
      alert('Could not find one or more addresses. Please try again with a more specific address.')
    }
  }

  return (
    <div className={`bg-white ${!calculated ? 'overflow-hidden h-screen' : ''}`}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Conversion isMetric={isMetric} setIsMetric={setIsMetric} />
        <InputCard origin={origin} setOrigin={setOrigin} destination={destination} setDestination={setDestination} />
        <VehicleSelect
          year={year} setYear={setYear}
          make={make} setMake={setMake}
          model={model} setModel={setModel}
          vehicleType={vehicleType} setVehicleType={setVehicleType}
          setMPG={setMPG} setGasPrice={setGasPrice}
        />
        <Calculate
          isMetric={isMetric}
          vehicleType={vehicleType}
          gasPrice={gasPrice} setGasPrice={setGasPrice}
          mpg={mpg} setMPG={setMPG}
          handleCalculate={handleCalculate}
        />
      </div>
      <div ref={resultsRef} className="min-h-screen">
        {fuelUsed && (
          <Results
            distance={distance}
            fuelUsed={fuelUsed}
            cost={cost}
            mpg={mpg}
            gasPrice={gasPrice}
            year={year}
            make={make}
            model={model}
            elevation={elevation}
            origin={origin}
            destination={destination}
            originCoords={originCoords}
            destinationCoords={destinationCoords}
            vehicleType={vehicleType}
            isMetric={isMetric}
          />
        )}
      </div>
    </div>
  )
}

export default App
