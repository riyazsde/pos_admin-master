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
            {t('dashboard.newClients')}:{' '}
            {formatNumber(payload[0].payload.newClients)}
          </p>
          <p>
            {t('dashboard.clientRenewals')}:{' '}
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
  const yTicks = [
    0,
    Math.round(maxValue / 4),
    Math.round(maxValue / 2),
    maxValue,
  ];

  return (
    <div className="w-full">
      <div
        className="bg-white rounded-3xl p-6 h-full shadow-sm border border-gray-100"
        style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}
      >
        {/* Header — ALWAYS uses i18n, never API title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-black font-[Poppins]">
            {t('dashboard.dailyActivity')}
          </h2>

          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
                }}
              ></div>
              <span className="text-xs font-medium text-black font-[Poppins]">
                {t('dashboard.newClients')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(106, 27, 154, 0.4) 0%, rgba(211, 47, 47, 0.4) 100%)',
                }}
              ></div>
              <span className="text-xs font-medium text-black font-[Poppins]">
                {t('dashboard.clientRenewals')}
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
                  <linearGradient id="newClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6A1B9A" />
                    <stop offset="100%" stopColor="#D32F2F" />
                  </linearGradient>
                  <linearGradient id="renewals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(106, 27, 154, 0.4)" />
                    <stop offset="100%" stopColor="rgba(211, 47, 47, 0.4)" />
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
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar
                  dataKey="newClients"
                  fill="url(#newClients)"
                  radius={[10, 10, 0, 0]}
                  barSize={15}
                />
                <Bar
                  dataKey="renewals"
                  fill="url(#renewals)"
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