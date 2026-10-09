import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText,
  FileDown,
  Calendar,
  LogIn,
  LogOut,
  ShoppingCart,
  Settings,
  Filter,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Loader2,
  Inbox,
  DollarSign,
  Tag,
  Edit3,
  Trash2,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
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
  if (!iso) return { date: '—', time: '—' };
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { date: '—', time: '—' };
    const date = d.toISOString().slice(0, 10);
    const time = d.toTimeString().slice(0, 8);
    return { date, time };
  } catch {
    return { date: '—', time: '—' };
  }
};

const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
};

const renderSafe = (value, fallback = '—') => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    const joined = value.map((v) => renderSafe(v, '')).filter(Boolean).join(', ');
    return joined || fallback;
  }
  if (typeof value === 'object') {
    const candidates = ['label', 'text', 'name', 'title', 'message', 'description'];
    for (const key of candidates) {
      if (typeof value[key] === 'string' && value[key]) return value[key];
    }
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }
  return String(value);
};

/**
 * Build a compact list of page numbers with ellipsis.
 * e.g. [1, '...', 4, 5, 6, '...', 20]
 */
const buildPageList = (current, total) => {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let last;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (last) {
      if (i - last === 2) {
        rangeWithDots.push(last + 1);
      } else if (i - last > 2) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    last = i;
  }

  return rangeWithDots;
};

// ---- Action styling --------------------------------------------------------
const ACTION_STYLES = {
  login: 'bg-gray-50 text-gray-700 border-gray-200',
  logout: 'bg-gray-50 text-gray-700 border-gray-200',
  modify: 'bg-green-50 text-green-700 border-green-200',
  create: 'bg-blue-50 text-blue-700 border-blue-200',
  delete: 'bg-red-50 text-red-700 border-red-200',
  refund: 'bg-gray-50 text-gray-700 border-gray-200',
  discount: 'bg-green-50 text-green-700 border-green-200',
  default: 'bg-purple-50 text-purple-700 border-purple-200',
};

const getActionStyle = (type) => {
  const key = typeof type === 'string' ? type.toLowerCase() : '';
  return ACTION_STYLES[key] || ACTION_STYLES.default;
};

const ACTION_ICONS = {
  login: LogIn,
  logout: LogOut,
  modify: ShoppingCart,
  create: Plus,
  delete: Trash2,
  refund: DollarSign,
  discount: Tag,
  'menu price': Edit3,
  default: ShoppingCart,
};

// ---------------------------------------------------------------------------
// Reusable components
// ---------------------------------------------------------------------------
const StatCard = ({ title, value, icon: Icon, iconColor }) => (
  <div className="flex flex-col gap-1 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
      <span>{title}</span>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
    <div className="text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
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
        {(options || []).map((opt, i) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={optValue ?? i} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const ActionBadge = ({ action, label, iconOverride }) => {
  const key = String(action || label || '').toLowerCase();
  const matched =
    Object.keys(ACTION_ICONS).find((k) => k !== 'default' && key.includes(k)) ||
    'default';
  const Icon = iconOverride || ACTION_ICONS[matched];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${getActionStyle(
        matched
      )}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{renderSafe(label || action, 'Activity')}</span>
    </div>
  );
};

const SortableHeader = ({ label, sortKey, currentSort, onSort, className = '' }) => {
  const isActive = currentSort.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  return (
    <th className={`px-4 py-3 ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`group inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
          isActive ? 'text-purple-600' : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        <span>{label}</span>
        {direction === 'asc' ? (
          <ArrowUp className="w-3.5 h-3.5" />
        ) : direction === 'desc' ? (
          <ArrowDown className="w-3.5 h-3.5" />
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
        )}
      </button>
    </th>
  );
};

/**
 * Pagination component.
 */
const Pagination = ({
  page,
  pages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (!pages || pages < 1) return null;

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  const pageList = buildPageList(page, pages);

  const btnBase =
    'inline-flex items-center justify-center h-8 min-w-[32px] px-2 text-xs font-medium rounded-md border transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      {/* Left: range + page size */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>
          Showing <span className="font-semibold text-gray-700">{startItem}</span>
          –<span className="font-semibold text-gray-700">{endItem}</span> of{' '}
          <span className="font-semibold text-gray-700">{total}</span> logs
        </span>

        <div className="hidden sm:flex items-center gap-1.5">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white border border-gray-200 text-gray-700 text-xs rounded-md px-2 py-1 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: page controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className={`${btnBase} border-gray-200 text-gray-600 hover:bg-gray-50`}
          aria-label="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={`${btnBase} border-gray-200 text-gray-600 hover:bg-gray-50`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pageList.map((item, i) =>
          item === '...' ? (
            <span
              key={`dots-${i}`}
              className="px-1.5 text-xs text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`${btnBase} ${
                item === page
                  ? 'bg-purple-600 border-purple-600 text-white hover:bg-purple-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className={`${btnBase} border-gray-200 text-gray-600 hover:bg-gray-50`}
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(pages)}
          disabled={page >= pages}
          className={`${btnBase} border-gray-200 text-gray-600 hover:bg-gray-50`}
          aria-label="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Field mapping: API → Screenshot-style columns
// ---------------------------------------------------------------------------
const mapLog = (log) => {
  const ts = formatDate(log.timestamp || log.created_at || log.CreatedAt);

  const userName = renderSafe(
    log.createdBy?.Name ||
      log.createdBy?.name ||
      log.userName ||
      log.user?.Name ||
      log.user?.name ||
      log.employee?.Name ||
      log.employee?.name,
    'Unknown'
  );

  const userRole = renderSafe(
    log.userRole ||
      log.role_name ||
      log.Role_id?.role_name ||
      log.createdBy?.role ||
      log.user?.role ||
      log.employee?.role,
    ''
  );

  const rawAction = renderSafe(
    log.actionLabel || log.action || log.event,
    'Activity'
  );

  const locationName = renderSafe(
    log.locationName || log.location?.name || log.Client?.Business_Name,
    '—'
  );

  const locationSub = renderSafe(
    log.deviceInfo || log.location?.sub || log.environment,
    ''
  );

  const ip = renderSafe(log.ipAddress || log.ip, '—');

  const detailsMain = renderSafe(
    log.details?.description ||
      log.description ||
      log.message ||
      (typeof log.details === 'string' ? log.details : null),
    '—'
  );

  const detailsParts = [];
  const d = log.details || {};
  if (d.before || d.after) {
    detailsParts.push(
      `From ${renderSafe(d.before, '—')} → ${renderSafe(d.after, '—')}`
    );
  }
  if (d.metadata?.durationMs != null) {
    detailsParts.push(`${d.metadata.durationMs}ms`);
  }
  if (d.metadata?.success != null) {
    detailsParts.push(d.metadata.success ? 'success' : 'failed');
  }
  if (log.responseStatus != null) {
    detailsParts.push(`HTTP ${log.responseStatus}`);
  }
  const detailsSub = detailsParts.length ? detailsParts.join(' · ') : null;

  const pos = renderSafe(
    log.posDevice || log.terminal || log.Which_POS || log.deviceName,
    '—'
  );

  return {
    key: log.Audits_id || log._id || log.id,
    raw: {
      timestamp: log.timestamp || log.created_at || log.CreatedAt,
      userName,
      actionLabel: rawAction,
      locationName,
      ip,
      detailsMain,
      pos,
    },
    ts,
    userName,
    userRole,
    actionKey: String(log.actionType || rawAction).toLowerCase(),
    actionLabel: rawAction,
    locationName,
    locationSub,
    ip,
    detailsMain,
    detailsSub,
    pos,
  };
};

// ---------------------------------------------------------------------------
// Main Component
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

  // ---- Filter state (form) ----
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    action: '',
    environment: '',
    ipAddress: '',
    search: '',
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  // ---- Sort state ----
  const [sort, setSort] = useState({ key: 'timestamp', direction: 'desc' });
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef(null);

  // ---- Pagination state ----
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---- Fetch activity (shared by all triggers) ----
  const fetchActivity = async (params = {}) => {
    dispatch(setActivityLoading(true));
    try {
      const result = await auditService.getActivity({
        page: params.page ?? page,
        limit: params.limit ?? pageSize,
        startDate: appliedFilters.startDate || undefined,
        endDate: appliedFilters.endDate || undefined,
        environment: appliedFilters.environment || undefined,
        action: appliedFilters.action || undefined,
        ipAddress: appliedFilters.ipAddress || undefined,
        search: appliedFilters.search || undefined,
        sortBy: sort.key,
        sortOrder: sort.direction,
      });
      dispatch(setActivityData(result));
      return result;
    } catch (err) {
      console.error('Audit activity error:', err);
      toast.error('Failed to load audit activity');
      throw err;
    }
  };

  // ---- Initial fetch ----
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
        dispatch(setAuditsError(err?.message || 'Failed to load audit overview'));
      }

      // Activity
      dispatch(setActivityLoading(true));
      try {
        const result = await auditService.getActivity({
          page: 1,
          limit: 20,
          sortBy: 'timestamp',
          sortOrder: 'desc',
        });
        dispatch(setActivityData(result));
      } catch (err) {
        console.error('Audit activity error:', err);
        dispatch(setAuditsError(err?.message || 'Failed to load activity'));
      }
    };

    fetchAll();
  }, [dispatch]);

  // ---- Apply filters (resets to page 1) ----
  const applyFilters = async () => {
    setAppliedFilters(filters);
    setPage(1);
    try {
      await fetchActivity({ page: 1 });
      toast.success('Filters applied');
    } catch {
      /* toast already shown */
    }
  };

  // ---- Clear filters ----
  const clearFilters = async () => {
    const empty = {
      startDate: '',
      endDate: '',
      action: '',
      environment: '',
      ipAddress: '',
      search: '',
    };
    setFilters(empty);
    setAppliedFilters(empty);
    setPage(1);
    try {
      await fetchActivity({ page: 1 });
    } catch {
      /* toast already shown */
    }
  };

  // ---- Sort handlers ----
  const handleSort = (key) => {
    setSort((prev) => {
      const next =
        prev.key === key
          ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
          : { key, direction: 'asc' };
      // Refetch sorted data from backend
      setPage(1);
      fetchActivity({ page: 1, sortKeyOverride: next.key });
      return next;
    });
  };

  const handleSortFromMenu = (key, direction) => {
    const next = { key, direction };
    setSort(next);
    setSortMenuOpen(false);
    setPage(1);
    fetchActivity({ page: 1 });
  };

  // ---- Pagination handlers ----
  const handlePageChange = (newPage) => {
    const totalPages = activityPagination?.pages ?? 1;
    const clamped = Math.min(Math.max(1, newPage), totalPages);
    if (clamped === page) return;
    setPage(clamped);
    fetchActivity({ page: clamped });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
    fetchActivity({ page: 1, limit: newSize });
  };

  // ---- Derived sorted rows (client-side sort for current page) ----
  const sortedActivity = useMemo(() => {
    if (!activity || activity.length === 0) return activity || [];

    const mapped = activity.map((log, index) => ({
      ...mapLog(log),
      _originalIndex: index,
    }));

    const { key, direction } = sort;
    const dir = direction === 'asc' ? 1 : -1;

    return mapped.sort((a, b) => {
      let av;
      let bv;

      switch (key) {
        case 'timestamp':
          av = new Date(a.raw.timestamp || 0).getTime();
          bv = new Date(b.raw.timestamp || 0).getTime();
          break;
        case 'user':
          av = String(a.userName || '').toLowerCase();
          bv = String(b.userName || '').toLowerCase();
          break;
        case 'action':
          av = String(a.actionLabel || '').toLowerCase();
          bv = String(b.actionLabel || '').toLowerCase();
          break;
        case 'location':
          av = String(a.locationName || '').toLowerCase();
          bv = String(b.locationName || '').toLowerCase();
          break;
        case 'ip':
          av = String(a.ip || '');
          bv = String(b.ip || '');
          break;
        case 'details':
          av = String(a.detailsMain || '').toLowerCase();
          bv = String(b.detailsMain || '').toLowerCase();
          break;
        case 'pos':
          av = String(a.pos || '').toLowerCase();
          bv = String(b.pos || '').toLowerCase();
          break;
        default:
          av = a._originalIndex;
          bv = b._originalIndex;
      }

      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [activity, sort]);

  // ---- Export handlers ----
  const handleExportCSV = async () => {
    dispatch(setExportLoading(true));
    const toastId = toast.loading('Generating export...');
    try {
      const summary = await auditService.getExportSummary(
        appliedFilters.startDate || undefined,
        appliedFilters.endDate || undefined
      );

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

  const handleExportPDF = () => {
    window.print();
  };

  // ---- Active filter count ----
  const activeFilterCount = Object.values(appliedFilters).filter(
    (v) => v && String(v).trim() !== ''
  ).length;

  // ---- Derived stats ----
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

  const isEmpty = !sortedActivity || sortedActivity.length === 0;

  // Pagination values with safe defaults
  const currentPage = activityPagination?.page ?? page;
  const totalPages = Math.max(activityPagination?.pages ?? 1, 1);
  const totalItems =
    activityPagination?.total ?? (isEmpty ? 0 : sortedActivity.length);
  const currentPageSize = activityPagination?.limit ?? pageSize;

  // Sort options for the dropdown
  const sortOptions = [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'user', label: 'User' },
    { key: 'action', label: 'Action' },
    { key: 'location', label: 'Location' },
    { key: 'ip', label: 'IP Address' },
    { key: 'details', label: 'Details' },
    { key: 'pos', label: 'Which POS' },
  ];

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
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative" ref={sortMenuRef}>
                <button
                  type="button"
                  onClick={() => setSortMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Sort
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {sortMenuOpen && (
                  <div className="absolute right-0 mt-1 z-20 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    {sortOptions.map((opt) => (
                      <div key={opt.key} className="px-2 py-1.5 hover:bg-gray-50">
                        <div className="px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                          {opt.label}
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleSortFromMenu(opt.key, 'asc')}
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded ${
                              sort.key === opt.key && sort.direction === 'asc'
                                ? 'bg-purple-100 text-purple-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <ArrowUp className="w-3 h-3" /> Asc
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSortFromMenu(opt.key, 'desc')}
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded ${
                              sort.key === opt.key && sort.direction === 'desc'
                                ? 'bg-purple-100 text-purple-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <ArrowDown className="w-3 h-3" /> Desc
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}

              {/* Apply */}
              <button
                onClick={applyFilters}
                disabled={activityLoading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-60"
              >
                {activityLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Filter className="w-3.5 h-3.5" />
                )}
                Apply Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                { value: 'development', label: 'Development' },
                { value: 'staging', label: 'Staging' },
                { value: 'production', label: 'Production' },
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
                'Modify',
                'Create',
                'Delete',
                'Refund',
                'Discount Applied',
                'Menu Price Changed',
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters();
                  }}
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
                <SortableHeader
                  label="Timestamp"
                  sortKey="timestamp"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="User"
                  sortKey="user"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Action"
                  sortKey="action"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Location"
                  sortKey="location"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="IP Address"
                  sortKey="ip"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Details"
                  sortKey="details"
                  currentSort={sort}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Which POS"
                  sortKey="pos"
                  currentSort={sort}
                  onSort={handleSort}
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activityLoading && isEmpty ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500 mx-auto mb-2" />
                    <span className="text-sm">Loading audit logs…</span>
                  </td>
                </tr>
              ) : isEmpty ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-400"
                  >
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
                sortedActivity.map((m, index) => (
                  <tr
                    key={m.key || `audit-log-${index}`}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Timestamp */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div className="flex flex-col text-xs">
                          <span className="text-gray-900 font-medium">
                            {m.ts.date}
                          </span>
                          <span className="text-gray-500">{m.ts.time}</span>
                        </div>
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {m.userName}
                        </span>
                        {m.userRole && (
                          <span className="text-gray-500 text-[11px]">
                            {m.userRole}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <ActionBadge action={m.actionKey} label={m.actionLabel} />
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-gray-900">
                            {m.locationName}
                          </span>
                          {m.locationSub && (
                            <span className="text-gray-500 text-[11px]">
                              {m.locationSub}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-3">
                      <span className="text-gray-900 tabular-nums">{m.ip}</span>
                    </td>

                    {/* Details */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col max-w-[240px]">
                        <span
                          className="text-gray-900 text-xs truncate"
                          title={m.detailsMain}
                        >
                          {m.detailsMain}
                        </span>
                        {m.detailsSub && (
                          <span
                            className="text-[11px] text-purple-600 font-medium truncate"
                            title={m.detailsSub}
                          >
                            {m.detailsSub}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Which POS */}
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {m.pos}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================== Pagination ================== */}
        {!isEmpty && (
          <Pagination
            page={currentPage}
            pages={totalPages}
            total={totalItems}
            pageSize={currentPageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default withAdminLayout(AuditLogTable);