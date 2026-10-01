import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShoppingBag, ChevronRight } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSubscriptionSalesData,
  setSubscriptionSalesLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

// Format ISO date → "DD/MM/YYYY"
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

const formatAmount = (amount, currency = 'XOF') => {
  if (amount === null || amount === undefined) return '—';
  return `${Number(amount).toLocaleString('en-US')} ${currency}`;
};

function SubscriptionTable() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { subscriptionSales, subscriptionSalesLoading } = useAppSelector(
    (state) => state.reports
  );

  // ✅ Fetch once (same endpoint as the chart — shared cache)
  const hasFetched = useRef(false);
  useEffect(() => {
    if (subscriptionSales || hasFetched.current) return;
    hasFetched.current = true;

    const fetchSales = async () => {
      dispatch(setSubscriptionSalesLoading(true));
      try {
        const now = new Date();
        const data = await reportService.getSubscriptionSales(
          now.getMonth() + 1,
          now.getFullYear()
        );
        dispatch(setSubscriptionSalesData(data));
      } catch (err) {
        console.error('Subscription sales fetch error:', err);
        dispatch(setSubscriptionSalesLoading(false));
      }
    };

    fetchSales();
  }, [dispatch, subscriptionSales]);

  // ✅ Prefer topSales; fall back to topPlans
  const rawRows =
    subscriptionSales?.topSales?.length > 0
      ? subscriptionSales.topSales
      : subscriptionSales?.topPlans || [];

  const rows = rawRows.map((item, index) => ({
    id: String(index + 1).padStart(2, '0'),
    businessName:
      item.businessName || item.companyName || item.name || '—',
    planPurchased: item.planName || item.planPurchased || 'No Plan',
    purchasedDate: formatDate(item.purchasedDate || item.date || item.createdAt),
    amount: item.amount
      ? formatAmount(item.amount, item.currency)
      : item.totalRevenue
      ? formatAmount(item.totalRevenue, 'XOF')
      : '—',
  }));

  const hasData = rows.length > 0;

  return (
    <div className="w-full h-full flex flex-col font-poppins">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Subscription Sales
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Latest subscription purchases
          </p>
        </div>
        <button
          onClick={() => navigate('/subscription-list')}
          className="group flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-black transition-colors"
        >
          See all
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ---------- Card ---------- */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col min-h-0">
        {subscriptionSalesLoading && !hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">Loading subscriptions…</span>
          </div>
        ) : !hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 p-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No subscription sales
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Subscription purchases will appear here.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Header row */}
            <div
              className="shrink-0 grid [grid-template-columns:56px_1.4fr_1.2fr_1fr_110px] items-center gap-3 px-5 py-3
                         bg-gradient-to-r from-purple-50 to-red-50 text-gray-600 text-xs font-semibold uppercase tracking-wider"
            >
              <span>#</span>
              <span>Business</span>
              <span>Plan</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto min-h-0 reports-scroll">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid [grid-template-columns:56px_1.4fr_1.2fr_1fr_110px] items-center gap-3
                             px-5 py-3 border-b border-gray-100 last:border-b-0
                             text-sm text-gray-800 hover:bg-purple-50/40 transition-colors"
                >
                  <span className="text-gray-500 font-medium tabular-nums">
                    {row.id}
                  </span>
                  <span className="font-medium truncate" title={row.businessName}>
                    {row.businessName}
                  </span>
                  <span className="text-gray-600 truncate">
                    {row.planPurchased}
                  </span>
                  <span className="text-gray-600 tabular-nums">
                    {row.purchasedDate}
                  </span>
                  <span className="text-right font-bold text-green-600 tabular-nums">
                    {row.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
}

export default SubscriptionTable;