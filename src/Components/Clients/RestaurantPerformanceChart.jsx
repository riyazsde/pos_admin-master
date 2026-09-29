import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

const TimeButton = ({ period, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
        isActive
          ? 'text-white'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
      style={
        isActive
          ? { background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)' }
          : {}
      }
    >
      {period}
    </button>
  );
};

const RestaurantPerformanceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24H');

  // Chart data that matches the image pattern
  const chartData = [
    { time: '10:30', value: 3200 },
    { time: '11:00', value: 3400 },
    { time: '11:30', value: 3600 },
    { time: '12:00', value: 3800 },
    { time: '12:30', value: 3500 },
    { time: '13:00', value: 3700 },
    { time: '13:30', value: 4200 },
    { time: '14:00', value: 5800 },
    { time: '14:30', value: 6500 },
    { time: '15:00', value: 6200 },
    { time: '15:30', value: 5400 },
    { time: '16:00', value: 6200 },
    { time: '16:30', value: 6800 },
    { time: '17:00', value: 7200 },
    { time: '17:30', value: 7800 },
    { time: '18:00', value: 7400 },
    { time: '18:30', value: 8200 },
    { time: '19:00', value: 9200 },
    { time: '19:30', value: 9800 },
    { time: '20:00', value: 9600 },
    { time: '20:30', value: 8800 }
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h2 className="text-gray-600 font-medium text-lg sm:text-xl lg:text-2xl">
          Restaurants Performance
        </h2>
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          {['24H', '1W', '1M', '6M'].map((period) => (
            <TimeButton
              key={period}
              period={period}
              isActive={selectedPeriod === period}
              onClick={() => setSelectedPeriod(period)}
            />
          ))}
        </div>
      </div>
      
      <div className="h-64 sm:h-80 lg:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ 
              top: 20, 
              right: window.innerWidth < 640 ? 10 : 30, 
              left: window.innerWidth < 640 ? 10 : 20, 
              bottom: 20 
            }}
          >
            <CartesianGrid 
              strokeDasharray="0" 
              stroke="#E5E7EB" 
              strokeOpacity={0.5} 
              horizontal={true} 
              vertical={false} 
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6A1B9A" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#D32F2F" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6A1B9A" />
                <stop offset="100%" stopColor="#D32F2F" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={true}
              tickLine={true}
              tick={{
                fontSize: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14,
                fill: '#000000',
                fontWeight: 500,
              }}
              interval={window.innerWidth < 640 ? 6 : window.innerWidth < 1024 ? 5 : 4}
              angle={window.innerWidth < 640 ? -45 : 0}
              textAnchor={window.innerWidth < 640 ? 'end' : 'middle'}
              height={window.innerWidth < 640 ? 60 : 30}
            />
            <YAxis
              domain={[0, 10000]}
              ticks={[1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]}
              tickFormatter={(value) => 
                window.innerWidth < 640 
                  ? `${(value/1000).toFixed(0)}k` 
                  : window.innerWidth < 1024
                  ? `${(value/1000).toFixed(0)}k XOF`
                  : `${(value/1000).toFixed(0)} 000 XOF`
              }
              axisLine={true}
              tickLine={true}
              tick={{
                fontSize: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14,
                fill: '#000000',
                fontWeight: 500,
              }}
              width={window.innerWidth < 640 ? 40 : window.innerWidth < 1024 ? 60 : 80}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#strokeGradient)"
              strokeWidth={window.innerWidth < 640 ? 2 : 3}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RestaurantPerformanceChart;