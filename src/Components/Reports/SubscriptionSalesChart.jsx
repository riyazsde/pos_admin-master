import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

// Custom Bar component to create the background effect
const CustomBar = (props) => {
  const { x, y, width, height, fill, chartHeight, sales } = props;

  // The actual sales bar's top position (y) is calculated by Recharts.
  // The bottom of the bar is at chartHeight - margin.bottom - xAxisHeight.
  // We want the background bar to extend from the bottom of the chart
  // up to the effective top of the chart area where bars can reach.
  // A good approximation for the top of the background bar is a small offset from the top of the chart area.
  // We can calculate the maximum possible height for a bar on the chart, which is essentially
  // the Y-axis range that Recharts uses.
  const backgroundBarMaxHeight = chartHeight - 10 - 30; // Approx chart height - top margin - x-axis height
                                                      // (adjust based on your margin and exact layout)

  return (
    <g>
      {/* Background bar: should fill the available bar space from bottom to effective top */}
      <rect
        x={x}
        y={10} // Start background bar from roughly the chart's top margin (adjust if needed)
        width={width}
        height={backgroundBarMaxHeight} // Make background bar span the full available height
        fill="#E9ECF1"
        rx="3"
        ry="3"
      />
      {/* Actual data bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx="3"
        ry="3"
      />
    </g>
  );
};

const SubscriptionSalesChart = () => {
  const data = [
    { name: 'Jan', sales: 28 },
    { name: 'Feb', sales: 88 },
    { name: 'Mar', sales: 16 },
    { name: 'Apr', sales: 98 },
    { name: 'May', sales: 59 },
    { name: 'Jun', sales: 76 },
    { name: 'Jul', sales: 88 },
    { name: 'Aug', sales: 61 },
    { name: 'Sep', sales: 100 },
    { name: 'Oct', sales: 22 },
    { name: 'Nov', sales: 80 },
    { name: 'Dec', sales: 83 },
  ];

  const maxSales = Math.max(...data.map(item => item.sales));
  const yAxisDomain = [0, maxSales + (maxSales * 0.2)]; // 20% padding above max sales

  return (
    <div className="w-full max-w-full ">




 <h2 className="text-2xl font-bold text-[#2E2E30] mb-8 poppins-text">
        Subscription Sales <span className="text-gray-500 font-normal">(Report)</span>
      </h2>

<div className='bg-white rounded-3xl overflow-hidden shadow-lg p-6'>

      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#344BFD] mb-2">
          9 137 XOF
        </h1>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="#34C759"
          >
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-[#34C759] text-lg">
            12% Sold more <spam className="text-[#00000099]">than Last Month</spam>
          </span>
        </div>
      </div>

      {/* Chart Title */}
     

      {/* Chart Container */}
      <div className="relative w-full h-64"> {/* h-64 means 256px */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 30 }} // Keep bottom margin for XAxis ticks
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#2E2E30', fontSize: 12, fontWeight: 600 }}
              interval={0}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              hide={true}
              domain={yAxisDomain}
            />
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
              formatter={(value) => [`${value} XOF`, 'Sales']} // Removed unnecessary props, just use value
            />
            <Bar
              dataKey="sales"
              fill="#344BFD"
              // Pass the total chart height to CustomBar so it can scale its background
              shape={<CustomBar chartHeight={256 - 10 - 30} />} // Total height 256px - top margin - bottom margin
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
};

export default SubscriptionSalesChart;