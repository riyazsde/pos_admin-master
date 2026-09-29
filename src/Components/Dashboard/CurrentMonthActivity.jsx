import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// ✅ NEW: Accept `data` prop from Redux via Dashboard.jsx
const CurrentMonthActivity = ({ data }) => {
  // ✅ Transform API shape → chart shape
  // API:    { day: 'Sun', newClients: 0, existingClientsRenewal: 0 }
  // Chart:  { name: 'Sun', newClients: 0, renewals: 0 }
  const chartData =
    data?.data?.map((item) => ({
      name: item.day,
      newClients: item.newClients,
      renewals: item.existingClientsRenewal,
    })) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-2 rounded shadow-md text-xs">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p>{`New Clients: ${payload[0].payload.newClients}`}</p>
          <p>{`Client Renewals: ${payload[0].payload.renewals}`}</p>
        </div>
      );
    }
    return null;
  };

  // Optional: compute a nice Y-axis tick array based on max value
  const maxValue = Math.max(
    100, // minimum for aesthetics
    ...chartData.map((d) => Math.max(d.newClients, d.renewals))
  );
  const yTicks = [0, Math.round(maxValue / 4), Math.round(maxValue / 2), maxValue];

  return (
    <div className="w-full">
      {/* Main Card Container */}
      <div
        className="bg-white rounded-3xl p-6 h-full shadow-sm border border-gray-100"
        style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}
      >
        {/* Header: Title + Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-black font-[Poppins]">
            {data?.title || 'Daily Activity'}
          </h2>

          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
                }}
              ></div>
              <span className="text-xs font-medium text-black font-[Poppins]">
                New Clients
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(106, 27, 154, 0.4) 0%, rgba(211, 47, 47, 0.4) 100%)',
                }}
              ></div>
              <span className="text-xs font-medium text-black font-[Poppins]">
                Clients Renewals
              </span>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400 font-[Poppins] text-sm">
            No activity data available
          </div>
        ) : (
          <div className="relative h-80">
            {/* Y-axis Label */}
            <div className="absolute -left-2 top-0 -translate-y-6">
              <span className="text-[10px] font-semibold text-gray-500 font-[Poppins]">
                Orders
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barCategoryGap={20}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="newClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6A1B9A" />
                    <stop offset="100%" stopColor="#D32F2F" />
                  </linearGradient>
                  <linearGradient id="renewals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(106, 27, 154, 0.4)" />
                    <stop offset="100%" stopColor="rgba(211, 47, 47, 0.4)" />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#F3F3F5" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#000"
                  tick={{ fontSize: 12, fontFamily: 'Poppins', fill: '#000' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#000"
                  tick={{ fontSize: 12, fontFamily: 'Poppins', fill: '#000' }}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  ticks={yTicks} // ✅ dynamic ticks
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar
                  dataKey="newClients"
                  fill="url(#newClients)"
                  radius={[10, 10, 0, 0]}
                  barSize={15}
                />
                <Bar
                  dataKey="renewals"
                  fill="url(#renewals)"
                  radius={[10, 10, 0, 0]}
                  barSize={15}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentMonthActivity;