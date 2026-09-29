import React from 'react';
import { ChevronUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Week 1', value: 40 },
  { name: 'Week 2', value: 30 },
  { name: 'Week 3', value: 50 },
  { name: 'Week 4', value: 35 },
  { name: 'Week 5', value: 45 },
  { name: 'Week 6', value: 25 },
];

const TicketsReportCard = () => {
  return (
    <div className="w-full h-[368px] flex flex-col gap-4 font-[Poppins]">
      {/* Header */}
      <div className="text-[24px] font-bold text-black leading-[36px]">
        Tickets <span className="text-gray-500 font-normal">(Report)</span>
      </div>

      {/* Card */}
      <div className="relative bg-white shadow-md rounded-[25px] w-full h-[316px] overflow-hidden">
        {/* Top Left Text */}
        <div className="absolute top-6 left-4 flex flex-col gap-2">
          <h2 className="text-[30px] font-bold text-[#34C759]">05 Tickets</h2>
          <div className="flex items-center gap-1 text-[#34C759] text-[16px]">
            <ChevronUp size={14} />
            <span>2% <span className='text-[#00000099]'>Less ticket than last month </span></span>
          </div>
        </div>

        {/* Top Right Filter */}
        <div className="absolute top-6 right-0 flex items-center bg-gradient-to-b from-purple-700/10 to-red-700/10 rounded-l-full px-4 py-1 gap-3 h-[26px]">
          <span className="text-[12px] font-semibold text-black">1M</span>
          <span className="text-[12px] font-semibold text-black/50">3M</span>
          <span className="text-[12px] font-semibold text-black/50">6M</span>
          <span className="text-[12px] font-semibold text-black/50">1Y</span>
        </div>

        {/* Chart */}
        <div className="absolute bottom-0 left-0 w-full h-[163px] px-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0A9B21" stopOpacity={0.44} />
                  <stop offset="100%" stopColor="#0A9B21" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#34C759"
                strokeWidth={3}
                fill="url(#greenGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TicketsReportCard;
