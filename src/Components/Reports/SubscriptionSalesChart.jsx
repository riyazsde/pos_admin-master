import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSubscriptionSalesData,
  setSubscriptionSalesLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Custom bar with grey background track
// ---------------------------------------------------------------------------
const CustomBar = (props) => {
  const { x, y, width, height, fill, backgroundHeight } = props;

  return (
    <g>
      <rect
        x={x}
        y={props.backgroundTop || 0}
        width={width}
        height={backgroundHeight}
        fill="#E9ECF1"
        rx="3"
        ry="3"
      />
      <rect x={x} y={y} width={width} height={height} fill={fill} rx="3" ry="3" />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Helper: format ISO date → "DD"
// ---------------------------------------------------------------------------
const getDay = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return String(d.getDate()).padStart(2, '0');
  } catch {
    return '';
  }
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const SubscriptionSalesChart = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { subscriptionSales, subscriptionSalesLoading } = useAppSelector(
    (state) => state.reports
  );

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchSales = async () => {
      dispatch(setSubscriptionSalesLoading(true));
      try {
        const now = new Date();
        const data = await reportService.getSubscriptionSales(
          now.getMonth() + 1,
          now.getFullYear()
        );
        dispatch(setSubscriptionSalesData(data));
      } catch (err) {
        console.error('Subscription sales fetch error:', err);
        dispatch(setSubscriptionSalesLoading(false));
      }
    };

    fetchSales();
  }, [dispatch]);

  const salesByDay = subscriptionSales?.chartData?.salesByDay || {};
  const data = Object.values(salesByDay).map((item) => ({
    name: getDay(item.date),
    sales: item.sales ?? 0,
    revenue: item.revenue ?? 0,
  }));

  const maxSales = data.length ? Math.max(...data.map((d) => d.sales), 1) : 100;
  const yAxisDomain = [0, maxSales + maxSales * 0.2];

  const totalSales = subscriptionSales?.summary?.totalSales ?? 0;
  const totalRevenue = subscriptionSales?.summary?.totalRevenue ?? 0;
  const period = subscriptionSales?.period;

  const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const periodLabel = period
    ? `${MONTHS[period.month - 1]} ${period.year}`
    : '';

  const formatNumber = (n) => {
    if (n === null || n === undefined) return '0';
    return Number(n).toLocaleString('en-US');
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2E2E30]">
            {t('reports.subscriptionSalesChart.title')}{' '}
            <span className="text-gray-400 font-medium">
              {t('reports.subscriptionSalesChart.reportLabel')}
            </span>
          </h2>
          {periodLabel && (
            <p className="text-xs text-gray-500 mt-1">{periodLabel}</p>
          )}
        </div>
      </div>

      {/* ---------- Card ---------- */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 flex flex-col min-h-0">
        {subscriptionSalesLoading && !subscriptionSales ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">
              {t('reports.subscriptionSalesChart.loading')}
            </span>
          </div>
        ) : (
          <>
            {/* ---------- Summary ---------- */}
            <div className="shrink-0 mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#344BFD] tabular-nums">
                  {formatNumber(totalRevenue)}
                </h1>
                <span className="text-sm text-gray-500 font-medium">XOF</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#34C759]" />
                <span className="text-[#34C759] text-sm font-medium">
                  {formatNumber(totalSales)}{' '}
                  <span className="text-gray-500">
                    {t('reports.subscriptionSalesChart.totalSales')}
                  </span>
                </span>
              </div>
            </div>

            {/* ---------- Chart ---------- */}
            <div className="flex-1 min-h-0 w-full">
              {data.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  {t('reports.subscriptionSalesChart.noData')}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    barCategoryGap="20%"
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: '#2E2E30',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                      interval={
                        data.length > 15
                          ? Math.floor(data.length / 10) - 1
                          : 0
                      }
                      padding={{ left: 5, right: 5 }}
                    />
                    <YAxis hide domain={yAxisDomain} />
                    <Tooltip
                      cursor={{ fill: 'rgba(52, 75, 253, 0.08)' }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '13px',
                        padding: '10px 12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                      labelStyle={{
                        color: '#1F2937',
                        fontWeight: 'bold',
                        marginBottom: 4,
                      }}
                      formatter={(value, name) => [
                        `${formatNumber(value)}`,
                        name === 'sales'
                          ? t('reports.subscriptionSalesChart.sales')
                          : t('reports.subscriptionSalesChart.revenue'),
                      ]}
                      labelFormatter={(label) =>
                        t('reports.subscriptionSalesChart.day', { day: label })
                      }
                    />
                    <Bar
                      dataKey="sales"
                      fill="#344BFD"
                      shape={
                        <CustomBar
                          backgroundTop={0}
                          backgroundHeight={220}
                        />
                      }
                      maxBarSize={data.length > 20 ? 14 : 28}
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSalesChart;