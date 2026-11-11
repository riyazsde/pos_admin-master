// src/Views/Dashboard/Dashboard.jsx

import React, { useEffect } from 'react';
import {
  ChevronDown,
  LoaderCircle,
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
  setDashboardDateFilter,
  setCompleteDashboardLoading,
  setCompleteDashboardData,
  setCompleteDashboardError,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();  // ✅ translation hook

  // ✅ Read dashboard data from Redux
  const {
    kpis,
    dailyActivity,
    monthlyGrowth,
    lastUpdated,
    loading,
    hasLoaded,
    dateFilter: selectedPeriod,
  } = useAppSelector((state) => state.dashboard);

  // ✅ Fetch main dashboard
  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboard = async () => {
      dispatch(setDashboardLoading(true));
      try {
        const data = await dashboardService.getMainDashboard(
          selectedPeriod,
          controller.signal
        );
        if (!controller.signal.aborted) dispatch(setDashboardData(data));
      } catch (err) {
        if (controller.signal.aborted) return;
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
    return () => {
      controller.abort();
      dispatch(setDashboardLoading(false));
    };
  }, [dispatch, selectedPeriod, t]);

  // ✅ Fetch complete dashboard
  useEffect(() => {
    let active = true;
    const fetchComplete = async () => {
      dispatch(setCompleteDashboardLoading(true));
      try {
        const data = await dashboardService.getCompleteDashboard(selectedPeriod);
        if (active) dispatch(setCompleteDashboardData(data));
      } catch (err) {
        console.error('Complete dashboard fetch error:', err);
        if (active) {
          dispatch(
            setCompleteDashboardError(
              err?.message || 'Failed to load dashboard widgets'
            )
          );
        }
      }
    };

    fetchComplete();
    return () => {
      active = false;
    };
  }, [dispatch, selectedPeriod]);

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
    { value: 'all', key: 'period.all' },
    { value: 'today', key: 'period.today' },
    { value: 'yesterday', key: 'period.yesterday' },
    { value: 'this_week', key: 'period.thisWeek' },
    { value: 'three_months', key: 'period.threeMonth' },
    { value: 'six_months', key: 'period.sixMonth' },
    { value: 'this_month', key: 'period.thisMonth' },
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
      value: formatNumber(kpis?.offlineDevices),
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
        <div className="relative z-20 w-full sm:w-auto">
          <label htmlFor="dashboard-date-filter" className="sr-only">
            {t('dashboard.dateFilter')}
          </label>
          <select
            id="dashboard-date-filter"
            value={selectedPeriod}
            onChange={(event) =>
              dispatch(setDashboardDateFilter(event.target.value))
            }
            aria-busy={loading}
            className="h-10 w-full sm:w-48 appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
          >
            {periodOptions.map((period) => (
              <option key={period.value} value={period.value}>
                {t(period.key) || period.value}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            {loading ? (
              <LoaderCircle
                className="h-4 w-4 animate-spin text-purple-700"
                aria-hidden="true"
              />
            ) : (
              <ChevronDown
                className="h-4 w-4 text-gray-500"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>

      {loading && hasLoaded && (
        <div
          className="flex items-center gap-2 mb-5 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-sm text-purple-800"
          role="status"
          aria-live="polite"
        >
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{t('dashboard.refreshing')}</span>
        </div>
      )}

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