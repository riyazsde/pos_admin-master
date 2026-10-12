import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

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

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setReportsLoading,
  setReportsData,
  setReportsError,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

/* ------------------------------------------------------------------ */
/*  ICONS                                                              */
/* ------------------------------------------------------------------ */
const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const CartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const CubeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.999L13.732 4.001c-.77-1.332-2.694-1.332-3.464 0L3.34 16.001C2.57 17.333 3.532 19 5.072 19z" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  SHARED TOGGLE COMPONENT                                            */
/* ------------------------------------------------------------------ */
const ViewToggle = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        type="button"
        onClick={() => setActiveTab('reports')}
        className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
          activeTab === 'reports'
            ? 'bg-purple-600 text-white shadow'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {t('reports.tabs.reports')}
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('analytics')}
        className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
          activeTab === 'analytics'
            ? 'bg-purple-600 text-white shadow'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {t('reports.tabs.analytics')}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ANALYTICS VIEW                                                     */
/* ------------------------------------------------------------------ */
const AnalyticsView = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const revenueData = [
    { 
      location: t('reports.analyticsView.revenueData.downtownBistro'), 
      revenue: '$89,450', 
      orders: '1,245', 
      avgOrder: '$71.85', 
      growth: '+15.2%', 
      isPositive: true 
    },
    { 
      location: t('reports.analyticsView.revenueData.oceanViewCafe'), 
      revenue: '$78,230', 
      orders: '1,089', 
      avgOrder: '$71.83', 
      growth: '+8.5%', 
      isPositive: true 
    },
    { 
      location: t('reports.analyticsView.revenueData.mountainLodge'), 
      revenue: '$62,340', 
      orders: '856', 
      avgOrder: '$72.80', 
      growth: '+22.1%', 
      isPositive: true 
    },
    { 
      location: t('reports.analyticsView.revenueData.citySquareDiner'), 
      revenue: '$58,920', 
      orders: '978', 
      avgOrder: '$60.25', 
      growth: '+6.3%', 
      isPositive: true 
    },
    { 
      location: t('reports.analyticsView.revenueData.harborGrill'), 
      revenue: '$32,450', 
      orders: '534', 
      avgOrder: '$60.77', 
      growth: '-3.2%', 
      isPositive: false 
    },
    { 
      location: t('reports.analyticsView.revenueData.sunsetRestaurant'), 
      revenue: '$21,500', 
      orders: '412', 
      avgOrder: '$52.18', 
      growth: '+18.7%', 
      isPositive: true 
    },
  ];

  const quickActions = [
    { icon: <DollarIcon />, label: t('reports.quickActions.revenueReports'), color: 'text-emerald-600 bg-emerald-50' },
    { icon: <UsersIcon />, label: t('reports.quickActions.subscriptionReports'), color: 'text-blue-600 bg-blue-50' },
    { icon: <CartIcon />, label: t('reports.quickActions.marketplaceSales'), color: 'text-purple-600 bg-purple-50' },
    { icon: <CubeIcon />, label: t('reports.quickActions.inventoryReports'), color: 'text-orange-600 bg-orange-50' },
    { icon: <AlertIcon />, label: t('reports.quickActions.lowStockAlerts'), color: 'text-red-600 bg-red-50' },
    { icon: <LocationIcon />, label: t('reports.quickActions.locationComparison'), color: 'text-cyan-600 bg-cyan-50' },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 w-full bg-gray-50">
      {/* Top Bar — Title changes based on tab */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('reports.titleAnalytics')}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <DownloadIcon /> {t('common.exportCSV')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
            <DownloadIcon /> {t('common.exportPDF')}
          </button>
          <ViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {quickActions.map((item, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all text-center gap-2"
          >
            <div className={`p-2 rounded-full ${item.color}`}>{item.icon}</div>
            <span className="text-xs font-medium text-gray-700">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1"
        >
          <FilterIcon />
          {t('common.filters')}
          <ChevronDownIcon className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        {isFilterOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('reports.filters.dateRange')}</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>{t('common.selectOne')}</option>
                  <option>{t('reports.filters.last7Days')}</option>
                  <option>{t('reports.filters.last30Days')}</option>
                  <option>{t('reports.filters.last90Days')}</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none"><ChevronDownIcon /></div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('reports.filters.location')}</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>{t('common.selectOne')}</option>
                  <option>{t('reports.analyticsView.revenueData.downtownBistro')}</option>
                  <option>{t('reports.analyticsView.revenueData.oceanViewCafe')}</option>
                  <option>{t('reports.analyticsView.revenueData.mountainLodge')}</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none"><ChevronDownIcon /></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('common.search')}</label>
              <div className="relative">
                <div className="absolute left-3 top-2.5"><SearchIcon /></div>
                <input
                  type="text"
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-emerald-500 rounded-xl p-5 text-white shadow-md">
          <p className="text-sm font-medium opacity-90">{t('reports.kpi.totalRevenue')}</p>
          <p className="text-3xl font-bold mt-1">$342,890</p>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +12.5% {t('common.vsLastPeriod')}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{t('reports.kpi.totalOrders')}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">5114</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{t('reports.kpi.averageOrderValue')}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">$67.42</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{t('reports.kpi.activeLocations')}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">6</p>
        </div>
      </div>

      {/* Revenue by Location Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{t('reports.analytics.revenueByLocation')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">{t('reports.analytics.location')}</th>
                <th className="px-6 py-3">{t('reports.analytics.revenue')}</th>
                <th className="px-6 py-3">{t('reports.analytics.orders')}</th>
                <th className="px-6 py-3">{t('reports.analytics.avgOrder')}</th>
                <th className="px-6 py-3">{t('reports.analytics.growth')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {revenueData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      {row.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{row.revenue}</td>
                  <td className="px-6 py-4 text-gray-600">{row.orders}</td>
                  <td className="px-6 py-4 text-gray-600">{row.avgOrder}</td>
                  <td className={`px-6 py-4 font-semibold ${row.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {row.isPositive ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        )}
                      </svg>
                      {row.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  REPORTS VIEW (default)                                             */
/* ------------------------------------------------------------------ */
const ReportsView = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { kpiMetrics, loading, hasLoaded } = useAppSelector(
    (state) => state.reports
  );

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (hasLoaded || fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchReports = async () => {
      dispatch(setReportsLoading(true));
      try {
        const data = await reportService.getKpiDashboard();
        dispatch(setReportsData(data));
      } catch (err) {
        console.error('Reports fetch error:', err);
        dispatch(setReportsError(err?.message || 'Failed to load reports'));
        toast.error(t('common.error'), {
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Please try again later.',
        });
      }
    };

    fetchReports();
  }, [dispatch, hasLoaded, t]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('en-US');
  };

  const metrics = [
    {
      title: t('reports.metrics.totalActiveClients'),
      value: formatNumber(kpiMetrics?.totalActiveClients),
      imageSrc: money,
      bgColor: 'bg-orange-100',
    },
    {
      title: t('reports.metrics.totalInactiveClients'),
      value: formatNumber(kpiMetrics?.totalInactiveClients),
      imageSrc: bill,
      bgColor: 'bg-pink-100',
      valueColor: 'text-red-500',
    },
    {
      title: t('reports.metrics.totalRenewalRate'),
      value: `${kpiMetrics?.totalRenewalRate ?? 0}%`,
      imageSrc: global,
      bgColor: 'bg-green-100',
      trend: 'up',
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 w-full">
      {/* Topbar — Title changes based on tab */}
      <div className="flex justify-between items-center flex-wrap mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('reports.title')}
        </h1>
        <ViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Metrics Cards */}
      {loading && !hasLoaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 shadow-md flex items-center animate-pulse"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 w-full flex items-center"
            >
              <div className="flex items-center gap-6">
                <div
                  className={`w-14 h-14 rounded-full ${metric.bgColor} flex items-center justify-center shrink-0`}
                >
                  <img
                    src={metric.imageSrc}
                    alt="metric icon"
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-gray-600 font-medium text-base sm:text-lg">
                    {metric.title}
                  </h3>
                  <p
                    className={`font-bold text-xl sm:text-2xl ${
                      metric.valueColor ||
                      (metric.trend === 'up' ? 'text-green-600' : 'text-gray-900')
                    }`}
                  >
                    {metric.trend === 'up' && (
                      <span className="mr-2">↑</span>
                    )}
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch lg:h-[520px]">
        <div className="h-full min-h-0">
          <ActiveClients />
        </div>
        <div className="h-full min-h-0">
          <ActiveClientsDonutChart />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 mt-5 lg:grid-cols-2 gap-6 mb-8 items-stretch lg:h-[480px]">
        <div className="h-full min-h-0">
          <InactiveClientsChart />
        </div>
        <div className="h-full min-h-0">
          <InactiveClientsTable />
        </div>
      </div>

      {/* Remaining rows */}
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

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */
const Report = () => {
  const [activeTab, setActiveTab] = useState('reports');

  return activeTab === 'analytics' ? (
    <AnalyticsView activeTab={activeTab} setActiveTab={setActiveTab} />
  ) : (
    <ReportsView activeTab={activeTab} setActiveTab={setActiveTab} />
  );
};

export default withAdminLayout(Report);