import React, { useState } from 'react';
import RestaurantPerformanceChart from './RestaurantPerformanceChart';
import mooeny from '../../assets/Images/admin/client/money.png';
import bill from '../../assets/Images/admin/client/bill.png';
import global from '../../assets/Images/admin/client/global-user.png';

const Performance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('24H');

  const MetricCard = ({ imageSrc, title, value, bgColor }) => (
    <div className="bg-white rounded-3xl p-6 shadow-md flex items-center gap-4 w-full">
      <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center`}>
        <img src={imageSrc} alt={title} className="w-8 h-8 object-contain" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-600 font-medium text-sm sm:text-base">{title}</p>
        <p className="text-gray-900 font-bold text-xl sm:text-2xl">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-6 sm:py-10 font-[Poppins]">
      <div className="flex flex-col gap-10">

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            imageSrc={mooeny}
            title="Total Sales"
            value="1 9008 xof"
            bgColor="bg-yellow-200"
          />
          <MetricCard
            imageSrc={bill}
            title="Total Orders"
            value="900 xof"
            bgColor="bg-pink-200"
          />
          <MetricCard
            imageSrc={global}
            title="Total Active Clients"
            value="344"
            bgColor="bg-green-200"
          />
          <MetricCard
            imageSrc={mooeny}
            title="New Customers"
            value="1 9008"
            bgColor="bg-yellow-200"
          />
          <MetricCard
            imageSrc={bill}
            title="Repeat Customers"
            value="900"
            bgColor="bg-pink-200"
          />
          <MetricCard
            imageSrc={global}
            title="Avg Order Value"
            value="900 xof"
            bgColor="bg-green-200"
          />
        </div>

        {/* Chart Section */}
        <RestaurantPerformanceChart />
      </div>
    </div>
  );
};

export default Performance;
