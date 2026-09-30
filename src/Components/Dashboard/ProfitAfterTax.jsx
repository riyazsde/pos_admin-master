import React, { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setProfitData,
  setProfitLoading,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';

const ProfitAfterTax = () => {
  const dispatch = useAppDispatch();
  const { profit, profitLoading } = useAppSelector((state) => state.dashboard);

  // ✅ Fetch on mount if not already loaded
  useEffect(() => {
    if (profit) return;

    const fetchProfit = async () => {
      dispatch(setProfitLoading(true));
      try {
        const data = await dashboardService.getProfitAfterTax();
        dispatch(setProfitData(data));
      } catch (err) {
        console.error('Profit fetch error:', err);
        dispatch(setProfitLoading(false));
      }
    };

    fetchProfit();
  }, [dispatch, profit]);

  // ⚠️ API doesn't return monthly chart data — using placeholder
  // If backend adds `monthlyTrend` array later, use profit.monthlyTrend
  const chartData =
    profit?.monthlyTrend ||
    [
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

  const netProfit = profit?.netProfit ?? 0;
  const currency = profit?.currency || 'XOF';
  const gaugePercentage = profit?.gaugePercentage ?? 0;
  const comparison = profit?.monthlyComparison;
  const revenue = profit?.revenue;

  const isPositive = comparison?.isPositive !== false;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-500';

  const formatNumber = (n) => {
    if (n === null || n === undefined) return '0';
    return Number(n).toLocaleString('en-US');
  };

  if (profitLoading && !profit) {
    return (
      <div className="h-full flex flex-col gap-4 min-w-0">
        <h2 className="text-2xl font-bold text-black">Profit After Tax</h2>
        <div className="flex-1 bg-white rounded-3xl shadow-md border border-gray-100 px-6 py-5 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 min-w-0">
      {/* Header */}
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
        {/* Top stats row */}
        <div className="flex items-start justify-between mb-3 gap-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Net Profit
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-black">
                {formatNumber(netProfit)}
              </span>
              <span className="text-sm font-medium text-gray-500">{currency}</span>
            </div>

            {comparison?.message && (
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trendColor}`}>
                <TrendIcon className="w-3.5 h-3.5" />
                <span>{comparison.message}</span>
              </div>
            )}
          </div>

          {/* Gauge circle */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="#F3E8F5"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="url(#profitGradient)"
                strokeWidth="4"
                strokeDasharray={`${gaugePercentage} ${100 - gaugePercentage}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6A1B9A" />
                  <stop offset="100%" stopColor="#D32F2F" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-800">{gaugePercentage}%</span>
            </div>
          </div>
        </div>

        {/* Revenue row */}
        {revenue && (
          <div className="flex items-center gap-4 mb-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-gray-500">This month:</span>
              <span className="font-semibold text-gray-800">
                {formatNumber(revenue.currentMonth)} {currency}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Last month:</span>
              <span className="font-semibold text-gray-800">
                {formatNumber(revenue.lastMonth)} {currency}
              </span>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
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
                formatter={(value) => [`${formatNumber(value)} ${currency}`, 'Value']}
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
  );
};

export default ProfitAfterTax;