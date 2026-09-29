import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import withAdminLayout from '../AdminPanel/withAdminLayout';
import ActiveClients from '../../Components/Reports/ActiveClients';
import ActiveClientsDonutChart from '../../Components/Reports/ActiveClientsDonutChart';
import InactiveClientsChart from '../../Components/Reports/InactiveClientsChart';
import InactiveClientsTable from '../../Components/Reports/InactiveClientsTable';
import SubscriptionSalesChart from '../../Components/Reports/SubscriptionSalesChart';
import SubscriptionTable from '../../Components/Reports/SubscriptionTable';
import LatestTransactionsTable from '../../Components/Reports/LatestTransactionsTable';
import TransactionGraph from '../../Components/Reports/TransactionGraph';
import TicketsReportCard from '../../Components/Reports/TicketsReportCard';
import SupportTickets from '../../Components/Reports/SupportTickets';
import CityWiseUsage from '../../Components/Reports/CityWiseUsage';

import money from '../../assets/Images/admin/client/money.png';
import bill from '../../assets/Images/admin/client/bill.png';
import global from '../../assets/Images/admin/client/global-user.png';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const metrics = [
    {
      title: 'Total Active Clients',
      value: '19008',
      imageSrc: money,
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Inactive Clients',
      value: '900',
      imageSrc: bill,
      bgColor: 'bg-pink-100',
      valueColor: 'text-red-500',
    },
    {
      title: 'Total Renewal Rate',
      value: '39%',
      imageSrc: global,
      bgColor: 'bg-green-100',
      trend: 'up',
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 w-full">
      {/* Topbar */}
      <div className="flex justify-between items-center flex-wrap mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-md transition-shadow duration-300 w-full h-auto flex items-center"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                <img src={metric.imageSrc} alt="metric icon" className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-gray-600 font-medium text-base sm:text-lg">{metric.title}</h3>
                <p
                  className={`font-bold text-xl sm:text-2xl ${metric.valueColor || (metric.trend === 'up' ? 'text-green-600' : 'text-gray-900')}`}
                >
                  {metric.trend === 'up' && <span className="mr-2">↑</span>}
                  {metric.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div><ActiveClients /></div>
        <div><ActiveClientsDonutChart /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div><InactiveClientsChart /></div>
        <div><InactiveClientsTable /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div><SubscriptionSalesChart /></div>
        <div><SubscriptionTable /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div><LatestTransactionsTable /></div>
        <div><TransactionGraph /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div><TicketsReportCard /></div>
        <div><SupportTickets /></div>
      </div>

      <div className="w-full">
        <CityWiseUsage />
      </div>
    </div>
  );
};

export default withAdminLayout(Report);
