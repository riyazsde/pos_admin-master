import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Wallet,
  TrendingUp,
  Users,
  Utensils,
  UserCheck,
  AlertCircle,
  WifiOff,
} from 'lucide-react';
import { toast } from 'sonner';

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

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setDashboardLoading,
  setDashboardData,
  setDashboardError,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Read dashboard data from Redux
  const {
    kpis,
    dailyActivity,
    monthlyGrowth,
    lastUpdated,
    loading,
    error,
    hasLoaded,
  } = useAppSelector((state) => state.dashboard);

  // ✅ Fetch dashboard on mount (only if not already loaded)
  useEffect(() => {
    const fetchDashboard = async () => {
      if (hasLoaded) return; // avoid re-fetch on every render

      dispatch(setDashboardLoading(true));
      try {
        const data = await dashboardService.getMainDashboard();
        dispatch(setDashboardData(data));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        dispatch(setDashboardError(err?.message || 'Failed to load dashboard'));
        toast.error('Failed to load dashboard', {
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Please try again later.',
        });
      }
    };

    fetchDashboard();
  }, [dispatch, hasLoaded]);

  // ✅ Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('en-US');
  };

  // ✅ Format the "lastUpdated" timestamp
  const formatLastUpdated = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // ✅ Metrics now use live data from Redux
  const metrics = [
    {
      title: 'MRR',
      value: `${formatNumber(kpis?.monthlySecurity)} XOF`, // Adjust field if MRR has its own
      icon: Wallet,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      badge: kpis?.totalRevenue ? `Total: ${formatNumber(kpis.totalRevenue)} XOF` : null,
      badgeColor: 'text-green-500',
    },
    {
      title: 'Monthly Recurring Revenue',
      value: `${formatNumber(kpis?.monthlySecurity)} XOF`,
      icon: TrendingUp,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Total POS Clients',
      value: formatNumber(kpis?.totalPOSClients),
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    // The following are placeholders until your API returns them
    {
      title: 'Active Restaurants',
      value: '—',
      icon: Utensils,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Active Subscriptions',
      value: '—',
      icon: UserCheck,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Critical Tickets',
      value: '—',
      icon: AlertCircle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Offline Devices',
      value: '—',
      icon: WifiOff,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-500',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-3 w-full">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>

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
              {['Today', 'Yesterday', 'This Week', 'Three Month', 'Six Month', 'This Month'].map(
                (period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-2 py-2 rounded 
                      text-sm font-medium font-[Manrope] 
                      ${
                        selectedPeriod === period
                          ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white'
                          : 'hover:bg-gray-100 text-black'
                      }
                    `}
                  >
                    {period}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && !hasLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 animate-pulse"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 w-full flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <IconComponent className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-600 font-medium text-xs md:text-sm">
                      {metric.title}
                    </h3>
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
      )}

      {/* Section 1 */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-stretch">
        <div className="w-full lg:w-3/5 flex">
          <CurrentMonthActivity data={dailyActivity} />
        </div>
        <div className="w-full lg:w-2/5 flex">
          <MonthlyGrowthChart data={monthlyGrowth} />
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
            grid-template-columns: 1fr 1.4fr;
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

      {/* Section 5 */}
      <div className="flex flex-col lg:flex-row gap-6 mb-3 items-stretch p-4">
        <div className="w-full lg:w-[68%]">
          <UpcommingRenewals />
        </div>
        <div className="w-full lg:w-[32%]">
          <ActiveAlerts />
        </div>
      </div>

      {/* Section 6 */}
      <div>
        <Action />
      </div>
    </div>
  );
};

export default withAdminLayout(Dashboard);