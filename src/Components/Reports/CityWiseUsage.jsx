import React, { useEffect, useRef } from 'react';
import { Loader2, MapPin, Building2 } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setCityWiseUsageData,
  setCityWiseUsageLoading,
} from '../../Store/Features/reports/reportsSlice';
import { reportService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Format number
const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
};

// Classify consumption level based on restaurants count
// You can tweak the thresholds based on your business logic
const getConsumptionType = (count, maxCount) => {
  if (maxCount <= 0) return 'Low';
  const ratio = count / maxCount;
  return ratio >= 0.6 ? 'Good' : 'Low';
};

// Compute bar height (pixels) — max height = 140px
const getBarHeight = (count, maxCount) => {
  if (maxCount <= 0) return 15;
  const MIN_H = 15;
  const MAX_H = 140;
  const ratio = count / maxCount;
  return Math.max(MIN_H, ratio * MAX_H);
};

// Human-readable city label
const getCityLabel = (city) => {
  if (!city) return 'Unknown';
  return String(city).trim();
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const CityWiseUsage = () => {
  const dispatch = useAppDispatch();

  const {
    cityWiseUsage,
    cityWiseUsageSummary,
    cityWiseUsageLoading,
  } = useAppSelector((state) => state.reports);

  // ✅ Fetch once
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchUsage = async () => {
      dispatch(setCityWiseUsageLoading(true));
      try {
        const result = await reportService.getCityWiseUsage(1, 20);
        dispatch(setCityWiseUsageData(result));
      } catch (err) {
        console.error('City-wise usage fetch error:', err);
        dispatch(setCityWiseUsageLoading(false));
      }
    };

    fetchUsage();
  }, [dispatch]);

  // ✅ Build chart data from API response
  const data = (cityWiseUsage || []).map((item) => ({
    city: getCityLabel(item.cityName),
    value: item.totalRestaurants ?? 0,
    subscriptions: item.totalSubscriptions ?? 0,
    activeSubscriptions: item.activeSubscriptions ?? 0,
    revenue: item.totalRevenue ?? 0,
  }));

  const maxValue = data.length ? Math.max(...data.map((d) => d.value), 1) : 1;

  // Enrich with type
  const enriched = data.map((d) => ({
    ...d,
    type: getConsumptionType(d.value, maxValue),
  }));

  const hasData = enriched.length > 0;

  return (
    <div className="w-full px-4 md:px-10 py-6">
      <div className="flex flex-col gap-4 w-full">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-black">
              City Wise Usage{' '}
              <span className="text-gray-400 font-medium">(Report)</span>
            </h2>
            {cityWiseUsageSummary && (
              <p className="text-xs text-gray-500 mt-1">
                {cityWiseUsageSummary.totalCities} cit
                {cityWiseUsageSummary.totalCities !== 1 ? 'ies' : 'y'} ·{' '}
                {cityWiseUsageSummary.totalRestaurants} restaurants · avg{' '}
                {cityWiseUsageSummary.avgRestaurantsPerCity}/city
              </p>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="w-full bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.06),inset_0px_0px_1px_rgba(0,0,0,0.15)] rounded-[25px] p-6 relative">
          {/* Legend */}
          <div className="flex gap-6 sm:absolute sm:right-6 sm:top-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-[#FF955A]"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Low consumption
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-[#344BFD]"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Good consumption
              </span>
            </div>
          </div>

          {/* Body */}
          {cityWiseUsageLoading && !hasData ? (
            <div className="mt-20 h-[200px] flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span className="text-sm">Loading city data…</span>
            </div>
          ) : !hasData ? (
            <div className="mt-20 h-[200px] flex flex-col items-center justify-center text-gray-400 gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                No city data available
              </p>
              <p className="text-xs text-gray-400 text-center max-w-xs">
                City-wise usage will appear here once restaurants are onboarded.
              </p>
            </div>
          ) : (
            /* Scrollable bar chart */
            <div className="mt-20 w-full overflow-x-auto reports-scroll">
              <div className="min-w-fit flex items-end gap-4 px-2 pb-2">
                {enriched.map((item, index) => {
                  const barHeight = getBarHeight(item.value, maxValue);
                  const isGood = item.type === 'Good';

                  return (
                    <div
                      key={`${item.city}-${index}`}
                      className="flex flex-col items-center w-12 shrink-0 group"
                      title={`${item.city}: ${item.value} restaurants, ${item.activeSubscriptions} active subscriptions`}
                    >
                      {/* Value */}
                      <div className="text-sm mb-1 font-semibold text-gray-800 tabular-nums">
                        {formatNumber(item.value)}
                      </div>

                      {/* Bar */}
                      <div
                        className={`w-4 rounded-md transition-all duration-300 group-hover:opacity-80 ${
                          isGood ? 'bg-[#344BFD]' : 'bg-[#FF955A]'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      ></div>

                      {/* City label */}
                      <div
                        className="mt-2 text-[11px] font-semibold text-gray-700 truncate w-full text-center"
                        title={item.city}
                      >
                        {item.city}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom summary (optional) */}
          {hasData && (
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-purple-500" />
                <span>
                  Total restaurants:{' '}
                  <span className="font-bold text-gray-800">
                    {formatNumber(
                      enriched.reduce((sum, d) => sum + d.value, 0)
                    )}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#344BFD]" />
                <span>
                  Good:{' '}
                  <span className="font-bold text-gray-800">
                    {enriched.filter((d) => d.type === 'Good').length}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF955A]" />
                <span>
                  Low:{' '}
                  <span className="font-bold text-gray-800">
                    {enriched.filter((d) => d.type === 'Low').length}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
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

export default CityWiseUsage;