import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Users, Loader2 } from 'lucide-react';

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
// Helpers
// ---------------------------------------------------------------------------
const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};

const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
};

const getCurrencyLabel = (client) => {
  const cur = client?.currency?.[0];
  return cur?.name || 'XOF';
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { clients, listLoading, detailsById } = useAppSelector(
    (state) => state.clients
  );

  // ✅ Auto-select the first client on load
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('All Clients');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const buttonRefs = useRef([]);

  // ---------------------------------------------------------------------
  // ✅ Fetch list on mount (only once)
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
        toast.error('Failed to load clients', {
          description:
            err?.response?.data?.message || err?.message || 'Please try again.',
        });
      }
    };

    fetchClients();
  }, [dispatch]);

  // ---------------------------------------------------------------------
  // ✅ Filter list by period (client-side)
  // ---------------------------------------------------------------------
  const filteredClients = clients.filter((client) => {
    if (selectedPeriod === 'All Clients') return true;
    if (selectedPeriod === 'Active Clients') return client.Status === true;
    if (selectedPeriod === 'Inactive Clients') return client.Status === false;
    return true;
  });

  // ---------------------------------------------------------------------
  // ✅ Keep selection valid against the visible list
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (filteredClients.length === 0) {
      setSelectedClientIndex(null);
      return;
    }
    if (
      selectedClientIndex === null ||
      selectedClientIndex >= filteredClients.length
    ) {
      setSelectedClientIndex(0);
    }
  }, [filteredClients.length, selectedClientIndex]);

  // ---------------------------------------------------------------------
  // ✅ Fetch selected client's details (with cache)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (selectedClientIndex === null) return;
    const client = filteredClients[selectedClientIndex];
    if (!client) return;

    const id = client.Clients_id;
    const cached = detailsById[id];

    // Already loaded → skip
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
  }, [selectedClientIndex, filteredClients, detailsById, dispatch]);

  // ---------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------
  const selectedClient =
    selectedClientIndex !== null ? filteredClients[selectedClientIndex] : null;

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
    // On mobile we also clear selection to keep UI clean;
    // on desktop selection stays to keep right panel populated.
    // (Kept simple: keep selection — safer for desktop.)
  };

  const dropdownOptions = ['All Clients', 'Active Clients', 'Inactive Clients'];

  const getPlanButtonStyle = () =>
    'bg-gradient-to-b from-purple-700 to-red-600 text-white';

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* --------------------------- Header --------------------------- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4 sm:gap-0 relative">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Clients
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {filteredClients.length} client
              {filteredClients.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-48 items-start sm:items-center w-full sm:w-auto relative">
            <button
              className="bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-4 sm:px-6 py-2 rounded-[8px] font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
              onClick={() => navigate('/create-clients')}
            >
              Create Client
              <span className="text-lg">+</span>
            </button>

            {/* Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border border-black rounded-md px-4 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 w-full sm:w-auto"
              >
                {selectedPeriod}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-[246px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25),inset_0px_0px_1px_rgba(0,0,0,0.25)] rounded-lg px-3 py-4 z-50">
                  {dropdownOptions.map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setSelectedPeriod(period);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded text-[16px] font-[500] font-[Manrope] leading-[24px] ${
                        selectedPeriod === period
                          ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white'
                          : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --------------------------- Main Content --------------------------- */}
        <div className="flex flex-col lg:flex-row h-full relative gap-4 lg:gap-0">
          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 w-full lg:w-[70%]">
            {/* Desktop Header */}
            <div className="hidden sm:block bg-gradient-to-r from-purple-100 to-red-100 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-gray-600 font-semibold text-sm">#</div>
                <div className="text-gray-600 font-semibold text-sm">
                  Company Name
                </div>
                <div className="text-gray-600 font-semibold text-sm">
                  Created Date
                </div>
                <div className="text-gray-600 font-semibold text-sm text-center">
                  Plan
                </div>
              </div>
            </div>

            {/* Body */}
            {listLoading && clients.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                <p className="text-sm">Loading clients...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Users className="w-10 h-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  No clients found
                </p>
                <p className="text-xs text-gray-400">
                  {selectedPeriod !== 'All Clients'
                    ? 'Try changing the filter above.'
                    : 'Create your first client to get started.'}
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto lg:max-h-none">
                {filteredClients.map((client, index) => {
                  const id = String(index + 1).padStart(2, '0');
                  const company = client.Display_Name || client.Business_Name;
                  const createdDate = formatDate(client.CreateAt);
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
                          {id}
                        </div>
                        <div className="text-gray-800 font-semibold text-sm truncate">
                          {company}
                        </div>
                        <div className="text-red-500 font-normal text-sm">
                          {createdDate}
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <button
                            ref={(el) => (buttonRefs.current[index] = el)}
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
                              #{id}
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
                          Created: {createdDate}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ------------------ Right Panel (Desktop) ------------------ */}
          <div
            className="w-[27%] min-h-[600px] right-0 ml-auto rounded-tl-[10px] relative text-white hidden lg:flex flex-col items-center py-12 px-6"
            style={{
              background:
                'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
            }}
          >
            {/* Empty state */}
            {!selectedClient ? (
              <div className="flex flex-col items-center justify-center text-white/70 text-center gap-3 h-full w-full">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">No client selected</p>
                <p className="text-xs text-white/60 max-w-[180px]">
                  Select a client to view their details here
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

                {/* Company name */}
                <h2 className="text-2xl font-bold mb-6 tracking-wide text-center truncate w-full px-2">
                  {selectedClient.Display_Name || selectedClient.Business_Name}
                </h2>

                {/* Logo */}
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

                {/* Plan */}
                <p className="text-lg font-medium mb-6">
                  {selectedClient.Plan || 'N/A'}
                </p>

                {/* Stats */}
                {detailLoading ? (
                  <div className="flex flex-col items-center text-white/70 gap-2 mb-6">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Loading details...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-base text-white/80 font-medium mb-2 text-center">
                      Last Year Sales:
                      <div className="text-white text-xl font-bold mt-1">
                        {formatNumber(selectedDetail?.lastYearSales || 0)}{' '}
                        {getCurrencyLabel(selectedClient)}
                      </div>
                    </div>

                    <div className="text-base text-white/80 font-medium mb-6 text-center">
                      Total Orders Last Year:
                      <div className="text-white text-xl font-bold mt-1">
                        {formatNumber(selectedDetail?.TotalOrdersLastYear || 0)}
                      </div>
                    </div>

                    {selectedDetail?.EmployeeCountByRole?.length > 0 && (
                      <div className="text-base text-white/80 font-medium mb-6 text-center">
                        Employees:
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
                  View More &gt;
                </button>
              </>
            )}
          </div>
        </div>

        {/* ------------------ Mobile Bottom Sheet ------------------ */}
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
                Company Details
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
                {selectedClient.Display_Name || selectedClient.Business_Name}
              </h3>
              <p className="text-base font-medium mb-6">
                {selectedClient.Plan || 'N/A'}
              </p>

              <div className="w-full max-w-sm space-y-4 mb-8">
                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    Last Year Sales
                  </div>
                  <div className="text-white text-xl font-bold">
                    {formatNumber(selectedDetail?.lastYearSales || 0)}{' '}
                    {getCurrencyLabel(selectedClient)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    Total Orders Last Year
                  </div>
                  <div className="text-white text-xl font-bold">
                    {formatNumber(
                      selectedDetail?.TotalOrdersLastYear || 0
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">
                    Created
                  </div>
                  <div className="text-white text-base font-semibold">
                    {formatDate(selectedClient.CreateAt)}
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
                  View Details
                </button>
                <button
                  onClick={closeRightPanel}
                  className="border-2 border-white text-white flex-1 py-3 rounded-md text-base font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Close
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