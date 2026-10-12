import React, { useState, useEffect, useRef, useMemo } from 'react';
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
/*  FORMATTERS                                                         */
/* ------------------------------------------------------------------ */
const fmtCurrency = (n) =>
  `$${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const fmtNumber = (n) => Number(n || 0).toLocaleString('en-US');

/* ------------------------------------------------------------------ */
/*  SHARED TOGGLE                                                      */
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
/*  SHARED PRIMITIVES                                                  */
/* ------------------------------------------------------------------ */
const TableSkeleton = ({ cols = 4, rows = 5 }) => (
  <tbody className="divide-y divide-gray-100">
    {[...Array(rows)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        {[...Array(cols)].map((__, j) => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-24" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const EmptyRow = ({ colSpan }) => {
  const { t } = useTranslation();
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-gray-500">
        {t('common.noData')}
      </td>
    </tr>
  );
};

const KpiTile = ({ label, value, color = 'white', trend, footnote }) => {
  const isColored = color !== 'white';
  const bg = isColored ? color : 'bg-white';
  const text = isColored ? 'text-white' : 'text-gray-900';
  const labelColor = isColored ? 'text-white/90' : 'text-gray-500';
  return (
    <div className={`${bg} rounded-xl p-5 shadow-sm border border-gray-100`}>
      <p className={`text-sm font-medium ${labelColor}`}>{label}</p>
      <p className={`text-3xl font-bold mt-1 ${text}`}>{value}</p>
      {trend != null && (
        <div
          className={`flex items-center gap-1 mt-2 text-sm ${
            isColored ? 'text-white/90' : 'text-emerald-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                trend >= 0
                  ? 'M5 10l7-7m0 0l7 7m-7-7v18'
                  : 'M19 14l-7 7m0 0l-7-7m7 7V3'
              }
            />
          </svg>
          {trend >= 0 ? '+' : ''}
          {trend}%
        </div>
      )}
      {footnote && (
        <p
          className={`text-xs mt-2 ${
            isColored ? 'text-white/80' : 'text-gray-400'
          }`}
        >
          {footnote}
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  PANEL: REVENUE                                                     */
/* ------------------------------------------------------------------ */
const RevenuePanel = ({ filters }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await reportService.getRevenueReport(filters);
        if (cancelled) return;
        setRows(res.data || []);
        setSummary(res.summary || {});
      } catch (err) {
        if (cancelled) return;
        toast.error(t('common.error'), {
          description: err?.message || 'Please try again later.',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters, t]);

  const totalRevenue =
    summary.totalRevenue ?? rows.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
  const totalOrders =
    summary.totalOrders ?? rows.reduce((s, r) => s + (Number(r.orders) || 0), 0);
  const avgOrder = summary.averageOrderValue ?? 0;
  const growth = summary.revenueGrowth ?? 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiTile
          label={t('reports.kpi.totalRevenue')}
          value={loading ? '—' : fmtCurrency(totalRevenue)}
          color="bg-emerald-500"
          trend={growth}
          footnote={t('common.vsLastPeriod')}
        />
        <KpiTile
          label={t('reports.kpi.totalOrders')}
          value={loading ? '—' : fmtNumber(totalOrders)}
        />
        <KpiTile
          label={t('reports.kpi.averageOrderValue')}
          value={loading ? '—' : fmtCurrency(avgOrder)}
        />
        <KpiTile
          label={t('reports.kpi.activeLocations')}
          value={loading ? '—' : fmtNumber(rows.length)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {t('reports.analytics.revenueByLocation')}
          </h2>
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
            {loading ? (
              <TableSkeleton cols={5} />
            ) : rows.length === 0 ? (
              <EmptyRow colSpan={5} />
            ) : (
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, idx) => {
                  const isPositive =
                    row.isPositive ??
                    (typeof row.growth === 'string'
                      ? !row.growth.trim().startsWith('-')
                      : Number(row.growth) >= 0);
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                          {row.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {fmtCurrency(row.revenue)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {fmtNumber(row.orders)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {fmtCurrency(row.avgOrder)}
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          isPositive ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {row.growth}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  PANEL: SUBSCRIPTIONS                                               */
/* ------------------------------------------------------------------ */
const SubscriptionsPanel = ({ filters }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await reportService.getSubscriptionReport(filters);
        if (cancelled) return;
        setRows(res.data || []);
        setSummary(res.summary || {});
      } catch (err) {
        if (cancelled) return;
        toast.error(t('common.error'), {
          description: err?.message || 'Please try again later.',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters, t]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiTile
          label={t('reports.subscriptionReports.mrr')}
          value={loading ? '—' : fmtCurrency(summary.mrr)}
          color="bg-blue-500"
          footnote={t('reports.subscriptionReports.fromActive', {
            count: summary.active ?? 0,
          })}
        />
        <KpiTile
          label={t('reports.subscriptionReports.totalSubscriptions')}
          value={loading ? '—' : fmtNumber(summary.total ?? 0)}
        />
        <KpiTile
          label={t('reports.subscriptionReports.active')}
          value={loading ? '—' : fmtNumber(summary.active ?? 0)}
        />
        <KpiTile
          label={t('reports.subscriptionReports.inactive')}
          value={loading ? '—' : fmtNumber(summary.inactive ?? 0)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              {t('reports.subscriptionReports.byPlan')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">{t('reports.subscriptionReports.plan')}</th>
                  <th className="px-6 py-3">{t('reports.subscriptionReports.count')}</th>
                  <th className="px-6 py-3">{t('reports.subscriptionReports.revenue')}</th>
                </tr>
              </thead>
              {loading ? (
                <TableSkeleton cols={3} />
              ) : rows.length === 0 ? (
                <EmptyRow colSpan={3} />
              ) : (
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {row.planName || row.plan}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {fmtNumber(row.count)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {fmtCurrency(row.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              {t('reports.subscriptionReports.upcomingRenewals')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">{t('reports.subscriptionReports.month')}</th>
                  <th className="px-6 py-3">{t('reports.subscriptionReports.renewals')}</th>
                  <th className="px-6 py-3">{t('reports.subscriptionReports.expected')}</th>
                </tr>
              </thead>
              {loading ? (
                <TableSkeleton cols={3} />
              ) : (summary.upcomingRenewals || []).length === 0 ? (
                <EmptyRow colSpan={3} />
              ) : (
                <tbody className="divide-y divide-gray-100">
                  {summary.upcomingRenewals.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {row.month}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {fmtNumber(row.count)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {fmtCurrency(row.expectedRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  PANEL: HARDWARE SALES                                              */
/* ------------------------------------------------------------------ */
const HardwarePanel = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const now = new Date();
        const res = await reportService.getHardwareSalesReport({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
        if (cancelled) return;
        setRows(res.data || []);
        setSummary(res.summary || {});
      } catch (err) {
        if (cancelled) return;
        toast.error(t('common.error'), {
          description: err?.message || 'Please try again later.',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const totalSales =
    summary.totalSales ?? rows.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
  const unitsSold =
    summary.unitsSold ?? rows.reduce((s, r) => s + (Number(r.units) || 0), 0);
  const avgUnitPrice =
    summary.avgUnitPrice ?? (unitsSold ? totalSales / unitsSold : 0);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <KpiTile
          label={t('reports.hardwareSales.totalHardwareSales')}
          value={loading ? '—' : fmtCurrency(totalSales)}
          color="bg-purple-500"
          footnote={t('reports.hardwareSales.unitsSoldFootnote', {
            count: unitsSold,
          })}
        />
        <KpiTile
          label={t('reports.hardwareSales.unitsSold')}
          value={loading ? '—' : fmtNumber(unitsSold)}
        />
        <KpiTile
          label={t('reports.hardwareSales.avgUnitPrice')}
          value={loading ? '—' : fmtCurrency(avgUnitPrice)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {t('reports.hardwareSales.byCategory')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">{t('reports.hardwareSales.category')}</th>
                <th className="px-6 py-3">{t('reports.hardwareSales.unitsSold')}</th>
                <th className="px-6 py-3">{t('reports.hardwareSales.revenue')}</th>
                <th className="px-6 py-3">{t('reports.hardwareSales.avgPrice')}</th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton cols={4} />
            ) : rows.length === 0 ? (
              <EmptyRow colSpan={4} />
            ) : (
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {row.category || row.deviceType}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {fmtNumber(row.units)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {fmtCurrency(row.revenue)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {fmtCurrency(row.avgPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  PANEL: INVENTORY                                                   */
/* ------------------------------------------------------------------ */
const InventoryPanel = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await reportService.getInventoryStatus({});
        if (cancelled) return;
        setRows(res.data || []);
        setSummary(res.summary || {});
      } catch (err) {
        if (cancelled) return;
        toast.error(t('common.error'), {
          description: err?.message || 'Please try again later.',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const totalItems =
    summary.totalItems ?? rows.reduce((s, r) => s + (Number(r.total) || 0), 0);
  const lowStock =
    summary.lowStock ?? rows.reduce((s, r) => s + (Number(r.lowStock) || 0), 0);
  const outOfStock =
    summary.outOfStock ??
    rows.reduce((s, r) => s + (Number(r.outOfStock) || 0), 0);
  const totalValue =
    summary.totalValue ??
    rows.reduce((s, r) => s + (Number(r.totalValue) || 0), 0);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiTile
          label={t('reports.inventory.totalItems')}
          value={loading ? '—' : fmtNumber(totalItems)}
          color="bg-orange-500"
          footnote={t('reports.inventory.acrossLocations')}
        />
        <KpiTile
          label={t('reports.inventory.lowStock')}
          value={loading ? '—' : fmtNumber(lowStock)}
        />
        <KpiTile
          label={t('reports.inventory.outOfStock')}
          value={loading ? '—' : fmtNumber(outOfStock)}
        />
        <KpiTile
          label={t('reports.inventory.totalValue')}
          value={loading ? '—' : fmtCurrency(totalValue)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {t('reports.inventory.byLocation')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">{t('reports.analytics.location')}</th>
                <th className="px-6 py-3">{t('reports.inventory.device')}</th>
                <th className="px-6 py-3">{t('reports.inventory.totalItems')}</th>
                <th className="px-6 py-3">{t('reports.inventory.lowStock')}</th>
                <th className="px-6 py-3">{t('reports.inventory.outOfStock')}</th>
                <th className="px-6 py-3">{t('reports.inventory.totalValue')}</th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton cols={6} />
            ) : rows.length === 0 ? (
              <EmptyRow colSpan={6} />
            ) : (
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                        {row.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{row.device}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {fmtNumber(row.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                        {fmtNumber(row.lowStock)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                        {fmtNumber(row.outOfStock)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {fmtCurrency(row.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  PANEL: LOW STOCK                                                   */
/* ------------------------------------------------------------------ */
const LowStockPanel = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await reportService.getLowStockAlerts({
          threshold: 10,
          location: 'all',
          search: '',
        });
        if (cancelled) return;
        setRows(res.data || []);
        setSummary(res.summary || {});
      } catch (err) {
        if (cancelled) return;
        toast.error(t('common.error'), {
          description: err?.message || 'Please try again later.',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const criticalCount = summary.criticalCount ?? rows.length;

  return (
    <>
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="p-2 rounded-full bg-red-500 text-white shrink-0">
          <AlertIcon />
        </div>
        <div>
          <p className="font-semibold text-red-700">
            {t('reports.lowStock.alertTitle')}
          </p>
          <p className="text-sm text-red-600">
            {t('reports.lowStock.alertDesc', { count: criticalCount })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {t('reports.lowStock.items')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">{t('reports.lowStock.status')}</th>
                <th className="px-6 py-3">{t('reports.inventory.device')}</th>
                <th className="px-6 py-3">{t('reports.analytics.location')}</th>
                <th className="px-6 py-3">{t('reports.lowStock.current')}</th>
                <th className="px-6 py-3">{t('reports.lowStock.minimum')}</th>
                <th className="px-6 py-3">{t('reports.lowStock.needToOrder')}</th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton cols={6} />
            ) : rows.length === 0 ? (
              <EmptyRow colSpan={6} />
            ) : (
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, idx) => {
                  const need = Math.max(
                    0,
                    (row.minimum ?? 0) - (row.current ?? 0)
                  );
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {row.status || t('reports.lowStock.critical')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {row.device}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                          {row.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-red-600 font-bold">
                        {fmtNumber(row.current)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {fmtNumber(row.minimum)}
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-semibold">
                        {fmtNumber(need || row.needToOrder)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  PANEL: LOCATIONS                                                   */
/* ------------------------------------------------------------------ */
const LocationsPanel = ({ filters }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await reportService.getRevenueReport(filters);
        if (cancelled) return;
        setRows(res.data || []);
      } catch (err) {
        if (cancelled) return;
        toast.error(t('common.error'), {
          description: err?.message || 'Please try again later.',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filters, t]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          {t('reports.locationComparison.title')}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">{t('reports.analytics.location')}</th>
              <th className="px-6 py-3">{t('reports.analytics.revenue')}</th>
              <th className="px-6 py-3">{t('reports.analytics.orders')}</th>
              <th className="px-6 py-3">{t('reports.analytics.avgOrder')}</th>
              <th className="px-6 py-3">{t('reports.inventory.totalValue')}</th>
              <th className="px-6 py-3">{t('reports.inventory.lowStock')}</th>
              <th className="px-6 py-3">{t('reports.locationComparison.performance')}</th>
            </tr>
          </thead>
          {loading ? (
            <TableSkeleton cols={7} />
          ) : rows.length === 0 ? (
            <EmptyRow colSpan={7} />
          ) : (
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, idx) => {
                const isPositive =
                  row.isPositive ??
                  (typeof row.growth === 'string'
                    ? !row.growth.trim().startsWith('-')
                    : Number(row.growth) >= 0);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                        {row.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {fmtCurrency(row.revenue)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {fmtNumber(row.orders)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {fmtCurrency(row.avgOrder)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {fmtCurrency(row.inventoryValue)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                        {fmtNumber(row.lowStock)}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        isPositive ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {row.growth}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ANALYTICS VIEW — cards switch the panel in-place                   */
/* ------------------------------------------------------------------ */
const AnalyticsView = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  /* Which report panel is currently shown — first card is default. */
  const [activeAction, setActiveAction] = useState('revenue');

  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    location: 'all',
    search: '',
  });

  const quickActions = useMemo(
    () => [
      {
        key: 'revenue',
        icon: <DollarIcon />,
        label: t('reports.quickActions.revenueReports'),
        color: 'text-emerald-600 bg-emerald-50',
        activeClass: 'border-emerald-300 ring-2 ring-emerald-200',
      },
      {
        key: 'subscriptions',
        icon: <UsersIcon />,
        label: t('reports.quickActions.subscriptionReports'),
        color: 'text-blue-600 bg-blue-50',
        activeClass: 'border-blue-300 ring-2 ring-blue-200',
      },
      {
        key: 'hardware',
        icon: <CartIcon />,
        label: t('reports.quickActions.marketplaceSales'),
        color: 'text-purple-600 bg-purple-50',
        activeClass: 'border-purple-300 ring-2 ring-purple-200',
      },
      {
        key: 'inventory',
        icon: <CubeIcon />,
        label: t('reports.quickActions.inventoryReports'),
        color: 'text-orange-600 bg-orange-50',
        activeClass: 'border-orange-300 ring-2 ring-orange-200',
      },
      {
        key: 'lowStock',
        icon: <AlertIcon />,
        label: t('reports.quickActions.lowStockAlerts'),
        color: 'text-red-600 bg-red-50',
        activeClass: 'border-red-300 ring-2 ring-red-200',
      },
      {
        key: 'locations',
        icon: <LocationIcon />,
        label: t('reports.quickActions.locationComparison'),
        color: 'text-cyan-600 bg-cyan-50',
        activeClass: 'border-cyan-300 ring-2 ring-cyan-200',
      },
    ],
    [t]
  );

  /* Which panel content to render below the filters. */
  const renderPanel = () => {
    switch (activeAction) {
      case 'revenue':
        return <RevenuePanel filters={filters} />;
      case 'subscriptions':
        return <SubscriptionsPanel filters={filters} />;
      case 'hardware':
        return <HardwarePanel />;
      case 'inventory':
        return <InventoryPanel />;
      case 'lowStock':
        return <LowStockPanel />;
      case 'locations':
        return <LocationsPanel filters={filters} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 w-full bg-gray-50">
      {/* Top Bar */}
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

      {/* Quick Actions — clicking changes which panel is shown below */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {quickActions.map((item) => {
          const isActive = activeAction === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveAction(item.key)}
              className={`flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border transition-all text-center gap-2 hover:shadow-md ${
                isActive
                  ? item.activeClass
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`p-2 rounded-full ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {item.label}
              </span>
            </button>
          );
        })}
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
          <ChevronDownIcon
            className={`transition-transform duration-200 ${
              isFilterOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isFilterOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t('reports.filters.dateRange')}
              </label>
              <div className="relative">
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, dateRange: e.target.value }))
                  }
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="last7days">
                    {t('reports.filters.last7Days')}
                  </option>
                  <option value="last30days">
                    {t('reports.filters.last30Days')}
                  </option>
                  <option value="last90days">
                    {t('reports.filters.last90Days')}
                  </option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t('reports.filters.location')}
              </label>
              <div className="relative">
                <select
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, location: e.target.value }))
                  }
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">{t('common.all')}</option>
                  <option value="downtownBistro">
                    {t('reports.analyticsView.revenueData.downtownBistro')}
                  </option>
                  <option value="oceanViewCafe">
                    {t('reports.analyticsView.revenueData.oceanViewCafe')}
                  </option>
                  <option value="mountainLodge">
                    {t('reports.analyticsView.revenueData.mountainLodge')}
                  </option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t('common.search')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-2.5">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                  }
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel content — swapped based on the active card */}
      <div key={activeAction}>{renderPanel()}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  REPORTS VIEW                                                       */
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
      <div className="flex justify-between items-center flex-wrap mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('reports.title')}
        </h1>
        <ViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

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
                      (metric.trend === 'up'
                        ? 'text-green-600'
                        : 'text-gray-900')
                    }`}
                  >
                    {metric.trend === 'up' && <span className="mr-2">↑</span>}
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch lg:h-[520px]">
        <div className="h-full min-h-0">
          <ActiveClients />
        </div>
        <div className="h-full min-h-0">
          <ActiveClientsDonutChart />
        </div>
      </div>

      <div className="grid grid-cols-1 mt-5 lg:grid-cols-2 gap-6 mb-8 items-stretch lg:h-[480px]">
        <div className="h-full min-h-0">
          <InactiveClientsChart />
        </div>
        <div className="h-full min-h-0">
          <InactiveClientsTable />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <SubscriptionSalesChart />
        </div>
        <div>
          <SubscriptionTable />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <LatestTransactionsTable />
        </div>
        <div>
          <TransactionGraph />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <TicketsReportCard />
        </div>
        <div>
          <SupportTickets />
        </div>
      </div>

      <div className="w-full">
        <CityWiseUsage />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  MAIN                                                               */
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