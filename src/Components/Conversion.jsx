import { GoArrowDown } from "react-icons/go"

export default function Conversion({ isMetric, setIsMetric }) {
    return (
        <div className="flex justify-center mt-3">
            <button onClick={() => setIsMetric(!isMetric)} className="cursor-pointer transition duration-200 hover:bg-gray-300 bg-gray-200 w-45 h-10 rounded-full flex items-center justify-center gap-2">
                {isMetric ? "Metric (L/100km)" : "Imperial (MPG)"} <GoArrowDown />
            </button>
        </div>
    )
}