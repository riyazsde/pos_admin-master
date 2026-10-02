import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  FileDown,
  Calendar,
  LogIn,
  ShoppingCart,
  Settings,
  Filter,
  Search,
  ChevronDown,
  ArrowRight,
  Loader2,
  Inbox,
} from 'lucide-react';
import { toast } from 'sonner';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setOverviewLoading,
  setOverviewData,
  setActivityLoading,
  setActivityData,
  setExportLoading,
  setAuditsError,
} from '../../Store/Features/audits/auditsSlice';
import { auditService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const date = d.toISOString().slice(0, 7); // YYYY-MM
    const time = d.toTimeString().slice(0, 8); // HH:MM:SS
    return { date, time };
  } catch {
    return { date: '—', time: '—' };
  }
};

const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
};

const ACTION_STYLES = {
  login: 'bg-gray-50 text-gray-700 border-gray-200',
  logout: 'bg-gray-50 text-gray-700 border-gray-200',
  modify: 'bg-green-50 text-green-700 border-green-200',
  create: 'bg-blue-50 text-blue-700 border-blue-200',
  delete: 'bg-red-50 text-red-700 border-red-200',
  refund: 'bg-gray-50 text-gray-700 border-gray-200',
  default: 'bg-purple-50 text-purple-700 border-purple-200',
};

const getActionStyle = (type) =>
  ACTION_STYLES[String(type).toLowerCase()] || ACTION_STYLES.default;

// ---------------------------------------------------------------------------
// Reusable components
// ---------------------------------------------------------------------------
const StatCard = ({ title, value, icon: Icon, iconColor }) => (
  <div className="flex flex-col gap-1 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
      <span>{title}</span>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
    <div className="text-2xl font-bold text-gray-900 tabular-nums">
      {value}
    </div>
  </div>
);

const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs text-gray-500 font-medium">{label}</label>
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {(options || []).map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const ActionBadge = ({ type, text }) => {
  const Icon = {
    login: LogIn,
    logout: LogIn,
    modify: ShoppingCart,
    create: ShoppingCart,
    delete: ShoppingCart,
    refund: ({ className }) => (
      <span className={`font-bold flex items-center justify-center ${className}`}>
        $
      </span>
    ),
  }[String(type).toLowerCase()] || ShoppingCart;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${getActionStyle(
        type
      )}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{text}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const AuditLogTable = () => {
  const dispatch = useAppDispatch();

  const {
    overview,
    activity,
    activityPagination,
    overviewLoading,
    activityLoading,
    exportLoading,
  } = useAppSelector((state) => state.audits);

  // Filters state
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    action: '',
    environment: '',
    ipAddress: '',
    search: '',
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Fetch overview + activity on mount (once)
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAll = async () => {
      // Overview
      dispatch(setOverviewLoading(true));
      try {
        const ov = await auditService.getOverview();
        dispatch(setOverviewData(ov));
      } catch (err) {
        console.error('Audit overview error:', err);
        dispatch(
          setAuditsError(err?.message || 'Failed to load audit overview')
        );
      }

      // Activity
      dispatch(setActivityLoading(true));
      try {
        const result = await auditService.getActivity({ page: 1, limit: 20 });
        dispatch(setActivityData(result));
      } catch (err) {
        console.error('Audit activity error:', err);
        dispatch(setAuditsError(err?.message || 'Failed to load activity'));
      }
    };

    fetchAll();
  }, [dispatch]);

  // ✅ Re-fetch activity when filters change (debounced via button click)
  const applyFilters = async () => {
    dispatch(setActivityLoading(true));
    try {
      const result = await auditService.getActivity({
        page: 1,
        limit: 20,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        environment: filters.environment || undefined,
        action: filters.action || undefined,
        ipAddress: filters.ipAddress || undefined,
      });
      dispatch(setActivityData(result));
    } catch (err) {
      console.error('Audit filter error:', err);
      toast.error('Failed to apply filters');
    }
  };

  // ✅ Export summary → CSV
  const handleExportCSV = async () => {
    dispatch(setExportLoading(true));
    const toastId = toast.loading('Generating export...');
    try {
      const summary = await auditService.getExportSummary(
        filters.startDate || undefined,
        filters.endDate || undefined
      );

      // Build CSV
      const rows = [
        ['Metric', 'Value'],
        ['Total Audits', summary?.totalAudits ?? 0],
        ['Unique Users', summary?.uniqueUsers ?? 0],
        ['Unique IPs', summary?.uniqueIPs ?? 0],
        ['Generated At', summary?.generatedAt || new Date().toISOString()],
        [],
        ['Action', 'Count'],
        ...(summary?.actionBreakdown || []).map((a) => [
          a._id || a.action,
          a.count,
        ]),
      ];
      const csv = rows.map((r) => r.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-summary-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('CSV exported', { id: toastId, duration: 2000 });
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export', {
        id: toastId,
        description: err?.message || 'Please try again.',
      });
    } finally {
      dispatch(setExportLoading(false));
    }
  };

  // ✅ Export PDF → uses print dialog for simplicity
  const handleExportPDF = () => {
    window.print();
  };

  // Derived stats
  const totalLogs = overview?.totalAudits ?? 0;
  const todayActivity = overview?.todayAudits ?? 0;

  const loginCount =
    overview?.auditsByAction?.find(
      (a) => String(a._id).toLowerCase() === 'login'
    )?.count ?? 0;

  const modifyCount =
    overview?.auditsByAction?.find(
      (a) => String(a._id).toLowerCase() === 'modify'
    )?.count ?? 0;

  const stockCount =
    overview?.auditsByAction?.find(
      (a) =>
        String(a._id).toLowerCase().includes('stock') ||
        String(a._id).toLowerCase().includes('adjust')
    )?.count ?? 0;

  const isEmpty = activity.length === 0;

  return (
    <div className="w-full bg-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ================== Header ================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audits</h1>
            {overview?.lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(overview.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm disabled:opacity-60"
            >
              {exportLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B1A5E] rounded-md text-sm font-medium text-white hover:bg-[#72134D] transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* ================== Stats Grid ================== */}
        {overviewLoading && !overview?.lastUpdated ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-[76px] bg-gray-100 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Logs"
              value={formatNumber(totalLogs)}
              icon={FileText}
              iconColor="text-gray-400"
            />
            <StatCard
              title="Today's Activity"
              value={formatNumber(todayActivity)}
              icon={Calendar}
              iconColor="text-blue-500"
            />
            <StatCard
              title="Login Events"
              value={formatNumber(loginCount)}
              icon={LogIn}
              iconColor="text-green-500"
            />
            <StatCard
              title="Order Changes"
              value={formatNumber(modifyCount)}
              icon={ShoppingCart}
              iconColor="text-orange-500"
            />
            <StatCard
              title="Stock Adjustments"
              value={formatNumber(stockCount)}
              icon={Settings}
              iconColor="text-purple-500"
            />
          </div>
        )}

        {/* ================== Filters ================== */}
        <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </div>
            <button
              onClick={applyFilters}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
            >
              Apply Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Date range as two simple inputs (kept compact) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, startDate: e.target.value }))
                }
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, endDate: e.target.value }))
                }
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <FilterSelect
              label="Environment"
              placeholder="All environments"
              value={filters.environment}
              onChange={(v) => setFilters((f) => ({ ...f, environment: v }))}
              options={[
                { value: 'Production', label: 'Production' },
                { value: 'Staging', label: 'Staging' },
                { value: 'Development', label: 'Development' },
              ]}
            />

            <FilterSelect
              label="Action"
              placeholder="All actions"
              value={filters.action}
              onChange={(v) => setFilters((f) => ({ ...f, action: v }))}
              options={[
                'Login',
                'Logout',
                'Reservations',
                'Modify',
                'Create',
                'Delete',
                'Refund',
              ]}
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-gray-500 font-medium">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                  }
                  className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-md pl-9 pr-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================== Table ================== */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F9FAFB] border-b border-gray-200 text-gray-500 font-medium text-xs">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Which POS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activityLoading && isEmpty ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500 mx-auto mb-2" />
                    <span className="text-sm">Loading audit logs…</span>
                  </td>
                </tr>
              ) : isEmpty ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
                        <Inbox className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        No audit logs found
                      </p>
                      <p className="text-xs text-gray-400">
                        Try adjusting your filters or date range
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                activity.map((log) => {
                  const ts = formatDate(
                    log.timestamp || log.created_at || log.CreatedAt
                  );
                  const userName =
                    log.userName ||
                    log.user?.Name ||
                    log.user?.name ||
                    log.CreatedBy?.Name ||
                    'Unknown';
                  const userRole =
                    log.userRole ||
                    log.user?.role ||
                    log.role_name ||
                    log.Role_id?.role_name ||
                    '—';
                  const actionType =
                    log.action || log.actionType || log.Action || 'default';
                  const actionText =
                    log.actionLabel ||
                    log.action ||
                    log.event ||
                    'Activity';
                  const locationName =
                    log.locationName ||
                    log.location?.name ||
                    log.Client?.Business_Name ||
                    '—';
                  const locationSub =
                    log.deviceInfo || log.location?.sub || log.environment || '';
                  const ip = log.ipAddress || log.ip || '—';
                  const detailsMain =
                    log.details ||
                    log.description ||
                    log.message ||
                    '—';
                  const detailsSub = log.errorMessage || log.error || null;
                  const pos =
                    log.posDevice ||
                    log.terminal ||
                    log.Which_POS ||
                    '—';

                  return (
                    <tr
                      key={log._id || log.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <div className="flex flex-col text-xs">
                            <span className="text-gray-900 font-medium">
                              {ts.date}
                            </span>
                            <span className="text-gray-500">{ts.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">
                            {userName}
                          </span>
                          <span className="text-gray-500 text-[11px]">
                            {userRole}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ActionBadge type={actionType} text={actionText} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-gray-900">
                              {locationName}
                            </span>
                            {locationSub && (
                              <span className="text-gray-500 text-[11px]">
                                {locationSub}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900 tabular-nums">
                          {ip}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col max-w-[200px]">
                          <span
                            className="text-gray-900 text-xs truncate"
                            title={detailsMain}
                          >
                            {detailsMain}
                          </span>
                          {detailsSub && (
                            <span className="text-[11px] text-purple-600 font-medium truncate">
                              {detailsSub}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {pos}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {!isEmpty && activityPagination && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {activity.length} of{' '}
              {activityPagination.total ?? activity.length} logs
            </span>
            <span>
              Page {activityPagination.page} of{' '}
              {Math.max(activityPagination.pages || 1, 1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAdminLayout(AuditLogTable);