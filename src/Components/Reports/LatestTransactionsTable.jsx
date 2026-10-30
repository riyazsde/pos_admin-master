import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Loader2,
  Receipt,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setLatestTransactionsData,
  setLatestTransactionsLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// FORMATTERS
// ---------------------------------------------------------------------------
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

const formatNumber = (value, locale = 'en-US') => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number.toLocaleString(locale) : '0';
};

const getTransactionCaption = (from, to, total, amount, language) => {
  const isFrench = language.startsWith('fr');

  const fromLabel = formatNumber(from, isFrench ? 'fr-FR' : 'en-US');
  const toLabel = formatNumber(to, isFrench ? 'fr-FR' : 'en-US');
  const totalLabel = formatNumber(total, isFrench ? 'fr-FR' : 'en-US');
  const amountLabel = formatNumber(amount, isFrench ? 'fr-FR' : 'en-US');

  if (isFrench) {
    return `Affichage de ${fromLabel}–${toLabel} sur ${totalLabel} transaction${total === 1 ? '' : 's'} · Montant total : ${amountLabel} XOF`;
  }

  return `Showing ${fromLabel}–${toLabel} of ${totalLabel} transaction${total === 1 ? '' : 's'} · Total amount: ${amountLabel} XOF`;
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

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const GRID_COLS =
  '56px minmax(200px,1.4fr) minmax(120px,0.9fr) minmax(140px,1fr) minmax(120px,0.9fr) minmax(110px,0.9fr) minmax(100px,0.8fr)';

const ROW_HEIGHT_PX = 48;
const PAGE_SIZE = 8; // replaces old VISIBLE_ROWS
const HEADER_HEIGHT = 44;
const FOOTER_HEIGHT = 52;
// Original card body was 8 rows + header = 428px. Pagination replaces scroll,
// so we keep a stable MIN so both sibling cards stretch together.
const MIN_BODY_HEIGHT = ROW_HEIGHT_PX * PAGE_SIZE + HEADER_HEIGHT + FOOTER_HEIGHT; // 384 + 44 + 52 = 480

// ---------------------------------------------------------------------------
// PAGINATION HELPER
// ---------------------------------------------------------------------------
const buildPageList = (current, total) => {
  // Show at most 5 page buttons around the current page: 1 … (c-1,c,c+1) … N
  const pages = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i += 1) pages.push(i);
    return pages;
  }

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  pages.push(1);
  if (left > 2) pages.push('…');
  for (let i = left; i <= right; i += 1) pages.push(i);
  if (right < total - 1) pages.push('…');
  pages.push(total);

  return pages;
};

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
function LatestTransactionsTable() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    latestTransactions = [],
    latestTransactionsSummary,
    latestTransactionsLoading,
  } = useAppSelector((state) => state.reports);

  const [page, setPage] = useState(1);

  const hasFetchedPageRef = useRef({}); // page number -> true, avoids duplicate fetches

  useEffect(() => {
    if (hasFetchedPageRef.current[page]) return;
    hasFetchedPageRef.current[page] = true;

    const fetchTransactions = async () => {
      dispatch(setLatestTransactionsLoading(true));

      try {
        const result = await reportService.getLatestTransactions(
          page,
          PAGE_SIZE
        );
        dispatch(setLatestTransactionsData(result));
      } catch (err) {
        console.error('Latest transactions fetch error:', err);
        dispatch(setLatestTransactionsLoading(false));
        // allow retry on same page
        hasFetchedPageRef.current[page] = false;
      }
    };

    fetchTransactions();
  }, [page, dispatch]);

  const hasData = latestTransactions.length > 0;

  const totalCount = Math.max(
    0,
    Number(latestTransactionsSummary?.totalTransactions) || 0
  );

  const totalAmount = latestTransactionsSummary?.totalAmount ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const from = hasData ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = hasData ? (page - 1) * PAGE_SIZE + latestTransactions.length : 0;

  const locale = i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US';

  const subtitle = getTransactionCaption(
    from,
    to,
    totalCount,
    totalAmount,
    i18n.language || 'en'
  );

  const pageList = buildPageList(page, totalPages);

  const goToPage = (next) => {
    if (next < 1 || next > totalPages || next === page) return;
    setPage(next);
  };

  const isLoading = latestTransactionsLoading && !hasData;

  return (
    <div className="w-full h-full flex flex-col font-poppins min-h-0">
      {/* Header */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            {t('reports.latestTransactions.title')}
          </h2>

          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/report')}
          className="group flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-black transition-colors"
        >
          {t('common.seeAll')}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col flex-1 min-h-0">
        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center text-gray-400 gap-3 flex-1"
            style={{ minHeight: MIN_BODY_HEIGHT }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">
              {t('reports.latestTransactions.loading')}
            </span>
          </div>
        ) : !hasData ? (
          <div
            className="flex flex-col items-center justify-center text-gray-400 gap-3 p-8 flex-1"
            style={{ minHeight: MIN_BODY_HEIGHT }}
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
          <>
            {/* Table body — no scroll, no min-height crash: rows are fixed 48px */}
            <div
              className="overflow-x-auto flex-1 min-h-0"
              style={{ minHeight: MIN_BODY_HEIGHT }}
            >
              <div className="min-w-[900px]">
                {/* Table Header */}
                <div
                  className="sticky top-0 z-20 grid items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-50 to-red-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-100"
                  style={{
                    gridTemplateColumns: GRID_COLS,
                    height: HEADER_HEIGHT,
                  }}
                >
                  <span className="sticky left-0 z-30 -mx-2 px-2 bg-purple-50">
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

                {/* Table Rows */}
                {latestTransactions.map((txn, index) => {
                  const globalIndex = from + index - 1;
                  const id = String(globalIndex + 1).padStart(2, '0');
                  const isEven = index % 2 === 0;
                  const statusKey = txn.status?.toLowerCase();

                  return (
                    <div
                      key={txn._id || txn.transagtion_id || index}
                      className={`group grid items-center gap-3 px-5 border-b border-gray-100 last:border-b-0 text-sm text-gray-800 transition-colors ${
                        isEven ? 'bg-white' : 'bg-gray-50/40'
                      } hover:bg-purple-50/60`}
                      style={{
                        gridTemplateColumns: GRID_COLS,
                        height: ROW_HEIGHT_PX,
                      }}
                    >
                      <span
                        className={`sticky left-0 z-10 -mx-2 px-2 h-full flex items-center tabular-nums text-gray-500 font-medium ${
                          isEven ? 'bg-white' : 'bg-gray-50'
                        } group-hover:bg-purple-50`}
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
                        {formatNumber(txn.amount, locale)}{' '}
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
                          />
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

            {/* Pagination Footer */}
            <div
              className="shrink-0 border-t border-gray-100 px-5 flex items-center justify-between gap-3 bg-white"
              style={{ height: FOOTER_HEIGHT }}
            >
              <span className="text-xs text-gray-500 tabular-nums">
                {t('common.page', 'Page')} {page}{' '}
                {t('common.of', 'of')} {totalPages}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1 || latestTransactionsLoading}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label={t('common.previous', 'Previous page')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageList.map((item, idx) =>
                  item === '…' ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="h-8 w-8 flex items-center justify-center text-xs text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      disabled={latestTransactionsLoading}
                      className={`h-8 min-w-[32px] px-2 flex items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors disabled:opacity-40 ${
                        item === page
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages || latestTransactionsLoading}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label={t('common.next', 'Next page')}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LatestTransactionsTable;