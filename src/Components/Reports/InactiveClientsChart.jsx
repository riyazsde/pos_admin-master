import React from 'react';
import { useTranslation } from 'react-i18next';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChevronRight } from 'lucide-react';

import { useAppSelector } from '../../Store/hooks';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const InactiveClientsChart = () => {
  const { t } = useTranslation();
  const totalInactive = useAppSelector(
    (state) => state.reports.kpiMetrics.totalInactiveClients
  );

  const createChartGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, '#6A1B9A');
    gradient.addColorStop(1, '#D32F2F');
    return gradient;
  };

  const chartData = {
    labels: [''],
    datasets: [
      {
        data: [totalInactive, Math.max(1 - totalInactive, 0)],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return context.dataIndex === 0
            ? createChartGradient(ctx)
            : 'rgba(0, 0, 0, 0)';
        },
        borderColor: ['transparent', 'transparent'],
        borderWidth: 0,
        hoverOffset: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '50%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: { display: false },
    },
    animation: false,
  };

  const periods = ['1M', '3M', '6M', '1Y'];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="font-poppins font-bold text-2xl text-black">
            {t('reports.inactiveClientsChart.title')}{' '}
            <span className="text-gray-400 font-medium">
              {t('reports.inactiveClientsChart.reportLabel')}
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {t('reports.inactiveClientsChart.subtitle')}
          </p>
        </div>
        <button className="group flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-black transition-colors">
          {t('reports.inactiveClientsChart.details')}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 relative bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] min-h-0 p-6 flex flex-col">
        {/* Top row: count + time filter */}
        <div className="flex justify-between items-start shrink-0 mb-4">
          <div className="flex flex-col gap-1">
            <div className="text-[26px] font-bold text-red-500 tabular-nums">
              {String(totalInactive).padStart(2, '0')}{' '}
              <span className="text-base font-medium text-gray-500">
                {t('reports.inactiveClientsChart.inactive')}
              </span>
            </div>
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <span>↑</span>
              <span>
                {t('reports.inactiveClientsChart.inactiveLastMonth', {
                  percent: 12,
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center py-1 px-3 gap-2 bg-gradient-to-b from-purple-700/[.08] to-red-600/[.08] rounded-full">
            {periods.map((label, idx) => (
              <span
                key={label}
                className={`font-semibold text-xs px-1 ${
                  idx === 0
                    ? 'text-gray-900'
                    : 'text-gray-400 cursor-pointer hover:text-gray-700'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Chart centered */}
        <div className="flex-1 flex items-center justify-center min-h-0 relative">
          <div className="relative w-[180px] h-[180px]">
            {totalInactive > 0 ? (
              <>
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="font-poppins text-lg font-bold text-gray-800 tabular-nums">
                    {totalInactive}
                  </div>
                  <div className="font-poppins text-xs font-medium text-gray-500">
                    {t('reports.inactiveClientsChart.months.jan')}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 rounded-full border border-dashed border-gray-200">
                <span className="text-sm font-medium">
                  {t('reports.inactiveClientsChart.noData')}
                </span>
                <span className="text-xs">
                  {t('reports.inactiveClientsChart.noDataDesc')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom legend */}
        <div className="shrink-0 flex gap-3 items-center justify-center mt-4">
          <div className="w-4 h-4 rounded bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F]" />
          <span className="font-poppins text-sm text-gray-700 font-medium">
            {t('reports.inactiveClientsChart.january')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InactiveClientsChart;