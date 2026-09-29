import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Dot,
} from 'recharts';

// White dot with colored border (matches Figma exactly)
const CustomDot = (props) => {
  const { cx, cy, stroke } = props;
  return (
    <Dot cx={cx} cy={cy} r={5} fill="#FFFFFF" stroke={stroke} strokeWidth={2.5} />
  );
};

// ✅ NEW: Accept `data` prop from Redux via Dashboard.jsx
export default function MonthlyGrowthChart({ data }) {
  // ✅ Transform API shape → chart shape
  // API:   { month: 'Aug', newClients: 4, existingClientsRenewal: 0 }
  // Chart: { month: 'Aug', newClients: 4, renewals: 0 }
  const chartData =
    data?.data?.map((item) => ({
      month: item.month,
      newClients: item.newClients,
      renewals: item.existingClientsRenewal,
    })) || [];

  // Dynamic Y-axis domain based on data
  const maxValue = Math.max(100, ...chartData.flatMap((d) => [d.newClients, d.renewals]));
  const yMax = Math.ceil(maxValue / 100) * 100; // round up to nearest 100
  const yTicks = [0, Math.round(yMax / 4), Math.round(yMax / 2), yMax];

  return (
    <div className="w-full">
      <div
        className="bg-white rounded-3xl h-full p-6"
        style={{
          boxShadow:
            '0px 4px 20px rgba(0, 0, 0, 0.05), inset 0px 0px 1px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header: Title on left, Legend on right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-xl font-bold text-black font-[Poppins]">
            {data?.title || 'Monthly Growth'}
          </h2>

          {/* Legend */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(106, 27, 154, 0.45) 0%, rgba(211, 47, 47, 0.45) 100%)',
                }}
              ></div>
              <span className="text-[11px] font-medium text-black font-[Poppins]">
                New Clients
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
                }}
              ></div>
              <span className="text-[11px] font-medium text-black font-[Poppins]">
                Clients Renewals
              </span>
            </div>
          </div>
        </div>

        {/* Subtitle from API (optional) */}
        {data?.subtitle && (
          <p className="text-xs text-gray-500 font-[Poppins] mb-4 -mt-4">
            {data.subtitle}
          </p>
        )}

        {/* Empty state */}
        {chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-gray-400 font-[Poppins] text-sm">
            No growth data available
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="newClientsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(106, 27, 154, 0.45)" />
                    <stop offset="100%" stopColor="rgba(211, 47, 47, 0.45)" />
                  </linearGradient>

                  <linearGradient id="renewalsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6A1B9A" />
                    <stop offset="100%" stopColor="#D32F2F" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#F0F0F2"
                  strokeWidth={1}
                  vertical={false}
                  horizontal={true}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fill: '#1a1a1a',
                  }}
                  dy={8}
                />

                <YAxis
                  domain={[0, yMax]} // ✅ dynamic
                  ticks={yTicks} // ✅ dynamic
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fill: '#1a1a1a',
                  }}
                  width={45}
                />

                <Line
                  type="monotone"
                  dataKey="newClients"
                  stroke="url(#newClientsGradient)"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />

                <Line
                  type="monotone"
                  dataKey="renewals"
                  stroke="url(#renewalsGradient)"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}