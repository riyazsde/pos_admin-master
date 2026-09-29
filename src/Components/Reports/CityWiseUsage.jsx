import React from 'react';

const CityWiseUsage = () => {
  const consumptionData = [
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
    { city: 'Cairo', value: 10, type: 'Low' },
    { city: 'Cairo', value: 10, type: 'Good' },
  ];

  const getBarHeightClass = (index) => {
    const heights = [
      'h-[68.2px]', 'h-[116.82px]', 'h-[77px]', 'h-[97px]', 'h-[41px]',
      'h-[119px]', 'h-[41.42px]', 'h-[15px]', 'h-[41.42px]', 'h-[31px]',
      'h-[41.42px]', 'h-[69px]', 'h-[41.42px]', 'h-[111px]', 'h-[29px]',
      'h-[111px]', 'h-[41.42px]', 'h-[66px]', 'h-[94px]', 'h-[31px]',
      'h-[132px]', 'h-[99px]', 'h-[32px]', 'h-[140.33px]', 'h-[39px]',
      'h-[101.82px]',
    ];
    return heights[index];
  };

  return (
    <div className="w-full px-4 md:px-10 py-6">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl font-bold text-black">City Wise Usage (Report)</h2>

        <div className="w-full bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25),inset_0px_0px_1px_rgba(0,0,0,0.25)] rounded-[25px] p-6 relative">
          {/* Legend */}
          <div className="flex gap-6 absolute right-6 top-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#FF955A]"></div>
              <span className="text-base font-medium text-black">Low consumption</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#344BFD]"></div>
              <span className="text-base font-medium text-black">Good consumption</span>
            </div>
          </div>

          {/* Scrollable Bar Chart */}
          <div className="mt-20 w-full overflow-x-auto">
            <div className="min-w-fit flex items-end gap-4 px-2">
              {consumptionData.map((data, index) => (
                <div key={index} className="flex flex-col items-center w-12">
                  <div className="text-sm mb-1 font-medium text-black">{data.value}</div>
                  <div
                    className={`w-4 rounded-md ${
                      data.type === 'Low' ? 'bg-[#FF955A]' : 'bg-[#344BFD]'
                    } ${getBarHeightClass(index)}`}
                  ></div>
                  <div className="mt-1 text-xs font-semibold text-black">{data.city}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityWiseUsage;
