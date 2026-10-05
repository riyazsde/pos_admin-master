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
} from 'lucide-react';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import dot from '../../assets/Images/admin/client/dot.png';
import logo from '../../assets/Images/Home/logo.png';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setClientsLoading,
  setClientsData,
  setClientsError,
  setClientDetailLoading,
  setClientDetailData,
  setClientDetailError,
} from '../../Store/Features/clients/clientsSlice';
import { clientService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PER_PAGE = 8;

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

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  const { clients, listLoading, detailsById } = useAppSelector(
    (state) => state.clients
  );

  // ✅ State
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('All Clients');
  const [showRightPanel, setShowRightPanel] = useState(false);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const buttonRefs = useRef([]);

  // ---------------------------------------------------------------------
  // ✅ Fetch list once on mount
  // ---------------------------------------------------------------------
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
            err?.response?.data?.message ||
            err?.message ||
            t('common.error'),
        });
      }
    };

    fetchClients();
  }, [dispatch, t]);

  // ---------------------------------------------------------------------
  // ✅ Filter by period
  // ---------------------------------------------------------------------
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (selectedPeriod === 'All Clients') return true;
      if (selectedPeriod === 'Active Clients') return client.Status === true;
      if (selectedPeriod === 'Inactive Clients')
        return client.Status === false;
      return true;
    });
  }, [clients, selectedPeriod]);

  // ---------------------------------------------------------------------
  // ✅ Pagination math
  // ---------------------------------------------------------------------
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PER_PAGE));
  const startIdx = (currentPage - 1) * PER_PAGE;
  const endIdx = startIdx + PER_PAGE;
  const paginatedClients = filteredClients.slice(startIdx, endIdx);

  // ✅ Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriod]);

  // ✅ Clamp page if filter shrinks the list
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ---------------------------------------------------------------------
  // ✅ Keep selection valid against paginated list
  // ---------------------------------------------------------------------
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

  // ---------------------------------------------------------------------
  // ✅ Fetch selected client's detail (with cache)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (selectedClientIndex === null) return;
    const client = paginatedClients[selectedClientIndex];
    if (!client) return;

    const id = client.Clients_id;
    const cached = detailsById[id];

    if (cached?.data) return;

    const fetchDetail = async () => {
      dispatch(setClientDetailLoading({ id, loading: true }));
      try {
        const data = await clientService.getClientById(id);
        dispatch(setClientDetailData({ id, data }));
      } catch (err) {
        console.error('Fetch client detail error:', err);
        dispatch(
          setClientDetailError({
            id,
            error: err?.message || 'Failed to load detail',
          })
        );
      }
    };

    fetchDetail();
  }, [selectedClientIndex, paginatedClients, detailsById, dispatch]);

  // ---------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------
  const selectedClient =
    selectedClientIndex !== null
      ? paginatedClients[selectedClientIndex]
      : null;

  const selectedDetail =
    selectedClient && detailsById[selectedClient.Clients_id]?.data;

  const detailLoading =
    selectedClient && detailsById[selectedClient.Clients_id]?.loading;

  // ---------------------------------------------------------------------
  // Dot position helper
  // ---------------------------------------------------------------------
  const getDotTop = () => {
    if (
      selectedClientIndex === null ||
      !buttonRefs.current[selectedClientIndex]
    )
      return 0;
    const btn = buttonRefs.current[selectedClientIndex];
    const parent = btn.closest('.flex.h-full.relative');
    if (!parent) return 0;
    const btnRect = btn.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return btnRect.top - parentRect.top + btn.offsetHeight / 2 - 47;
  };

  const handleClientSelect = (index) => {
    setSelectedClientIndex(index);
    setShowRightPanel(true);
  };

  const closeRightPanel = () => {
    setShowRightPanel(false);
  };

  // ✅ Period dropdown options with translated labels
  const dropdownOptions = [
    { value: 'All Clients', label: t('clients.filter.all') },
    { value: 'Active Clients', label: t('clients.filter.active') },
    { value: 'Inactive Clients', label: t('clients.filter.inactive') },
  ];

  const getPlanButtonStyle = () =>
    'bg-gradient-to-b from-purple-700 to-red-600 text-white';

  // ---------------------------------------------------------------------
  // Pagination controls
  // ---------------------------------------------------------------------
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSelectedClientIndex(0); // reset selection on new page
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-semibold transition-all ${
            currentPage === i
              ? 'bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* ============================ Header ============================ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4 sm:gap-0 relative">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {t('clients.title')}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {filteredClients.length}{' '}
              {filteredClients.length === 1
                ? t('clients.clientSingular')
                : t('clients.clientPlural')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-48 items-start sm:items-center w-full sm:w-auto relative">
            <button
              className="bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-4 sm:px-6 py-2 rounded-[8px] font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
              onClick={() => navigate('/create-clients')}
            >
              {t('clients.createClient')}
              <span className="text-lg">+</span>
            </button>

            {/* Period dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border border-black rounded-md px-4 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 w-full sm:w-auto"
              >
                {dropdownOptions.find((o) => o.value === selectedPeriod)
                  ?.label || selectedPeriod}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-[246px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25),inset_0px_0px_1px_rgba(0,0,0,0.25)] rounded-lg px-3 py-4 z-50">
                  {dropdownOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedPeriod(opt.value);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded text-[16px] font-[500] font-[Manrope] leading-[24px] ${
                        selectedPeriod === opt.value
                          ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white'
                          : 'text-black hover:bg-gray-100'
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

        {/* ====================== Main content ====================== */}
        <div className="flex flex-col lg:flex-row h-full relative gap-4 lg:gap-0">
          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 w-full lg:w-[70%] flex flex-col">
            {/* Desktop header */}
            <div className="hidden sm:block bg-gradient-to-r from-purple-100 to-red-100 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-gray-600 font-semibold text-sm">#</div>
                <div className="text-gray-600 font-semibold text-sm">
                  {t('clients.table.companyName')}
                </div>
                <div className="text-gray-600 font-semibold text-sm">
                  {t('clients.table.createdDate')}
                </div>
                <div className="text-gray-600 font-semibold text-sm text-center">
                  {t('clients.table.plan')}
                </div>
              </div>
            </div>

            {/* Body */}
            {listLoading && clients.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <p className="text-sm">{t('clients.loading')}</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Users className="w-10 h-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  {t('clients.noClients')}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedPeriod !== 'All Clients'
                    ? t('clients.tryFilter')
                    : t('clients.createFirst')}
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto lg:max-h-none flex-1">
                {paginatedClients.map((client, index) => {
                  const globalId = String(startIdx + index + 1).padStart(
                    2,
                    '0'
                  );
                  const company =
                    client.Display_Name || client.Business_Name;
                  const createdDate = formatDate(client.CreateAt, locale);
                  const plan = client.Plan || 'N/A';
                  const isSelected = selectedClientIndex === index;

                  return (
                    <div
                      key={client._id || index}
                      className={`border-b border-gray-200 px-4 sm:px-6 py-4 transition-colors duration-150 ${
                        isSelected ? 'bg-purple-50/60' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Desktop Row */}
                      <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-800 font-semibold text-sm">
                          {globalId}
                        </div>
                        <div className="text-gray-800 font-semibold text-sm truncate">
                          {company}
                        </div>
                        <div className="text-red-500 font-normal text-sm">
                          {createdDate}
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <button
                            ref={(el) =>
                              (buttonRefs.current[index] = el)
                            }
                            onClick={() => handleClientSelect(index)}
                            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md cursor-pointer ${getPlanButtonStyle()}`}
                          >
                            {plan}
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div className="sm:hidden space-y-3">
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <div className="text-gray-500 text-xs font-medium">
                              #{globalId}
                            </div>
                            <div className="text-gray-800 font-semibold text-base truncate">
                              {company}
                            </div>
                          </div>
                          <button
                            onClick={() => handleClientSelect(index)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:shadow-md cursor-pointer shrink-0 ${getPlanButtonStyle()}`}
                          >
                            {plan}
                          </button>
                        </div>
                        <div className="text-red-500 font-normal text-sm">
                          {t('clients.createdLabel')}: {createdDate}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ====================== Pagination ====================== */}
            {filteredClients.length > 0 && (
              <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                {/* Showing X of Y */}
                <p className="text-xs text-gray-500">
                  {t('clients.pagination.showing', {
                    start: startIdx + 1,
                    end: Math.min(endIdx, filteredClients.length),
                    total: filteredClients.length,
                  })}
                </p>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {/* Prev */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="min-w-[36px] h-9 px-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                    title={t('clients.pagination.prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page numbers */}
                  {renderPageNumbers()}

                  {/* Next */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="min-w-[36px] h-9 px-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                    title={t('clients.pagination.next')}
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ====================== Right Panel (Desktop) ====================== */}
          <div
            className="w-[27%] min-h-[600px] right-0 ml-auto rounded-tl-[10px] relative text-white hidden lg:flex flex-col items-center py-12 px-6"
            style={{
              background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
            }}
          >
            {!selectedClient ? (
              <div className="flex flex-col items-center justify-center text-white/70 text-center gap-3 h-full w-full">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">
                  {t('clients.emptyPanel.title')}
                </p>
                <p className="text-xs text-white/60 max-w-[180px]">
                  {t('clients.emptyPanel.subtitle')}
                </p>
              </div>
            ) : (
              <>
                <img
                  src={dot}
                  alt="dot"
                  className="absolute left-[-40px]"
                  style={{ top: `${getDotTop()}px` }}
                />

                <h2 className="text-2xl font-bold mb-6 tracking-wide text-center truncate w-full px-2">
                  {selectedClient.Display_Name ||
                    selectedClient.Business_Name}
                </h2>

                <div className="bg-white rounded-xl flex items-center justify-center w-[180px] h-[180px] mb-4 overflow-hidden shrink-0">
                  {selectedClient.Business_logo ? (
                    <img
                      src={selectedClient.Business_logo}
                      alt="logo"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <img
                      src={logo}
                      alt="logo"
                      className="w-[120px] h-[20px]"
                    />
                  )}
                </div>

                <p className="text-lg font-medium mb-6">
                  {selectedClient.Plan || 'N/A'}
                </p>

                {detailLoading ? (
                  <div className="flex flex-col items-center text-white/70 gap-2 mb-6">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs">
                      {t('clients.loadingDetails')}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="text-base text-white/80 font-medium mb-2 text-center">
                      {t('clients.stats.lastYearSales')}:
                      <div className="text-white text-xl font-bold mt-1">
                        {formatNumber(
                          selectedDetail?.lastYearSales || 0,
                          locale
                        )}{' '}
                        {getCurrencyLabel(selectedClient)}
                      </div>
                    </div>

                    <div className="text-base text-white/80 font-medium mb-6 text-center">
                      {t('clients.stats.totalOrders')}:
                      <div className="text-white text-xl font-bold mt-1">
                        {formatNumber(
                          selectedDetail?.TotalOrdersLastYear || 0,
                          locale
                        )}
                      </div>
                    </div>

                    {selectedDetail?.EmployeeCountByRole?.length > 0 && (
                      <div className="text-base text-white/80 font-medium mb-6 text-center">
                        {t('clients.stats.employees')}:
                        <div className="text-white text-xl font-bold mt-1">
                          {selectedDetail.EmployeeCountByRole.reduce(
                            (sum, r) => sum + (r.count || 0),
                            0
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <button
                  onClick={() =>
                    navigate(
                      `/client-details?id=${selectedClient.Clients_id}`
                    )
                  }
                  className="bg-white text-[#D32F2F] w-[140px] h-[38px] rounded-md text-base font-semibold hover:shadow-md transition-all duration-200"
                >
                  {t('clients.viewMore')} &gt;
                </button>
              </>
            )}
          </div>
        </div>

        {/* ====================== Mobile Bottom Sheet ====================== */}
        {showRightPanel && selectedClient && (
          <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end">
            <div
              className="w-full max-h-[80vh] overflow-y-auto rounded-t-[20px] text-white flex flex-col items-center py-8 px-6 relative animate-slide-up"
              style={{
                background:
                  'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
              }}
            >
              <button
                onClick={closeRightPanel}
                className="absolute top-4 right-4 text-white text-2xl font-bold"
              >
                ×
              </button>

              <h2 className="text-xl font-bold mb-6 tracking-wide">
                {t('clients.mobileSheet.title')}
              </h2>

              <div className="bg-white rounded-xl flex items-center justify-center w-[140px] h-[140px] mb-4 overflow-hidden">
                {selectedClient.Business_logo ? (
                  <img
                    src={selectedClient.Business_logo}
                    alt="logo"
                    className="w-full h-full object-contain p-3"
                  />
                ) : (
                  <img
                    src={logo}
                    alt="logo"
                    className="w-[100px] h-[16px]"
                  />
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2 text-center">
                {selectedClient.Display_Name ||
                  selectedClient.Business_Name}
              </h3>
              <p className="text-base font-medium mb-6">
                {selectedClient.Plan || 'N/A'}
              </p>

              <div className="w-full max-w-sm space-y-4 mb-8">
                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    {t('clients.stats.lastYearSales')}
                  </div>
                  <div className="text-white text-xl font-bold">
                    {formatNumber(
                      selectedDetail?.lastYearSales || 0,
                      locale
                    )}{' '}
                    {getCurrencyLabel(selectedClient)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    {t('clients.stats.totalOrders')}
                  </div>
                  <div className="text-white text-xl font-bold">
                    {formatNumber(
                      selectedDetail?.TotalOrdersLastYear || 0,
                      locale
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    {t('clients.createdLabel')}
                  </div>
                  <div className="text-white text-base font-semibold">
                    {formatDate(selectedClient.CreateAt, locale)}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-sm">
                <button
                  onClick={() =>
                    navigate(
                      `/client-details?id=${selectedClient.Clients_id}`
                    )
                  }
                  className="bg-white text-[#D32F2F] flex-1 py-3 rounded-md text-base font-semibold hover:shadow-md transition-all duration-200"
                >
                  {t('clients.viewDetails')}
                </button>
                <button
                  onClick={closeRightPanel}
                  className="border-2 border-white text-white flex-1 py-3 rounded-md text-base font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default withAdminLayout(Clients);