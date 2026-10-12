import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, ChevronRight, Loader2 } from 'lucide-react';

import { useAppSelector } from '../../Store/hooks';

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

const GRID_COLS =
  '56px minmax(180px,1.6fr) minmax(160px,1.4fr) minmax(130px,1fr) minmax(120px,1fr)';

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
function HardwareSold() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { monthlyBreakdown, loading, hasLoaded } = useAppSelector(
    (state) => state.posHardware
  );

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  const getDeviceLabel = (d) => {
    if (!d) return t('posHardware.deviceLabels.device');
    if (typeof d.device === 'string') return d.device;
    if (typeof d.deviceName === 'string') return d.deviceName;
    if (typeof d.hardwareType === 'string') return d.hardwareType;
    return t('posHardware.deviceLabels.device');
  };

  const rows = (monthlyBreakdown || []).flatMap((item, monthIdx) => {
    const detailed =
      item.soldDevices || item.items || item.hardwareList || null;

    if (Array.isArray(detailed) && detailed.length > 0) {
      return detailed.map((d, idx) => ({
        id: `${monthIdx}-${idx}-${d.id || ''}`,
        businessName:
          d.businessName || d.Business_Name || d.companyName || '—',
        planPurchased:
          d.planPurchased || d.planName || d.Plan?.PlanName || '—',
        purchasedDate: formatDate(
          d.purchasedDate || d.date || d.Purchase_Date || null,
          locale
        ),
        device: getDeviceLabel(d),
      }));
    }

    const monthLabel =
      item.month || item.monthName || `Month ${monthIdx + 1}`;
    const count = item.count ?? item.sales ?? 0;

    return [
      {
        id: `month-${monthIdx}`,
        businessName: monthLabel,
        planPurchased: '—',
        purchasedDate: '—',
        device: t('posHardware.deviceLabels.sold', { count }),
      },
    ];
  });

  const hasData = rows.length > 0;
  const totalCount = rows.length;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start w-full mb-4 px-1 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-black">
            {t('posHardware.hardwareSold.title')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('posHardware.hardwareSold.records', { count: totalCount })}
          </p>
        </div>
        <button
          onClick={() => navigate('/pos-device-history')}
          className="group flex items-center gap-1 text-sm sm:text-base font-semibold text-black hover:underline"
        >
          {t('common.seeAll')}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
        {loading && !hasLoaded ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">
              {t('posHardware.hardwareSold.loading')}
            </span>
          </div>
        ) : !hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 p-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {t('posHardware.hardwareSold.noData')}
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {t('posHardware.hardwareSold.noDataDesc')}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Sticky header */}
            <div
              className="shrink-0 grid items-center gap-3 px-6 py-3
                         bg-gradient-to-r from-purple-50 to-red-50
                         text-gray-600 text-xs font-semibold uppercase tracking-wider
                         border-b border-gray-100"
              style={{ gridTemplateColumns: GRID_COLS, height: 48 }}
            >
              <span className="sticky left-0 z-30 -mx-2 px-2 bg-gradient-to-r from-purple-50 to-purple-50">
                {t('posHardware.hardwareSold.table.hash')}
              </span>
              <span>{t('posHardware.hardwareSold.table.businessName')}</span>
              <span>{t('posHardware.hardwareSold.table.planPurchased')}</span>
              <span>{t('posHardware.hardwareSold.table.purchasedDate')}</span>
              <span className="text-right pr-2">
                {t('posHardware.hardwareSold.table.device')}
              </span>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto min-h-0 reports-scroll">
              {rows.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className={`grid items-center gap-3 px-6 border-b border-gray-100 last:border-b-0
                               text-sm text-gray-800 transition-colors
                               ${isEven ? 'bg-white' : 'bg-gray-50/40'}
                               hover:bg-purple-50/40`}
                    style={{ gridTemplateColumns: GRID_COLS, height: 52 }}
                  >
                    <span
                      className={`sticky left-0 z-10 -mx-2 px-2 h-full flex items-center tabular-nums text-gray-500 font-medium
                                  ${isEven ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="font-medium text-gray-800 truncate"
                      title={item.businessName}
                    >
                      {item.businessName}
                    </span>
                    <span
                      className="text-gray-600 truncate"
                      title={item.planPurchased}
                    >
                      {item.planPurchased}
                    </span>
                    <span className="text-gray-600 tabular-nums">
                      {item.purchasedDate}
                    </span>
                    <span
                      className="text-right pr-2 font-bold text-green-600 truncate"
                      title={item.device}
                    >
                      {item.device}
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
        .reports-scroll {
          scrollbar-width: thin;
          scrollbar-color: #b934d8 transparent;
        }
      `}</style>
    </div>
  );
}

export default HardwareSold;