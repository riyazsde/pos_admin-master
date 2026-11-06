// src/Components/Clients/RestaurantPerformanceChart.jsx
import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const TimeButton = ({ period, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
      isActive ? 'text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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

/* Reliable responsive hook — replaces window.innerWidth reads */
const useBreakpoint = () => {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
  };
};

const RestaurantPerformanceChart = ({
  data = [],
  selectedPeriod = '24H',
  onPeriodChange = () => {},
  title = 'Restaurants Performance',
  periods = ['24H', '1W', '1M', '6M'],
}) => {
  const { isMobile, isTablet } = useBreakpoint();

  // Defensive fallback if parent has no data yet
  const chartData = data.length
    ? data
    : [{ time: '00:00', value: 0 }];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h2 className="text-gray-600 font-medium text-lg sm:text-xl lg:text-2xl">
          {title}
        </h2>
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          {periods.map((p) => (
            <TimeButton
              key={p}
              period={p}
              isActive={selectedPeriod === p}
              onClick={() => onPeriodChange(p)}
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
              right: isMobile ? 10 : 30,
              left: isMobile ? 10 : 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="#E5E7EB"
              strokeOpacity={0.5}
              horizontal
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
              axisLine
              tickLine
              tick={{
                fontSize: isMobile ? 10 : isTablet ? 12 : 14,
                fill: '#000',
                fontWeight: 500,
              }}
              interval={isMobile ? 6 : isTablet ? 5 : 4}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 60 : 30}
            />
            <YAxis
              tickFormatter={(value) =>
                isMobile
                  ? `${(value / 1000).toFixed(0)}k`
                  : isTablet
                    ? `${(value / 1000).toFixed(0)}k XOF`
                    : `${(value / 1000).toFixed(0)} 000 XOF`
              }
              axisLine
              tickLine
              tick={{
                fontSize: isMobile ? 10 : isTablet ? 12 : 14,
                fill: '#000',
                fontWeight: 500,
              }}
              width={isMobile ? 40 : isTablet ? 60 : 80}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#strokeGradient)"
              strokeWidth={isMobile ? 2 : 3}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RestaurantPerformanceChart;