import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopPerformers = () => {
  const navigate = useNavigate();

  const performersData = [
    { id: '01', company: 'AOH Bars', city: 'Abidjan', devices: 120, sales: '9.9M XOF', salesSub: '8,900,000 XOF', growth: '+18%', support: 'Excellent' },
    { id: '01', company: 'AOH Bars', city: 'Abidjan', devices: 120, sales: '9.9M XOF', salesSub: '8,900,000 XOF', growth: '+18%', support: 'Excellent' },
    { id: '01', company: 'AOH Bars', city: 'Abidjan', devices: 120, sales: '9.9M XOF', salesSub: '8,900,000 XOF', growth: '+18%', support: 'Excellent' },
    { id: '01', company: 'AOH Bars', city: 'Abidjan', devices: 120, sales: '9.9M XOF', salesSub: '8,900,000 XOF', growth: '+18%', support: 'Excellent' },
    { id: '01', company: 'AOH Bars', city: 'Abidjan', devices: 120, sales: '9.9M XOF', salesSub: '8,900,000 XOF', growth: '+18%', support: 'Excellent' },
  ];

  return (
    <div className="h-full flex flex-col gap-4 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Top Performers</h2>
        <button
          onClick={() => navigate('/top-performers-list')}
          className="text-sm font-semibold text-black hover:underline"
        >
          See all
        </button>
      </div>

      {/* Card — single scroll container, NO decorative bar */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden min-h-0">
        <div
          className="flex-1 overflow-x-auto overflow-y-hidden min-h-0
            [&::-webkit-scrollbar]:h-1.5
            [&::-webkit-scrollbar-track]:bg-[#F3E8F5]
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gradient-to-r
            [&::-webkit-scrollbar-thumb]:from-[#B934D8]
            [&::-webkit-scrollbar-thumb]:to-[#E91E63]
            [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          <div className="min-w-[760px] flex flex-col">
            {/* Header Row */}
            <div className="grid grid-cols-7 bg-gradient-to-r from-[#F3E8F5] to-[#FBE9EC] text-black/70 font-semibold text-sm px-4 py-3">
              <div>#</div>
              <div>Company Name</div>
              <div>City</div>
              <div>Device Count</div>
              <div>Total Sales</div>
              <div>Growth %</div>
              <div className="flex items-center gap-1">
                Support <span className="text-xs">⇅</span>
              </div>
            </div>

            {/* Data Rows */}
            {performersData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-7 items-center px-4 py-2.5 text-sm text-black border-b border-gray-100"
              >
                <div>{item.id}</div>
                <div>{item.company}</div>
                <div>{item.city}</div>
                <div>{item.devices}</div>
                <div className="flex flex-col leading-tight">
                  <span className="text-green-600 font-medium">{item.sales}</span>
                  <span className="text-[10px] text-gray-400">{item.salesSub}</span>
                </div>
                <div className="text-green-600 font-medium">{item.growth}</div>
                <div className="text-green-600 font-medium">{item.support}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ❌ REMOVED the fake accent bar div that was here */}
      </div>
    </div>
  );
};

export default TopPerformers;