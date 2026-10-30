import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Loader2, Activity, ChevronRight } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setTransactionGraphData,
  setTransactionGraphLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString('en-US');
};

const formatAmount = (value) => {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return '--';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '--';

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Calculate totals across the entire reporting period.
const calculateSummary = (graph) => {
  const records =
    Array.isArray(graph?.monthly) && graph.monthly.length > 0
      ? graph.monthly
      : Array.isArray(graph?.daily)
        ? graph.daily
        : [];

  return records.reduce(
    (result, record) => ({
      count: result.count + Number(record.count || 0),
      totalAmount: result.totalAmount + Number(record.totalAmount || 0),
    }),
    {
      count: 0,
      totalAmount: 0,
    }
  );
};

const TransactionGraph = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { transactionGraph, transactionGraphLoading } = useAppSelector(
    (state) => state.reports
  );

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    const fetchGraph = async () => {
      dispatch(setTransactionGraphLoading(true));

      try {
        const data = await reportService.getTransactionGraph(12);
        dispatch(setTransactionGraphData(data));
      } catch (error) {
        console.error('Transaction graph fetch error:', error);
        dispatch(setTransactionGraphLoading(false));
      }
    };

    fetchGraph();
  }, [dispatch]);

  // Aggregate all monthly records, not only monthly[0].
  const summary = useMemo(
    () => calculateSummary(transactionGraph),
    [transactionGraph]
  );

  const totalTransactions = summary.count;
  const totalAmount = summary.totalAmount;

  const topMethods = Array.isArray(transactionGraph?.topPaymentMethods)
    ? transactionGraph.topPaymentMethods
    : [];

  const topMethod = topMethods[0] || null;

  // Top payment method amount as a percentage of total transaction value.
  const topMethodShare =
    totalAmount > 0 && topMethod
      ? Math.min(
          100,
          Math.max(0, (Number(topMethod.totalAmount || 0) / totalAmount) * 100)
        )
      : 0;

  const roundedShare = Math.round(topMethodShare);

  const pieData = [
    {
      name: topMethod?._id || t('reports.transactionGraph.used'),
      value: topMethodShare,
    },
    {
      name: t('reports.transactionGraph.remaining'),
      value: Math.max(100 - topMethodShare, 0),
    },
  ];

  const COLORS = ['url(#transactionGradient)', '#E5E7EB'];

  const period = transactionGraph?.period;

  const periodMonths = period?.months || 12;

  const periodStart = formatDate(period?.from);
  const periodEnd = formatDate(period?.to);

  const isLoading = transactionGraphLoading && !transactionGraph;

  const hasData = totalTransactions > 0 || totalAmount > 0;

  return (
    <div className="w-full h-full flex flex-col font-poppins min-h-0">
      {/* Header */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            {t('reports.transactionGraph.title')}{' '}
            <span className="text-gray-400 font-medium">
              {t('reports.transactionGraph.reportLabel')}
            </span>
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {t('reports.transactionGraph.subtitle', {
              count: formatNumber(totalTransactions),
            })}
          </p>

          <p className="text-[11px] text-gray-400 mt-1">
            Last {periodMonths} months
            {period?.from && period?.to && (
              <>
                {' · '}
                {periodStart} – {periodEnd}
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          className="group flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-black transition-colors"
        >
          {t('common.details')}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Card — flex-1 + min-h-0 to stretch and match the sibling */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />

            <span className="text-sm">
              {t('reports.transactionGraph.loading')}
            </span>
          </div>
        ) : !hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Activity className="w-8 h-8 text-gray-300" />

            <span className="text-sm font-medium">
              {t('reports.transactionGraph.noData')}
            </span>

            <span className="text-xs">
              {t('reports.transactionGraph.noDataDesc')}
            </span>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="shrink-0 mb-4">
              {/* Transaction Count */}
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  Total Transactions
                </p>

                <p className="text-2xl font-bold text-[#941C93] tabular-nums">
                  {formatNumber(totalTransactions)}
                </p>
              </div>

              {/* Transaction Value */}
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-1">
                  Transaction Value
                </p>

                <p className="text-xl font-bold text-gray-800 tabular-nums">
                  {formatAmount(totalAmount)}{' '}
                  <span className="text-sm font-medium text-gray-500">
                    XOF
                  </span>
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  Amount basis: As reported by transaction API. Gross/net and
                  refund treatment not specified.
                </p>
              </div>

              {/* Top Payment Method */}
              {topMethod && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">
                    {t('reports.transactionGraph.topMethod')}{' '}
                    <span className="text-green-600 font-semibold">
                      {topMethod._id}
                    </span>
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {formatNumber(topMethod.count)} transactions
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Value share: {roundedShare}%
                  </p>
                </div>
              )}
            </div>

            {/* Donut Chart — flex-1 + min-h-0 so it centers in leftover space */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0">
              <div className="relative w-[200px] h-[200px] shrink-0">
                {totalAmount > 0 && topMethod ? (
                  <>
                    <PieChart width={200} height={200}>
                      <defs>
                        <linearGradient
                          id="transactionGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
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
                            key={`transaction-cell-${index}`}
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
                        formatter={(value, name) => [
                          `${Number(value).toFixed(1)}%`,
                          name,
                        ]}
                      />
                    </PieChart>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-red-100 flex items-center justify-center mb-1">
                        <Activity className="w-5 h-5 text-purple-500" />
                      </div>

                      <span className="text-2xl font-bold text-[#2E2E30] tabular-nums">
                        {roundedShare}%
                      </span>

                      <span className="text-[10px] text-gray-500 mt-0.5">
                        {topMethod._id}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 rounded-full border border-dashed border-gray-200">
                    <span className="text-sm font-medium">
                      {t('reports.transactionGraph.noData')}
                    </span>

                    <span className="text-xs">
                      {t('reports.transactionGraph.noDataDesc')}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-gray-400 mt-3 text-center">
                Top payment method share by transaction value
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionGraph;