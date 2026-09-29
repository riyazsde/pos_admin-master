import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ProfitAfterTax = () => {
  const data = [
    { month: 'Jan', value: 4200 },
    { month: 'Feb', value: 7800 },
    { month: 'Mar', value: 5200 },
    { month: 'Apr', value: 9200 },
    { month: 'May', value: 3800 },
    { month: 'Jun', value: 6400 },
    { month: 'Jul', value: 8900 },
    { month: 'Aug', value: 4600 },
    { month: 'Sep', value: 9800 },
    { month: 'Oct', value: 4100 },
    { month: 'Nov', value: 8600 },
    { month: 'Dec', value: 6900 },
  ];

  return (
    <>
      <div className="h-full flex flex-col gap-4 min-w-0">
        {/* Header with inline dropdown */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-black whitespace-nowrap">
            Profit After Tax
          </h2>
          <select className="text-sm border border-gray-400 rounded-md px-3 py-1.5 bg-white text-black focus:outline-none">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Card */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-md border border-gray-100 px-6 py-5 min-h-0">
          <div className="text-sm font-semibold text-black mb-2">Net Profit</div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#333' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: 12,
                  }}
                />
                <Line
                  type="linear"
                  dataKey="value"
                  stroke="#E91E63"
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: '#E91E63', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#E91E63' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfitAfterTax;