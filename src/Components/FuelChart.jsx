import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';

export default function FuelChart({ baseFuel = 0, elevationFuel = 0, vehicleType, isMetric }) {

    const safeBase = Number(baseFuel) || 0;
    const safeElevation = Number(elevationFuel) || 0;
    const total = (safeBase + safeElevation).toFixed(2);
    const unit = vehicleType === 'Electric' ? 'kWh' : isMetric ? 'L' : 'gal';
    const unitLong = vehicleType === 'Electric' ? 'kWh' : isMetric ? 'liters' : 'gallons';

    const data = [
        {
            name: 'Fuel Usage',
            base: safeBase,
            elevation: safeElevation
        }
    ];

    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data} margin={{ right: 60, left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            width={100}
                        />
                        <Bar dataKey="base" stackId="a" fill="#a3a525" barSize={30} radius={[4, 0, 0, 4]}>
                            <LabelList dataKey="base" position="insideLeft" formatter={(v) => `${v.toFixed(2)} ${unit}`} />
                        </Bar>
                        <Bar dataKey="elevation" stackId="a" fill="#ff0000" barSize={30} radius={[0, 4, 4, 0]}>
                            <LabelList dataKey="elevation" position="right" formatter={(v) => `${v.toFixed(2)} ${unit}`} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center mt-8 space-y-2 text-xl font-['Inter']">
                <p>Base Fuel: {safeBase.toFixed(2)} {unitLong}</p>
                <p className="text-gray-400">+</p>
                <p>Elevation: {safeElevation.toFixed(2)} {unitLong}</p>
                <div className="w-48 h-[1px] bg-gray-300 mx-auto my-4"></div>
                <p className="text-2xl font-bold">Total: {total} {unitLong}</p>
            </div>
        </div>
    );
}