import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users, Search, ChevronRight } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setActiveClientsData,
  setActiveClientsLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
  } catch {
    return '—';
  }
};

const ActiveClients = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { activeClients, activeClientsLoading, activeClientsPagination } =
    useAppSelector((state) => state.reports);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchClients = async () => {
      dispatch(setActiveClientsLoading(true));
      try {
        const result = await reportService.getActiveClients(1, 10);
        dispatch(setActiveClientsData(result));
      } catch (err) {
        console.error('Active clients fetch error:', err);
        dispatch(setActiveClientsLoading(false));
      }
    };

    fetchClients();
  }, [dispatch]);

  const totalCount = activeClientsPagination?.total || activeClients.length;

  return (
    <div className="w-full h-full flex flex-col">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="font-poppins font-bold text-2xl text-black">
            Active Clients
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {totalCount} client{totalCount !== 1 ? 's' : ''} active
          </p>
        </div>
        <button
          onClick={() => navigate('/clients')}
          className="group flex items-center gap-1 font-poppins font-semibold text-sm text-gray-700 hover:text-black transition-colors"
        >
          See all
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ---------- Card ---------- */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col min-h-0">
        {activeClientsLoading && activeClients.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">Loading active clients…</span>
          </div>
        ) : activeClients.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 p-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No active clients
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Active clients will appear here.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* ---------- Table Header (sticky) ---------- */}
            <div
              className="shrink-0 grid [grid-template-columns:56px_1.4fr_1.2fr_1fr_90px] items-center gap-3 px-5 py-3
                         bg-gradient-to-r from-purple-50 to-red-50 text-gray-600 text-xs font-semibold uppercase tracking-wider"
            >
              <span>#</span>
              <span>Business Name</span>
              <span>Plan</span>
              <span>Purchased</span>
              <span className="text-center">Status</span>
            </div>

            {/* ---------- Scrollable body ---------- */}
            <div className="flex-1 overflow-y-auto min-h-0 reports-scroll">
              {activeClients.map((client, index) => {
                const id = String(index + 1).padStart(2, '0');
                return (
                  <div
                    key={client.user_id || index}
                    className="grid [grid-template-columns:56px_1.4fr_1.2fr_1fr_90px] items-center gap-3
                               px-5 py-3 border-b border-gray-100 last:border-b-0
                               text-sm text-gray-800 hover:bg-purple-50/40 transition-colors"
                  >
                    <span className="text-gray-500 font-medium tabular-nums">
                      {id}
                    </span>
                    <span
                      className="font-medium truncate"
                      title={client.businessName}
                    >
                      {client.businessName || '—'}
                    </span>
                    <span className="text-gray-600 truncate">
                      {client.planPurchased || 'No Plan'}
                    </span>
                    <span className="text-gray-600 tabular-nums">
                      {formatDate(client.purchasedDate)}
                    </span>
                    <span className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {client.status || 'Active'}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .reports-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .reports-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .reports-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #b934d8, #e91e63);
          border-radius: 9999px;
        }
        .reports-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #6a1b9a, #d32f2f);
        }
      `}</style>
    </div>
  );
};

export default ActiveClients;