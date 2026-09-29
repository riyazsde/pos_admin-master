import React, { useState } from 'react';
import { 
  ChevronDown, 
  Wallet, 
  TrendingUp, 
  Users, 
  Utensils, 
  UserCheck, 
  AlertCircle, 
  WifiOff 
} from 'lucide-react';
import withAdminLayout from '../AdminPanel/withAdminLayout';
import CurrentMonthActivity from '../../Components/Dashboard/CurrentMonthActivity';
import MonthlyGrowthChart from '../../Components/Dashboard/MonthlyGrowthChart';
import ProfitAfterTax from '../../Components/Dashboard/ProfitAfterTax';
import TopPerformers from '../../Components/Dashboard/TopPerformers';
import SubscriptionsPurchased from '../../Components/Dashboard/SubscriptionsPurchased';
import HeatMapCities from '../../Components/Dashboard/HeatMapCities';
import SupportTickets from '../../Components/Dashboard/SupportTickets';
import SubscriptionRenewalAlert from '../../Components/Dashboard/SubscriptionRenewalAlert';
import ActiveAlerts from '../../Components/Dashboard/ActiveAlerts';
import UpcommingRenewals from '../../Components/Dashboard/UpcommingRenewals';
import Action from '../../Components/Dashboard/Action';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Updated metrics to match Figma exactly
  const metrics = [
    {
      title: 'MRR',
      value: '19008 XOF',
      icon: Wallet,
      bgColor: 'bg-yellow-100', // Figma uses a yellow wallet
      iconColor: 'text-yellow-600',
      badge: '↑ 12.4%',
      badgeColor: 'text-green-500'
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '900 xof',
      icon: TrendingUp, // Figma uses a bar chart icon
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Total POS Clients',
      value: '344',
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Active Restaurants',
      value: '248',
      icon: Utensils, // Figma uses a fork/knife icon
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-500',
      badge: '↓ 14 this month',
      badgeColor: 'text-gray-500'
    },
    {
      title: 'Active Subscriptions',
      value: '1,203',
      icon: UserCheck, // Figma uses a user check icon
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Critical Tickets',
      value: '3',
      icon: AlertCircle, // Figma uses a bell/alert icon
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500',
      badge: 'Avg response: 12m',
      badgeColor: 'text-green-600'
    },
    {
      title: 'Offline Devices',
      value: '12',
      icon: WifiOff, // Figma uses a cloud-off/device icon
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-500',
      badge: '↓ 4 today',
      badgeColor: 'text-orange-400'
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-3 w-full ">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Dropdown */}
        <div className="relative z-20">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 w-[129px] h-[35px] px-4 py-2 bg-white border border-black rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700 text-sm font-medium">{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[246px] bg-white shadow rounded-lg flex flex-col px-3 py-5 gap-2 border">
              {[
                'Today', 'Yesterday', 'This Week', 'Three Month', 'Six Month', 'This Month'
              ].map(period => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                  className={`
                    w-full text-left px-2 py-2 rounded 
                    text-sm font-medium font-[Manrope] 
                    ${selectedPeriod === period 
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white' 
                      : 'hover:bg-gray-100 text-black'}
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Cards - Updated Grid & Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 w-full flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center flex-shrink-0`}>
                <IconComponent className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-600 font-medium text-xs md:text-sm">{metric.title}</h3>
                  {metric.badge && (
                    <span className={`text-[10px] font-semibold ${metric.badgeColor}`}>
                      {metric.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-900 font-bold text-lg md:text-xl">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 1 */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-stretch">
  <div className="w-full lg:w-3/5 flex">
    <CurrentMonthActivity />
  </div>
  <div className="w-full lg:w-2/5 flex">
    <MonthlyGrowthChart />
  </div>
</div>

      {/* Section 2 */}
    <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: .3rem;
        }
        @media (min-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1.4fr; /* Profit : TopPerformers = 1 : 1.4 */
            align-items: stretch;
            height: 420px;
          }
        }
      `}</style>

      <div className="dashboard-grid">
        <ProfitAfterTax />
        <TopPerformers />
      </div>

      {/* Section 3 */}
     <div className="flex flex-col mt-4 lg:flex-row gap-6 mb-6 items-stretch">
      <div className="w-full lg:w-3/5">
        <SubscriptionsPurchased />
      </div>
      <div className="w-full lg:w-2/5">
        <HeatMapCities />
      </div>
    </div>

      {/* Section 4 */}
     <div className="flex flex-col lg:flex-row gap-4 mb-6 items-stretch">
    <div className="w-full lg:w-2/5">
        <SupportTickets />
    </div>
    <div className="w-full lg:w-3/5">
        <SubscriptionRenewalAlert />
    </div>
</div>
{/* section 05 */}
 <div className="flex flex-col lg:flex-row gap-6 mb-3 items-stretch p-4">
      
      <div className="w-full lg:w-[68%]">
        <UpcommingRenewals />
      </div>

      <div className="w-full lg:w-[32%]">
        <ActiveAlerts />
      </div>
      
    </div>
{/* section 06*/}
<div>
  <Action/>
</div>
    </div>
  );
};

export default withAdminLayout(Dashboard);