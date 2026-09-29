import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const InactiveClientsChart = () => {
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
        data: [8, 0],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          return context.dataIndex === 0 ? createChartGradient(ctx) : 'rgba(0, 0, 0, 0)';
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

  return (
    <div className="flex flex-col items-start gap-4 w-full px-4 sm:px-0">
      <h2 className="font-poppins font-bold text-2xl text-black">Inactive Clients (Report)</h2>

      <div className="relative w-full max-w-[500px] h-[380px] bg-white rounded-[25px] shadow-[inset_0px_0px_1px_rgba(0,0,0,0.25),_0px_4px_4px_rgba(0,0,0,0.25)]">
        {/* Inactive count and percentage */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-2">
          <div className="text-[24px] sm:text-[30px] font-poppins font-bold text-red-500">05 Inactive</div>
          <div className="flex items-center gap-1 text-red-500 text-base sm:text-lg">
            <span>↑</span>
            <span className="text-base">
              12% <span className="text-[#00000099]">Inactive Clients in Last 1M</span>
            </span>
          </div>
        </div>

        {/* Time range selector */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center py-1 px-2 pr-4 gap-2 bg-gradient-to-b from-purple-700/[.1] to-red-600/[.1] rounded-l-2xl">
          {['1M', '3M', '6M', '1Y'].map((label, idx) => (
            <span
              key={label}
              className={`font-poppins font-semibold text-xs ${
                idx === 0 ? 'text-black' : 'text-black/50'
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Custom legend */}
        <div className="absolute bottom-4 left-4 sm:bottom-[36%] sm:left-6 flex gap-3 items-center">
          <div className="w-5 h-5 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F]" />
          <span className="font-poppins text-base text-black font-medium">January</span>
        </div>

        {/* Chart section */}
        <div className="absolute right-4 top-[100px] sm:top-[110px] sm:right-6 w-[160px] h-[160px] sm:w-[180px] sm:h-[180px]">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-poppins text-base font-medium text-black">8</div>
            <div className="font-poppins text-base font-medium text-black">Jan</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InactiveClientsChart;
