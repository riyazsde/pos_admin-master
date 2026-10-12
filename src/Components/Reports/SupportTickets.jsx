import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, LifeBuoy, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSupportTicketsReportData,
  setSupportTicketsReportLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatDate = (iso, locale = 'en-US') => {
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

const getPriorityStyle = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-50 text-red-700 border border-red-100';
    case 'critical':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'low':
      return 'bg-green-50 text-green-700 border border-green-100';
    case 'medium':
    case 'normal':
    default:
      return 'bg-blue-50 text-blue-700 border border-blue-100';
  }
};

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-yellow-50 text-yellow-700';
    case 'resolved':
    case 'closed':
      return 'bg-green-50 text-green-700';
    case 'pending':
      return 'bg-blue-50 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const GRID_COLS =
  '56px minmax(180px,1.4fr) minmax(200px,1.5fr) minmax(120px,0.9fr) minmax(100px,0.8fr) minmax(110px,0.8fr)';

const ROW_HEIGHT_PX = 52;
const VISIBLE_ROWS = 5;
const BODY_HEIGHT = ROW_HEIGHT_PX * VISIBLE_ROWS;

const SupportTickets = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    supportTicketsReport,
    supportTicketsReportPagination,
    supportTicketsReportLoading,
  } = useAppSelector((state) => state.reports);

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchTickets = async () => {
      dispatch(setSupportTicketsReportLoading(true));
      try {
        const result = await reportService.getSupportTicketsReport(1, 20, 'Open');
        dispatch(setSupportTicketsReportData(result));
      } catch (err) {
        console.error('Support tickets fetch error:', err);
        dispatch(setSupportTicketsReportLoading(false));
        toast.error(t('reports.supportTickets.loadFailed'), {
          description:
            err?.response?.data?.message ||
            err?.message ||
            t('reports.supportTickets.loadFailedDesc'),
        });
      }
    };

    fetchTickets();
  }, [dispatch, t]);

  const hasData = supportTicketsReport.length > 0;
  const totalCount =
    supportTicketsReportPagination?.total || supportTicketsReport.length || 0;

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  // Issue preview with localized "no subject"
  const getIssuePreview = (ticket) => {
    const text =
      ticket.subject || ticket.issue || t('reports.supportTickets.noSubject');
    const cleaned = text.replace(/\n+/g, ' ').trim();
    return cleaned.length > 30 ? `${cleaned.slice(0, 30)}...` : cleaned;
  };

  // Localized priority label
  const getPriorityLabel = (priority) => {
    const key = priority?.toLowerCase();
    if (!key) return '—';
    return t(`reports.supportTickets.priority.${key}`, priority);
  };

  // Localized status label
  const getStatusLabel = (status) => {
    const key = status?.toLowerCase();
    if (!key) return '—';
    return t(`reports.supportTickets.status.${key}`, status);
  };

  const handleResolve = (ticket) => {
    toast.success(t('reports.supportTickets.resolveSuccess'), {
      description: t('reports.supportTickets.resolveSuccessDesc', {
        id: ticket.ticketId,
        business: ticket.businessName,
      }),
    });
  };

  return (
    <div className="w-full h-full flex flex-col font-poppins">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start w-full shrink-0 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black">
            {t('reports.supportTickets.title')}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {t('reports.supportTickets.subtitle', { count: totalCount })}
          </p>
        </div>
        <button
          onClick={() => navigate('/supports')}
          className="group flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-black transition-colors"
        >
          {t('common.seeAll')}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ---------- Card ---------- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
        {supportTicketsReportLoading && !hasData ? (
          <div
            className="flex flex-col items-center justify-center text-gray-400 gap-3"
            style={{ height: BODY_HEIGHT + 44 }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">
              {t('reports.supportTickets.loading')}
            </span>
          </div>
        ) : !hasData ? (
          <div
            className="flex flex-col items-center justify-center text-gray-400 gap-3 p-8"
            style={{ height: BODY_HEIGHT + 44 }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {t('reports.supportTickets.noData')}
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {t('reports.supportTickets.noDataDesc')}
            </p>
          </div>
        ) : (
          <div
            className="overflow-auto reports-scroll"
            style={{ height: BODY_HEIGHT + 44 }}
          >
            <div className="min-w-[860px]">
              {/* ---- Sticky header ---- */}
              <div
                className="sticky top-0 z-20 grid items-center gap-3 px-5 py-3
                           bg-gradient-to-r from-purple-50 to-red-50
                           text-gray-600 text-xs font-semibold uppercase tracking-wider
                           border-b border-gray-100"
                style={{ gridTemplateColumns: GRID_COLS, height: 44 }}
              >
                <span className="sticky left-0 z-30 -mx-2 px-2 bg-gradient-to-r from-purple-50 to-purple-50">
                  {t('reports.supportTickets.table.hash')}
                </span>
                <span>{t('reports.supportTickets.table.businessName')}</span>
                <span>{t('reports.supportTickets.table.issue')}</span>
                <span>{t('reports.supportTickets.table.date')}</span>
                <span className="text-center">
                  {t('reports.supportTickets.table.priority')}
                </span>
                <span className="text-center">
                  {t('reports.supportTickets.table.status')}
                </span>
              </div>

              {/* ---- Rows ---- */}
              {supportTicketsReport.map((ticket, index) => {
                const id = String(index + 1).padStart(2, '0');
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={ticket.ticketId || index}
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
                      className="font-medium text-gray-800 truncate"
                      title={ticket.businessName}
                    >
                      {ticket.businessName || '—'}
                    </span>

                    <span
                      className="text-red-500 font-medium truncate"
                      title={ticket.subject}
                    >
                      {getIssuePreview(ticket)}
                    </span>

                    <span className="text-gray-600 tabular-nums">
                      {formatDate(ticket.createdDate, locale)}
                    </span>

                    <span className="flex justify-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getPriorityStyle(
                          ticket.priority
                        )}`}
                      >
                        {getPriorityLabel(ticket.priority)}
                      </span>
                    </span>

                    <span className="flex justify-center">
                      <button
                        onClick={() => handleResolve(ticket)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold transition-opacity hover:opacity-90 ${getStatusStyle(
                          ticket.status
                        )}`}
                      >
                        {ticket.status === 'Open'
                          ? t('reports.supportTickets.resolve')
                          : getStatusLabel(ticket.status)}
                      </button>
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
};

export default SupportTickets;