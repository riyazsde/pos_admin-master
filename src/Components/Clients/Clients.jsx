// src/Components/Clients/Clients.jsx

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Eye,
} from 'lucide-react';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import logo from '../../assets/Images/Home/logo.png';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setClientsLoading,
  setClientsData,
  setClientsError,
} from '../../Store/Features/clients/clientsSlice';
import { clientService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PER_PAGE = 8;

// IANA timezone your back office treats as "today".
// South Africa Standard Time (SAST, UTC+2).
const BUSINESS_TZ = 'Africa/Johannesburg';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatDate = (iso, locale = 'en-US') => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};

const formatNumber = (n, locale = 'en-US') => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString(locale);
};

const getCurrencyLabel = (client) => {
  const cur = client?.currency?.[0];
  return cur?.name || 'XOF';
};

// Format a Date as YYYY-MM-DD in a specific IANA timezone.
const toZonedDateKey = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
};

// Whole calendar days from today (in `timeZone`) to `iso`.
// Returns null for missing/invalid dates. Negative = overdue.
const getDaysLeft = (iso, timeZone = BUSINESS_TZ, now = new Date()) => {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;

  const todayKey = toZonedDateKey(now, timeZone);
  const targetKey = toZonedDateKey(target, timeZone);
  if (targetKey === todayKey) return 0;

  const msPerDay = 86_400_000;
  const todayUtc = Date.parse(`${todayKey}T00:00:00Z`);
  const targetUtc = Date.parse(`${targetKey}T00:00:00Z`);
  return Math.round((targetUtc - todayUtc) / msPerDay);
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  const { clients, listLoading } = useAppSelector((state) => state.clients);

  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('All Clients');
  const [currentPage, setCurrentPage] = useState(1);

  const buttonRefs = useRef([]);

  // Fetch list once on mount
  const hasFetchedList = useRef(false);
  useEffect(() => {
    if (hasFetchedList.current) return;
    hasFetchedList.current = true;

    const fetchClients = async () => {
      dispatch(setClientsLoading(true));
      try {
        const result = await clientService.getAllClients();
        dispatch(setClientsData(result));
      } catch (err) {
        console.error('Fetch clients error:', err);
        dispatch(setClientsError(err?.message || 'Failed to load clients'));
        toast.error(t('clients.loadFailed'), {
          description:
            err?.response?.data?.message || err?.message || t('common.error'),
        });
      }
    };

    fetchClients();
  }, [dispatch, t]);

  // Filter by period
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (selectedPeriod === 'All Clients') return true;
      if (selectedPeriod === 'Active Clients') return client.Status === true;
      if (selectedPeriod === 'Inactive Clients') return client.Status === false;
      return true;
    });
  }, [clients, selectedPeriod]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PER_PAGE));
  const startIdx = (currentPage - 1) * PER_PAGE;
  const endIdx = startIdx + PER_PAGE;
  const paginatedClients = filteredClients.slice(startIdx, endIdx);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriod]);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // Stable per calendar day so countdowns don't change on re-renders.
  const todayKey = useMemo(() => toZonedDateKey(new Date(), BUSINESS_TZ), []);

  // Precompute countdowns once per data/page/day change.
  const rows = useMemo(() => {
    return paginatedClients.map((client) => {
      const renewalSource = client.RenewalDate ?? client.CreateAt ?? null;
      return {
        client,
        daysLeft: getDaysLeft(renewalSource, BUSINESS_TZ),
        plan: client.Plan ?? null,
        paymentMethod: client.PaymentMethod ?? null,
      };
    });
  }, [paginatedClients, todayKey]);

  // Selection Logic
  useEffect(() => {
    if (paginatedClients.length === 0) {
      setSelectedClientIndex(null);
      return;
    }
    if (
      selectedClientIndex === null ||
      selectedClientIndex >= paginatedClients.length
    ) {
      setSelectedClientIndex(0);
    }
  }, [paginatedClients.length, selectedClientIndex]);

  const handleClientSelect = (index) => {
    setSelectedClientIndex(index);
  };

  const dropdownOptions = [
    { value: 'All Clients', label: t('clients.filter.all') },
    { value: 'Active Clients', label: t('clients.filter.active') },
    { value: 'Inactive Clients', label: t('clients.filter.inactive') },
  ];

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSelectedClientIndex(0);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-all ${
            currentPage === i
              ? 'bg-[#9C27B0] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  // 🎨 FIGMA STYLES
  const getPlanBadgeStyle = () => {
    return 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-[0_4px_10px_rgba(139,92,246,0.4)]';
  };

  const getDaysLeftBadge = (days) => {
    if (days === null || days === undefined) {
      return (
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold border border-gray-200">
          {t('clients.noRenewalDate', 'No renewal date')}
        </span>
      );
    }
    if (days < 0) {
      return (
        <span className="px-3 py-1 rounded-full bg-[#FFF0F0] text-[#FF4D4D] text-xs font-semibold border border-[#FFD6D6]">
          {t('clients.overdue', 'Overdue')}
        </span>
      );
    }
    if (days <= 3) {
      return (
        <span className="px-3 py-1 rounded-full bg-[#FFF0F0] text-[#FF4D4D] text-xs font-semibold border border-[#FFD6D6]">
          {t('clients.daysLeft', {
            count: days,
            defaultValue: `${days} days left`,
          })}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-[#FFF9E5] text-[#F5A623] text-xs font-semibold border border-[#FCEEC5]">
        {t('clients.daysLeft', {
          count: days,
          defaultValue: `${days} days left`,
        })}
      </span>
    );
  };

  return (
    <div className="min-h-screen font-sans bg-[#FAFAFA] pb-10">
      <div className="w-full">
        {/* ============================ Header ============================ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl font-bold text-black tracking-tight">
            {t('clients.title') || 'Clients'}
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto relative">
            <button
              className="bg-gradient-to-r from-[#9C27B0] to-[#D32F2F] text-white px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              onClick={() => navigate('/create-clients')}
            >
              {t('clients.createClient') || 'Create Client'}
              <span className="text-lg leading-none font-light">+</span>
            </button>

            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-full sm:w-auto flex items-center justify-between min-w-[110px] text-sm"
              >
                <span className="font-medium">
                  {dropdownOptions.find((o) => o.value === selectedPeriod)
                    ?.label || selectedPeriod}
                </span>
                <svg
                  className="w-4 h-4 ml-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-[180px] bg-white shadow-lg rounded-lg py-1 z-50 border border-gray-100">
                  {dropdownOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedPeriod(opt.value);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                        selectedPeriod === opt.value
                          ? 'bg-purple-50 text-purple-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====================== Main Content ====================== */}
        <div className="w-full">
          {/* TABLE SECTION - FULL WIDTH */}
          <div className="bg-white rounded-xl border border-gray-200 w-full flex flex-col shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:block bg-[#FDF8FD] border-b border-gray-100 px-6 py-4">
              <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                <div className="text-gray-500 font-medium text-xs">#</div>
                <div className="text-gray-500 font-medium text-xs">
                  Company Name
                </div>
                <div className="text-gray-500 font-medium text-xs">
                  Renewal Date
                </div>
                <div className="text-gray-500 font-medium text-xs text-center">
                  Plan
                </div>
                <div className="text-gray-500 font-medium text-xs text-center">
                  Payment Method
                </div>
                <div className="text-gray-500 font-medium text-xs text-center">
                  Action
                </div>
              </div>
            </div>

            {/* Table Body */}
            {listLoading && clients.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                <p className="text-sm">
                  {t('clients.loading') || 'Loading...'}
                </p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Users className="w-8 h-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  {t('clients.noClients') || 'No clients found'}
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                {rows.map((row, index) => {
                  const client = row.client;
                  const { daysLeft, plan, paymentMethod } = row;
                  const globalId = String(startIdx + index + 1).padStart(
                    2,
                    '0'
                  );
                  const company =
                    client.Display_Name || client.Business_Name || 'Unknown';
                  const isSelected = selectedClientIndex === index;

                  return (
                    <div
                      key={client._id || index}
                      className={`border-b border-gray-100 px-6 py-4 transition-colors duration-150 ${
                        isSelected ? 'bg-[#FDF8FD]' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* DESKTOP ROW */}
                      <div className="hidden sm:grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                        <div className="text-gray-900 font-bold text-[13px]">
                          {globalId}
                        </div>
                        <div className="text-gray-900 font-bold text-[13px] truncate">
                          {company}
                        </div>
                        <div>{getDaysLeftBadge(daysLeft)}</div>
                        <div className="flex justify-center">
                          <span
                            className={`px-5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide ${getPlanBadgeStyle()}`}
                          >
                            {plan ?? '—'}
                          </span>
                        </div>
                        <div className="text-gray-700 text-[13px] text-center font-normal">
                          {paymentMethod ?? '—'}
                        </div>
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              navigate(
                                `/client-details?id=${client.Clients_id}`
                              )
                            }
                            className="text-[#8B5CF6] hover:text-[#6D28D9] text-[13px] font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Mobile View */}
                      <div className="sm:hidden space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-400 text-[10px] font-bold block mb-1">
                              #{globalId}
                            </span>
                            <span className="text-gray-900 font-bold text-sm block">
                              {company}
                            </span>
                          </div>
                          <span
                            className={`px-4 py-1 rounded-full text-[10px] font-bold ${getPlanBadgeStyle()}`}
                          >
                            {plan ?? '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          {getDaysLeftBadge(daysLeft)}
                          <button
                            onClick={() =>
                              navigate(
                                `/client-details?id=${client.Clients_id}`
                              )
                            }
                            className="text-[#8B5CF6] text-xs font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {filteredClients.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-white">
                <p className="text-xs text-gray-400 font-medium">
                  Showing{' '}
                  <span className="text-gray-700">
                    {startIdx + 1}-
                    {Math.min(endIdx, filteredClients.length)}
                  </span>{' '}
                  of {filteredClients.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  {renderPageNumbers()}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(Clients);