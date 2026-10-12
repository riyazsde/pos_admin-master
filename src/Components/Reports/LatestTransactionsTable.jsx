import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, Receipt, ChevronRight } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setLatestTransactionsData,
  setLatestTransactionsLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

// Format ISO date → localized
const formatDate = (iso, locale = 'en-US') => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return '—';
  }
};

const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
};

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'success':
      return 'bg-green-50 text-green-700';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700';
    case 'failed':
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getStatusDot = (status) => {
  switch (status?.toLowerCase()) {
    case 'success':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

const GRID_COLS =
  '56px minmax(200px,1.4fr) minmax(120px,0.9fr) minmax(140px,1fr) minmax(120px,0.9fr) minmax(110px,0.9fr) minmax(100px,0.8fr)';

const ROW_HEIGHT_PX = 48;
const VISIBLE_ROWS = 8;
const BODY_HEIGHT = ROW_HEIGHT_PX * VISIBLE_ROWS;

function LatestTransactionsTable() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    latestTransactions,
    latestTransactionsSummary,
    latestTransactionsLoading,
  } = useAppSelector((state) => state.reports);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchTransactions = async () => {
      dispatch(setLatestTransactionsLoading(true));
      try {
        const result = await reportService.getLatestTransactions(1, 20);
        dispatch(setLatestTransactionsData(result));
      } catch (err) {
        console.error('Latest transactions fetch error:', err);
        dispatch(setLatestTransactionsLoading(false));
      }
    };

    fetchTransactions();
  }, [dispatch]);

  const hasData = latestTransactions.length > 0;
  const totalCount = latestTransactionsSummary?.totalTransactions || 0;

  // Determine locale from i18n language
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <div className="w-full h-full flex flex-col font-poppins">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            {t('reports.latestTransactions.title')}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {t('reports.latestTransactions.subtitle', {
              shown: Math.min(VISIBLE_ROWS, latestTransactions.length),
              total: totalCount,
              amount: formatNumber(latestTransactionsSummary?.totalAmount || 0),
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/report')}
          className="group flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-black transition-colors"
        >
          {t('common.seeAll')}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ---------- Card ---------- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
        {latestTransactionsLoading && !hasData ? (
          <div
            className="flex flex-col items-center justify-center text-gray-400 gap-3"
            style={{ height: BODY_HEIGHT + 44 }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">
              {t('reports.latestTransactions.loading')}
            </span>
          </div>
        ) : !hasData ? (
          <div
            className="flex flex-col items-center justify-center text-gray-400 gap-3 p-8"
            style={{ height: BODY_HEIGHT + 44 }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {t('reports.latestTransactions.noData')}
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {t('reports.latestTransactions.noDataDesc')}
            </p>
          </div>
        ) : (
          <div
            className="overflow-auto reports-scroll"
            style={{ height: BODY_HEIGHT + 44 }}
          >
            <div className="min-w-[900px]">
              {/* ---- Sticky header row ---- */}
              <div
                className="sticky top-0 z-20 grid items-center gap-3 px-5 py-3
                           bg-gradient-to-r from-purple-50 to-red-50
                           text-gray-600 text-xs font-semibold uppercase tracking-wider
                           border-b border-gray-100"
                style={{ gridTemplateColumns: GRID_COLS, height: 44 }}
              >
                <span className="sticky left-0 z-30 -mx-2 px-2 bg-gradient-to-r from-purple-50 to-purple-50">
                  {t('reports.latestTransactions.table.hash')}
                </span>
                <span>{t('reports.latestTransactions.table.reference')}</span>
                <span>{t('reports.latestTransactions.table.date')}</span>
                <span>{t('reports.latestTransactions.table.type')}</span>
                <span>{t('reports.latestTransactions.table.method')}</span>
                <span className="text-right">
                  {t('reports.latestTransactions.table.amount')}
                </span>
                <span className="text-center">
                  {t('reports.latestTransactions.table.status')}
                </span>
              </div>

              {/* ---- Rows ---- */}
              {latestTransactions.map((txn, index) => {
                const id = String(index + 1).padStart(2, '0');
                const isEven = index % 2 === 0;
                const statusKey = txn.status?.toLowerCase();

                return (
                  <div
                    key={txn._id || txn.transagtion_id || index}
                    className={`group grid items-center gap-3 px-5 border-b border-gray-100 last:border-b-0
                               text-sm text-gray-800 transition-colors
                               ${isEven ? 'bg-white' : 'bg-gray-50/40'}
                               hover:bg-purple-50/60`}
                    style={{
                      gridTemplateColumns: GRID_COLS,
                      height: ROW_HEIGHT_PX,
                    }}
                  >
                    <span
                      className={`sticky left-0 z-10 -mx-2 px-2 h-full flex items-center tabular-nums text-gray-500 font-medium
                                  ${isEven ? 'bg-white' : 'bg-gray-50'}
                                  group-hover:bg-purple-50`}
                    >
                      {id}
                    </span>

                    <span
                      className="font-medium truncate text-gray-700"
                      title={txn.reference_number}
                    >
                      {txn.reference_number || '—'}
                    </span>

                    <span className="text-gray-600 tabular-nums truncate">
                      {formatDate(
                        txn.transaction_date || txn.created_at,
                        locale
                      )}
                    </span>

                    <span className="text-gray-600 truncate">
                      {(txn.transactionType || '—').replace(/_/g, ' ')}
                    </span>

                    <span className="text-gray-600 truncate">
                      {txn.payment_method || '—'}
                    </span>

                    <span className="text-right font-bold text-gray-900 tabular-nums">
                      {formatNumber(txn.amount)}{' '}
                      <span className="text-xs text-gray-500 font-medium">
                        XOF
                      </span>
                    </span>

                    <span className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyle(
                          txn.status
                        )}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                            txn.status
                          )}`}
                        ></span>
                        {txn.status
                          ? t(
                              `reports.latestTransactions.status.${statusKey}`,
                              txn.status
                            )
                          : '—'}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .reports-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .reports-scroll::-webkit-scrollbar-track {
          background: #f5f5f7;
          border-radius: 8px;
        }
        .reports-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #b934d8, #e91e63);
          border-radius: 8px;
        }
        .reports-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #6a1b9a, #d32f2f);
        }
        .reports-scroll::-webkit-scrollbar-corner {
          background: transparent;
        }
        .reports-scroll {
          scrollbar-width: thin;
          scrollbar-color: #b934d8 #f5f5f7;
        }
      `}</style>
    </div>
  );
}

export default LatestTransactionsTable;