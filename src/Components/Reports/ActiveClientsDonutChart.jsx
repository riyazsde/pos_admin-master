import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ActiveClientsReport = () => {
  const data = {
    labels: ['New Clients', 'Renewed Clients'],
    datasets: [
      {
        data: [45, 55],
        backgroundColor: [
          '#34C759', // Solid green for New Clients (bigger segment)
          'rgba(52, 199, 89, 0.2)', // More transparent green for Renewed Clients
        ],
        borderColor: ['#34C759', '#34C759'],
        borderWidth: [3, 1], // New Clients thicker border, Renewed Clients thinner
        cutout: '70%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000', // Changed from '#fff' to '#000' for visibility
        bodyColor: '#000',
        borderColor: '#e5e5e5',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: '900',
          size: 14,
        },
        formatter: (value) => {
          return `${value}%`;
        },
        anchor: 'center',
        align: 'center',
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl font-sans">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Active Clients (Report)
      </h2>
      <div className='shadow-md p-6 rounded-3xl'>
      {/* Stats and Filter Row */}
      <div className="flex justify-between items-start mb-8">
        {/* Active Stats */}
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-green-500 mb-1">
            100 Active
          </div>
          <div className="flex items-center text-green-500 text-sm">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            12% Less than last month
          </div>
        </div>
                
        {/* Time Filter */}
        <div className="flex bg-gradient-to-b from-purple-100 to-red-100 rounded-l-2xl px-4 py-1 space-x-3">
          <span className="text-xs font-semibold text-gray-900">1W</span>
          <span className="text-xs font-semibold text-gray-400">1M</span>
          <span className="text-xs font-semibold text-gray-400">6M</span>
          <span className="text-xs font-semibold text-gray-400">1Y</span>
        </div>
      </div>
             
      {/* Chart Section */}
      <div className="flex flex-col items-center">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 mb-6">
          <Doughnut data={data} options={options} />
        </div>
                
        {/* Legend */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <div className="w-10 h-5 bg-green-500 rounded-sm mr-4"></div>
            <span className="text-gray-900 font-medium">New Clients</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-5 bg-green-200 rounded-sm mr-4"></div>
            <span className="text-gray-900 font-medium">Renewed Clients</span>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default ActiveClientsReport;