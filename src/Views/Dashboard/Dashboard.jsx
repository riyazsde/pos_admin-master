// src/Views/Dashboard/Dashboard.jsx

import React, { useState, useEffect, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';

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
  setCompleteDashboardLoading,
  setCompleteDashboardData,
  setCompleteDashboardError,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();  // ✅ translation hook

  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Read dashboard data from Redux
  const {
    kpis,
    dailyActivity,
    monthlyGrowth,
    lastUpdated,
    loading,
    hasLoaded,
    completeDashboardLoaded,
  } = useAppSelector((state) => state.dashboard);

  const fetchedMain = useRef(false);
  const fetchedComplete = useRef(false);

  // ✅ Fetch main dashboard
  useEffect(() => {
    if (hasLoaded || fetchedMain.current) return;
    fetchedMain.current = true;

    const fetchDashboard = async () => {
      dispatch(setDashboardLoading(true));
      try {
        const data = await dashboardService.getMainDashboard();
        dispatch(setDashboardData(data));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        dispatch(setDashboardError(err?.message || 'Failed to load dashboard'));
        toast.error(t('dashboard.loadFailed') || 'Failed to load dashboard', {
          description:
            err?.response?.data?.message ||
            err?.message ||
            t('common.error') ||
            'Please try again later.',
        });
      }
    };

    fetchDashboard();
  }, [dispatch, hasLoaded, t]);

  // ✅ Fetch complete dashboard
  useEffect(() => {
    if (completeDashboardLoaded || fetchedComplete.current) return;
    fetchedComplete.current = true;

    const fetchComplete = async () => {
      dispatch(setCompleteDashboardLoading(true));
      try {
        const data = await dashboardService.getCompleteDashboard();
        dispatch(setCompleteDashboardData(data));
      } catch (err) {
        console.error('Complete dashboard fetch error:', err);
        dispatch(
          setCompleteDashboardError(
            err?.message || 'Failed to load dashboard widgets'
          )
        );
      }
    };

    fetchComplete();
  }, [dispatch, completeDashboardLoaded]);

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    // ✅ Locale-aware number formatting based on current language
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return Number(num).toLocaleString(locale);
  };

  const formatLastUpdated = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
      return d.toLocaleString(locale, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // ---------------------------------------------------------------------
  // Period options (translated)
  // ---------------------------------------------------------------------
  const periodOptions = [
    { value: 'Today', key: 'period.today' },
    { value: 'Yesterday', key: 'period.yesterday' },
    { value: 'This Week', key: 'period.thisWeek' },
    { value: 'Three Month', key: 'period.threeMonth' },
    { value: 'Six Month', key: 'period.sixMonth' },
    { value: 'This Month', key: 'period.thisMonth' },
  ];

  // ---------------------------------------------------------------------
  // KPI metrics (translated)
  // ---------------------------------------------------------------------
  const metrics = [
    {
      title: t('dashboard.mrr'),
      value: `${formatNumber(kpis?.monthlySecurity)} XOF`,
      icon: Wallet,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      badge: kpis?.totalRevenue
        ? `${t('common.total')}: ${formatNumber(kpis.totalRevenue)} XOF`
        : null,
      badgeColor: 'text-green-500',
    },
    {
      title: t('dashboard.monthlyRecurringRevenue'),
      value: `${formatNumber(kpis?.monthlySecurity)} XOF`,
      icon: TrendingUp,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
    {
      title: t('dashboard.totalPosClients'),
      value: formatNumber(kpis?.totalPOSClients),
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: t('dashboard.activeRestaurants'),
      value: '—',
      icon: Utensils,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-500',
    },
    {
      title: t('dashboard.activeSubscriptions'),
      value: '—',
      icon: UserCheck,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-500',
    },
    {
      title: t('dashboard.criticalTickets'),
      value: '—',
      icon: AlertCircle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500',
    },
    {
      title: t('dashboard.offlineDevices'),
      value: '—',
      icon: WifiOff,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-500',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-3 w-full">
      {/* ------------------------------ Topbar ------------------------------ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t('dashboard.title')}
          </h1>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              {t('dashboard.lastUpdated')}: {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>

        {/* Period Dropdown */}
        <div className="relative z-20">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 w-[129px] h-[35px] px-4 py-2 bg-white border border-black rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700 text-sm font-medium">
              {t(periodOptions.find((p) => p.value === selectedPeriod)?.key) ||
                selectedPeriod}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[246px] bg-white shadow rounded-lg flex flex-col px-3 py-5 gap-2 border">
              {periodOptions.map((period) => (
                <button
                  key={period.value}
                  onClick={() => {
                    setSelectedPeriod(period.value);
                    setDropdownOpen(false);
                  }}
                  className={`
                    w-full text-left px-2 py-2 rounded 
                    text-sm font-medium font-[Manrope] 
                    ${
                      selectedPeriod === period.value
                        ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white'
                        : 'hover:bg-gray-100 text-black'
                    }
                  `}
                >
                  {t(period.key) || period.value}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------ KPI Cards ------------------------------ */}
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
                      <span
                        className={`text-[10px] font-semibold ${metric.badgeColor}`}
                      >
                        {metric.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-bold text-lg md:text-xl">
                    {metric.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --------------------------- Section 1: Charts --------------------------- */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-stretch">
        <div className="w-full lg:w-3/5 flex">
          <CurrentMonthActivity data={dailyActivity} />
        </div>
        <div className="w-full lg:w-2/5 flex">
          <MonthlyGrowthChart data={monthlyGrowth} />
        </div>
      </div>

      {/* --------------------------- Section 2: Profit + Top Performers --------------------------- */}
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

      {/* --------------------------- Section 3: Subscriptions + Heatmap --------------------------- */}
      <div className="flex flex-col mt-4 lg:flex-row gap-6 mb-6 items-stretch">
        <div className="w-full lg:w-3/5">
          <SubscriptionsPurchased />
        </div>
        <div className="w-full lg:w-2/5">
          <HeatMapCities />
        </div>
      </div>

      {/* --------------------------- Section 4: Support Tickets + Renewal Alerts --------------------------- */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-stretch">
        <div className="w-full lg:w-2/5">
          <SupportTickets />
        </div>
        <div className="w-full lg:w-3/5">
          <SubscriptionRenewalAlert />
        </div>
      </div>

      {/* --------------------------- Section 5: Upcoming Renewals + Active Alerts --------------------------- */}
      <div className="flex flex-col lg:flex-row gap-6 mb-3 items-stretch p-4">
        <div className="w-full lg:w-[68%]">
          <UpcommingRenewals />
        </div>
        <div className="w-full lg:w-[32%]">
          <ActiveAlerts />
        </div>
      </div>

      {/* --------------------------- Section 6: Action --------------------------- */}
      <div>
        <Action />
      </div>
    </div>
  );
};

export default withAdminLayout(Dashboard);