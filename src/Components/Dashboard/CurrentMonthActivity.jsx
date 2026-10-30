// src/Components/Dashboard/CurrentMonthActivity.jsx

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import {
  SERIES,
  seriesGradient,
  seriesDash,
  gradientStops,
  legendSwatchStyle,
} from '../../theme/chartSeries';

const CurrentMonthActivity = ({ data }) => {
  const { t, i18n } = useTranslation();

  const formatNumber = (n) => {
    if (n === null || n === undefined) return '0';
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return Number(n).toLocaleString(locale);
  };

  const chartData =
    data?.data?.map((item) => ({
      name: item.day,
      newClients: item.newClients,
      renewals: item.existingClientsRenewal,
    })) || [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-2 rounded shadow-md text-xs font-[Poppins]">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p>
            {t(SERIES.newClients.labelKey)}:{' '}
            {formatNumber(payload[0].payload.newClients)}
          </p>
          <p>
            {t(SERIES.clientRenewals.labelKey)}:{' '}
            {formatNumber(payload[0].payload.renewals)}
          </p>
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(
    100,
    ...chartData.map((d) => Math.max(d.newClients, d.renewals))
  );
  const yTicks = [0, Math.round(maxValue / 4), Math.round(maxValue / 2), maxValue];

  const [renewFrom] = gradientStops('clientRenewals');
  const [newFrom] = gradientStops('newClients');

  return (
    <div className="w-full">
      <div
        className="bg-white rounded-3xl p-6 h-full shadow-sm border border-gray-100"
        style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}
      >
        {/* Header — i18n only */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-black font-[Poppins]">
            {t('dashboard.dailyActivity')}
          </h2>

          {/* Legend — driven by shared tokens */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="w-4 h-4 rounded-full"
                style={legendSwatchStyle('newClients')}
              />
              <span className="text-xs font-medium text-black font-[Poppins]">
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
                  borderBottomColor: renewFrom,
                }}
              />
              <span className="text-xs font-medium text-black font-[Poppins]">
                {t(SERIES.clientRenewals.labelKey)}
              </span>
            </div>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400 font-[Poppins] text-sm">
            {t('dashboard.noActivityData')}
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barCategoryGap={20}
                margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
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

                <CartesianGrid stroke="#F3F3F5" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#000"
                  tick={{ fontSize: 12, fontFamily: 'Poppins', fill: '#000' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#000"
                  tick={{ fontSize: 12, fontFamily: 'Poppins', fill: '#000' }}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  ticks={yTicks}
                  label={{
                    value: t('dashboard.orders'),
                    angle: -90,
                    position: 'insideLeft',
                    style: {
                      fontSize: 10,
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fill: '#6B7280',
                      textAnchor: 'middle',
                    },
                  }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

                <Bar
                  dataKey="newClients"
                  name={t(SERIES.newClients.labelKey)}
                  fill={seriesGradient('newClients')}
                  radius={[10, 10, 0, 0]}
                  barSize={15}
                />
                <Bar
                  dataKey="renewals"
                  name={t(SERIES.clientRenewals.labelKey)}
                  fill={seriesGradient('clientRenewals')}
                  radius={[10, 10, 0, 0]}
                  barSize={15}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentMonthActivity;