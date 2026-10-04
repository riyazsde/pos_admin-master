import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import { Loader2 } from 'lucide-react';

import { useAppSelector } from '../../Store/hooks';

// ---------------------------------------------------------------------------
// Custom bar with grey background track
// ---------------------------------------------------------------------------
const CustomBar = (props) => {
  const { x, y, width, height, fill, chartHeight } = props;
  const backgroundBarMaxHeight = chartHeight - 10 - 30;

  return (
    <g>
      <rect
        x={x}
        y={10}
        width={width}
        height={backgroundBarMaxHeight}
        fill="#E9ECF1"
        rx="3"
        ry="3"
      />
      <rect x={x} y={y} width={width} height={height} fill={fill} rx="3" ry="3" />
    </g>
  );
};

const FALLBACK_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const HardwareChart = () => {
  const {
    monthlyBreakdown,
    totalHardwareSold,
    hardwareSalesChange,
    loading,
    hasLoaded,
  } = useAppSelector((state) => state.posHardware);

  // ✅ Build chart data
  const data =
    monthlyBreakdown && monthlyBreakdown.length > 0
      ? monthlyBreakdown.map((item) => ({
          name:
            item.month ||
            item.monthName ||
            FALLBACK_MONTHS[(item.monthIndex || 0) - 1] ||
            '—',
          sales: item.count ?? item.sales ?? 0,
          revenue: item.revenue ?? 0,
        }))
      : FALLBACK_MONTHS.map((m) => ({ name: m, sales: 0 }));

  const maxSales = Math.max(...data.map((d) => d.sales), 1);
  const yAxisDomain = [0, maxSales + maxSales * 0.2];

  const formatNumber = (n) => {
    if (n === null || n === undefined) return '0';
    return Number(n).toLocaleString('en-US');
  };

  const changeText = hardwareSalesChange || '0%';
  const isPositive = !String(changeText).startsWith('-');

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2E2E30] mb-4 poppins-text shrink-0">
        Hardware Sold
      </h2>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 flex flex-col min-h-0">
        {/* Header */}
        <div className="mb-6 shrink-0">
          {loading && !hasLoaded ? (
            <div className="flex flex-col gap-2">
              <div className="h-9 w-40 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-4 w-56 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-[#344BFD] mb-2 tabular-nums">
                {formatNumber(totalHardwareSold)}{' '}
                <span className="text-lg text-gray-500 font-medium">units</span>
              </h1>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill={isPositive ? '#34C759' : '#FF3B30'}
                >
                  <path
                    fillRule="evenodd"
                    d={
                      isPositive
                        ? 'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'
                        : 'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'
                    }
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className={`text-lg ${
                    isPositive ? 'text-[#34C759]' : 'text-[#FF3B30]'
                  }`}
                >
                  {changeText}{' '}
                  <span className="text-[#00000099]">
                    change from last month
                  </span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0 w-full">
          {loading && !hasLoaded ? (
            <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#2E2E30', fontSize: 12, fontWeight: 600 }}
                  interval={0}
                  padding={{ left: 5, right: 5 }}
                />
                <YAxis hide domain={yAxisDomain} />
                <Tooltip
                  cursor={{ fill: 'rgba(52, 75, 253, 0.1)' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '14px',
                    padding: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: '#1F2937', fontWeight: 'bold' }}
                  formatter={(value) => [`${value} units`, 'Sold']}
                />
                <Bar
                  dataKey="sales"
                  fill="#344BFD"
                  shape={<CustomBar chartHeight={340} />}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default HardwareChart;