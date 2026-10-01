import React, { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Loader2, Activity, ChevronRight } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setTransactionGraphData,
  setTransactionGraphLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
};

const TransactionGraph = () => {
  const dispatch = useAppDispatch();

  const { transactionGraph, transactionGraphLoading } = useAppSelector(
    (state) => state.reports
  );

  // ✅ Fetch once
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchGraph = async () => {
      dispatch(setTransactionGraphLoading(true));
      try {
        const data = await reportService.getTransactionGraph(12);
        dispatch(setTransactionGraphData(data));
      } catch (err) {
        console.error('Transaction graph fetch error:', err);
        dispatch(setTransactionGraphLoading(false));
      }
    };

    fetchGraph();
  }, [dispatch]);

  // ✅ Build "used vs remaining" visualization from top payment methods
  const topMethods = transactionGraph?.topPaymentMethods || [];
  const summary = transactionGraph?.monthly?.[0] || { count: 0, totalAmount: 0 };
  const totalAmount = summary.totalAmount || 0;

  // Pick the top payment method as the "used" slice
  const topMethod = topMethods[0];
  const topMethodShare =
    totalAmount > 0 && topMethod
      ? Math.round((topMethod.totalAmount / totalAmount) * 100)
      : 0;

  const pieData = [
    { name: topMethod?._id || 'Used', value: topMethodShare },
    { name: 'Remaining', value: Math.max(100 - topMethodShare, 0) },
  ];

  const COLORS = ['url(#grad1)', '#E5E7EB'];

  // Format the trend line
  const daily = transactionGraph?.daily || [];
  const currentMonth = transactionGraph?.monthly?.[0];
  const countLabel = currentMonth?.count ?? 0;

  return (
    <div className="w-full h-full flex flex-col font-poppins">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Transaction Graph{' '}
            <span className="text-gray-400 font-medium">(Report)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Last 12 months · {countLabel} transaction{countLabel !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="group flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-black transition-colors">
          Details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ---------- Card ---------- */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 flex flex-col min-h-0">
        {transactionGraphLoading && !transactionGraph ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">Loading graph…</span>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="shrink-0 mb-4">
              <p className="text-gray-400 text-sm mb-1">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-[#941C93] tabular-nums">
                {formatNumber(totalAmount)}{' '}
                <span className="text-sm font-medium text-gray-500">XOF</span>
              </p>
              {topMethod && (
                <p className="text-sm mt-1 text-gray-700">
                  Top method:{' '}
                  <span className="text-green-600 font-semibold">
                    {topMethod._id}
                  </span>{' '}
                  ({topMethod.count} transactions)
                </p>
              )}
            </div>

            {/* Chart */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0">
              <div className="relative w-[200px] h-[200px] shrink-0">
                {totalAmount > 0 ? (
                  <>
                    <PieChart width={200} height={200}>
                      <defs>
                        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#DF4C4C" />
                          <stop offset="100%" stopColor="#7D2AE8" />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={pieData}
                        cx={100}
                        cy={100}
                        innerRadius={65}
                        outerRadius={95}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          fontSize: '13px',
                          padding: '10px 12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                      />
                    </PieChart>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-red-100 flex items-center justify-center mb-1">
                        <Activity className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="text-2xl font-bold text-[#2E2E30] tabular-nums">
                        {topMethodShare}%
                      </span>
                      <span className="text-[10px] text-gray-500 mt-0.5">
                        {topMethod?._id || 'Top Method'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 rounded-full border border-dashed border-gray-200">
                    <span className="text-sm font-medium">No transactions</span>
                    <span className="text-xs">in this period</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionGraph;