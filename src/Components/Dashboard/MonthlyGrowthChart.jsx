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

const data = [
  { month: 'Jan', newClients: 50, renewals: 30 },
  { month: 'Feb', newClients: 180, renewals: 120 },
  { month: 'Mar', newClients: 450, renewals: 320 },
  { month: 'Apr', newClients: 120, renewals: 80 },
  { month: 'May', newClients: 480, renewals: 380 },
  { month: 'Jun', newClients: 460, renewals: 340 },
];

// White dot with colored border (matches Figma exactly)
const CustomDot = (props) => {
  const { cx, cy, stroke } = props;
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={5}
      fill="#FFFFFF"
      stroke={stroke}
      strokeWidth={2.5}
    />
  );
};

export default function MonthlyGrowthChart() {
  return (
    <div className="w-full">
      <div
        className="bg-white rounded-3xl  h-full p-6"
        style={{
          boxShadow:
            '0px 4px 20px rgba(0, 0, 0, 0.05), inset 0px 0px 1px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header: Title on left, Legend on right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-xl font-bold text-black font-[Poppins]">
            Monthly Growth
          </h2>

          {/* Legend - matching Figma colors */}
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
                  background:
                    'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
                }}
              ></div>
              <span className="text-[11px] font-medium text-black font-[Poppins]">
                Clients Renewals
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
            >
              <defs>
                {/* Light gradient for New Clients */}
                <linearGradient
                  id="newClientsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="rgba(106, 27, 154, 0.45)" />
                  <stop offset="100%" stopColor="rgba(211, 47, 47, 0.45)" />
                </linearGradient>

                {/* Strong gradient for Client Renewals */}
                <linearGradient
                  id="renewalsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#6A1B9A" />
                  <stop offset="100%" stopColor="#D32F2F" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines only */}
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
                domain={[0, 500]}
                ticks={[0, 100, 250, 500]}
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

              {/* New Clients line - lighter, on top in Figma */}
              <Line
                type="monotone"
                dataKey="newClients"
                stroke="url(#newClientsGradient)"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />

              {/* Client Renewals line - darker, main line */}
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
      </div>
    </div>
  );
}