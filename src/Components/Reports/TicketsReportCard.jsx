import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useAppSelector } from '../../Store/hooks';

// ⚠️ Placeholder for the trend chart — API doesn't return weekly data yet
const MOCK_CHART_DATA = [
  { name: 'Week 1', value: 40 },
  { name: 'Week 2', value: 30 },
  { name: 'Week 3', value: 50 },
  { name: 'Week 4', value: 35 },
  { name: 'Week 5', value: 45 },
  { name: 'Week 6', value: 25 },
];

const TicketsReportCard = () => {
  const {
    supportTicketsReport,
    supportTicketsReportPagination,
    supportTicketsReportLoading,
  } = useAppSelector((state) => state.reports);

  const totalTickets =
    supportTicketsReportPagination?.total || supportTicketsReport.length || 0;

  // Placeholder trend — replace with API data when available
  const trendPercent = 2;
  const isPositive = true;

  const formatNumber = (n) => {
    if (n === null || n === undefined) return '0';
    return String(n).padStart(2, '0');
  };

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
          {supportTicketsReportLoading && totalTickets === 0 ? (
            <>
              <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
            </>
          ) : (
            <>
              <h2 className="text-[30px] font-bold text-[#34C759] tabular-nums">
                {formatNumber(totalTickets)} Tickets
              </h2>
              <div className="flex items-center gap-1 text-[#34C759] text-[16px]">
                {isPositive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>
                  {trendPercent}%{' '}
                  <span className="text-[#00000099]">
                    Less ticket than last month
                  </span>
                </span>
              </div>
            </>
          )}
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
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0A9B21" stopOpacity={0.44} />
                  <stop offset="100%" stopColor="#0A9B21" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '13px',
                  padding: '10px 12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(value) => [`${value} tickets`, 'Value']}
              />
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