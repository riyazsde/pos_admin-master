import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChevronRight } from 'lucide-react';

import { useAppSelector } from '../../Store/hooks';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ActiveClientsReport = () => {
  const { kpiMetrics, charts } = useAppSelector((state) => state.reports);

  const totalActive = kpiMetrics?.totalActiveClients || 0;
  const totalInactive = kpiMetrics?.totalInactiveClients || 0;

  const newClients = charts?.activeClientsBreakdown?.newClients || 0;
  const renewedClients = charts?.activeClientsBreakdown?.renewedClients || 0;

  const total = newClients + renewedClients;
  const newPct = total > 0 ? Math.round((newClients / total) * 100) : 0;
  const renewedPct = total > 0 ? Math.round((renewedClients / total) * 100) : 0;

  const data = {
    labels: ['New Clients', 'Renewed Clients'],
    datasets: [
      {
        data: [newPct, renewedPct],
        backgroundColor: ['#34C759', 'rgba(52, 199, 89, 0.2)'],
        borderColor: ['#34C759', '#34C759'],
        borderWidth: [3, 1],
        cutout: '70%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#e5e5e5',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`,
        },
      },
      datalabels: {
        color: '#ffffff',
        font: { weight: '900', size: 14 },
        formatter: (value) => (value > 0 ? `${value}%` : ''),
        anchor: 'center',
        align: 'center',
      },
    },
    elements: {
      arc: { borderWidth: 0 },
    },
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">
      {/* Header */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Active Clients <span className="text-gray-400 font-medium">(Report)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Distribution of active clients
          </p>
        </div>
        <button className="group flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-black transition-colors">
          Details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 flex flex-col min-h-0">
        {/* Stats row */}
        <div className="flex justify-between items-start mb-4 shrink-0">
          <div className="flex flex-col">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {totalActive}{' '}
              <span className="text-base font-medium text-gray-500">
                Active
              </span>
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {totalInactive} Inactive
            </div>
          </div>

          <div className="flex bg-gradient-to-b from-purple-100 to-red-100 rounded-l-2xl px-4 py-1 space-x-3">
            <span className="text-xs font-semibold text-gray-900">1W</span>
            <span className="text-xs font-semibold text-gray-400">1M</span>
            <span className="text-xs font-semibold text-gray-400">6M</span>
            <span className="text-xs font-semibold text-gray-400">1Y</span>
          </div>
        </div>

        {/* Chart centered */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 min-h-0">
          <div className="relative w-48 h-48 shrink-0">
            {total > 0 ? (
              <Doughnut data={data} options={options} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm rounded-full border border-dashed border-gray-200">
                No data
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3 shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-5 bg-green-500 rounded-sm mr-4"></div>
              <span className="text-gray-900 font-medium">
                New Clients{' '}
                <span className="text-gray-500">({newPct}%)</span>
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-5 bg-green-200 rounded-sm mr-4"></div>
              <span className="text-gray-900 font-medium">
                Renewed Clients{' '}
                <span className="text-gray-500">({renewedPct}%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveClientsReport;