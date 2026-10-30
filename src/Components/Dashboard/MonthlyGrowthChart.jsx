// src/Components/Dashboard/MonthlyGrowthChart.jsx

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Dot,
  Tooltip,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import {
  SERIES,
  seriesGradient,
  seriesDash,
  gradientStops,
  legendSwatchStyle,
} from '../../theme/chartSeries';

const CustomDot = (props) => {
  const { cx, cy, stroke } = props;
  return (
    <Dot cx={cx} cy={cy} r={5} fill="#FFFFFF" stroke={stroke} strokeWidth={2.5} />
  );
};

export default function MonthlyGrowthChart({ data }) {
  const { t, i18n } = useTranslation();

  const formatNumber = (n) => {
    if (n === null || n === undefined) return '0';
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return Number(n).toLocaleString(locale);
  };

  const chartData =
    data?.data?.map((item) => ({
      month: item.month,
      newClients: item.newClients,
      renewals: item.existingClientsRenewal,
    })) || [];

  const maxValue = Math.max(
    100,
    ...chartData.flatMap((d) => [d.newClients, d.renewals])
  );
  const yMax = Math.ceil(maxValue / 100) * 100;
  const yTicks = [0, Math.round(yMax / 4), Math.round(yMax / 2), yMax];

  const firstVal = chartData[0]?.newClients ?? 0;
  const lastVal = chartData[chartData.length - 1]?.newClients ?? 0;
  const percent =
    firstVal > 0 ? (((lastVal - firstVal) / firstVal) * 100).toFixed(1) : '0.0';
  const period1 = chartData[0]?.month ?? '';
  const period2 = chartData[chartData.length - 1]?.month ?? '';
  const hasPeriods = period1 && period2 && chartData.length > 1;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-2 rounded shadow-md text-xs ">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx}>
              {entry.dataKey === 'newClients'
                ? t(SERIES.newClients.labelKey)
                : t(SERIES.clientRenewals.labelKey)}
              : {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renewStroke = gradientStops('clientRenewals')[0];

  return (
    <div className="dashboard-typography w-full">
      <div
        className="bg-white rounded-3xl h-full p-6"
        style={{
          boxShadow:
            '0px 4px 20px rgba(0, 0, 0, 0.05), inset 0px 0px 1px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-xl font-bold text-black ">
            {t('dashboard.monthlyGrowth')}
          </h2>

          {/* Legend — now matches CurrentMonthActivity exactly:
              New Clients = solid, Client Renewals = faded + dashed */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="w-4 h-4 rounded-full"
                style={legendSwatchStyle('newClients')}
              />
              <span className="text-xs font-medium text-black ">
                {t(SERIES.newClients.labelKey)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="w-4 h-4 rounded-full border-b-2"
                style={{
                  ...legendSwatchStyle('clientRenewals'),
                  borderBottomStyle: 'dashed',
                  borderBottomColor: renewStroke,
                }}
              />
              <span className="text-xs font-medium text-black ">
                {t(SERIES.clientRenewals.labelKey)}
              </span>
            </div>
          </div>
        </div>

        {hasPeriods && (
          <p className="text-xs text-gray-500  mb-4 -mt-4">
            {t('dashboard.growthSubtitle', {
              percent: Math.abs(Number(percent)),
              period1,
              period2,
            })}
          </p>
        )}

        {chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-gray-400  text-sm">
            {t('dashboard.noGrowthData')}
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={SERIES.newClients.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={gradientStops('newClients')[0]} />
                    <stop offset="100%" stopColor={gradientStops('newClients')[1]} />
                  </linearGradient>
                  <linearGradient id={SERIES.clientRenewals.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={gradientStops('clientRenewals')[0]} />
                    <stop offset="100%" stopColor={gradientStops('clientRenewals')[1]} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#F0F0F2" strokeWidth={1} vertical={false} horizontal={true} />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontFamily: 'inherit', fontWeight: 500, fill: '#1a1a1a' }}
                  dy={8}
                />

                <YAxis
                  domain={[0, yMax]}
                  ticks={yTicks}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontFamily: 'inherit', fontWeight: 500, fill: '#1a1a1a' }}
                  width={45}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />

                {/* New Clients — solid stroke, solid dots */}
                <Line
                  type="monotone"
                  dataKey="newClients"
                  name={t(SERIES.newClients.labelKey)}
                  stroke={seriesGradient('newClients')}
                  strokeWidth={3}
                  strokeDasharray={seriesDash('newClients')}
                  dot={<CustomDot />}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />

                {/* Client Renewals — faded stroke + dashed (non-color identifier) */}
                <Line
                  type="monotone"
                  dataKey="renewals"
                  name={t(SERIES.clientRenewals.labelKey)}
                  stroke={seriesGradient('clientRenewals')}
                  strokeWidth={3}
                  strokeDasharray={seriesDash('clientRenewals')}
                  dot={<CustomDot />}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
