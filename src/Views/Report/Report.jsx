import React, { useState, useEffect, useRef } from 'react';
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

const Report = () => {
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
        toast.error('Failed to load reports', {
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Please try again later.',
        });
      }
    };

    fetchReports();
  }, [dispatch, hasLoaded]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('en-US');
  };

  const metrics = [
    {
      title: 'Total Active Clients',
      value: formatNumber(kpiMetrics?.totalActiveClients),
      imageSrc: money,
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Inactive Clients',
      value: formatNumber(kpiMetrics?.totalInactiveClients),
      imageSrc: bill,
      bgColor: 'bg-pink-100',
      valueColor: 'text-red-500',
    },
    {
      title: 'Total Renewal Rate',
      value: `${kpiMetrics?.totalRenewalRate ?? 0}%`,
      imageSrc: global,
      bgColor: 'bg-green-100',
      trend: 'up',
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 w-full">
      {/* Topbar */}
      <div className="flex justify-between items-center flex-wrap mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Reports
        </h1>
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

      {/* ============================================================ */}
      {/* Row 1: Active Clients (table) + Active Clients (donut chart) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch lg:h-[520px]">
        <div className="h-full min-h-0">
          <ActiveClients />
        </div>
        <div className="h-full min-h-0">
          <ActiveClientsDonutChart />
        </div>
      </div>

      {/* ============================================================ */}
      {/* Row 2: Inactive Clients (chart) + Inactive Clients (table)   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 mt-5 lg:grid-cols-2 gap-6 mb-8 items-stretch lg:h-[480px]">
        <div className="h-full min-h-0">
          <InactiveClientsChart />
        </div>
        <div className="h-full min-h-0">
          <InactiveClientsTable />
        </div>
      </div>

      {/* Remaining rows (unchanged) */}
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