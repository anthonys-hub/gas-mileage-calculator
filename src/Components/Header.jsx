export default function Header() {
    return (
        <div className="flex flex-col items-center justify-center pt-4 mt-10 gap-1">
            <h1 className="font-['Inter'] text-[32px]">Gas Mileage Calculator</h1>
            <div className="font-['Raleway'] items-center justify-center text-gray-400">
                <span>Calculate fuel efficiency, trip costs, and compare vehicles</span>
            </div>
        </div>
    )
}