// src/Components/Dashboard/TopPerformers.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setTopPerformersData,
  setTopPerformersLoading,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';

const TopPerformers = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { topPerformers, topPerformersLoading } = useAppSelector(
    (state) => state.dashboard
  );

  // ✅ Fetch when page changes
  useEffect(() => {
    const fetchPerformers = async () => {
      dispatch(setTopPerformersLoading(true));
      try {
        const result = await dashboardService.getTopPerformers(
          currentPage,
          itemsPerPage
        );
        dispatch(setTopPerformersData(result));
      } catch (err) {
        console.error('Top performers fetch error:', err);
        dispatch(setTopPerformersLoading(false));
      }
    };

    fetchPerformers();
  }, [dispatch, currentPage]);

  // ✅ Loading skeleton
  if (topPerformersLoading && (!topPerformers || topPerformers.length === 0)) {
    return (
      <div className="h-full flex flex-col gap-4 min-w-0 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">
            {t('topPerformers.title')}
          </h2>
        </div>
        <div className="flex-1 bg-white rounded-3xl shadow-md border border-gray-100 p-4 animate-pulse min-h-0">
          <div className="h-8 bg-gray-100 rounded mb-2"></div>
          <div className="h-8 bg-gray-100 rounded mb-2"></div>
          <div className="h-8 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  const hasData = topPerformers && topPerformers.length > 0;

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
      return new Date(iso).toLocaleDateString(locale);
    } catch {
      return '—';
    }
  };

  const handleNext = () => {
    if (topPerformers.length === itemsPerPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 min-w-0 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold text-black">
          {t('topPerformers.title')}
        </h2>
        <button
          onClick={() => navigate('/top-performers-list')}
          className="text-sm font-semibold text-black hover:underline"
        >
          {t('common.seeAll')}
        </button>
      </div>

      {/* Card — constrained height, hidden overflow */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden min-h-0">
        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Trophy className="w-10 h-10 text-gray-300" />
            <p className="text-sm">{t('topPerformers.noData')}</p>
          </div>
        ) : (
          <>
            {/* Scrollable table area */}
            <div
              className="flex-1 overflow-x-auto overflow-y-auto min-h-0
                [&::-webkit-scrollbar]:h-1.5
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-[#F3E8F5]
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gradient-to-r
                [&::-webkit-scrollbar-thumb]:from-[#B934D8]
                [&::-webkit-scrollbar-thumb]:to-[#E91E63]
                [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              <div className="min-w-[760px] flex flex-col">
                {/* Header Row */}
                <div className="grid grid-cols-7 bg-gradient-to-r from-[#F3E8F5] to-[#FBE9EC] text-black/70 font-semibold text-sm px-4 py-3 sticky top-0 z-10">
                  <div>#</div>
                  <div>{t('topPerformers.table.companyName')}</div>
                  <div>{t('topPerformers.table.subscription')}</div>
                  <div>{t('topPerformers.table.deviceCount')}</div>
                  <div>{t('topPerformers.table.totalSales')}</div>
                  <div>{t('topPerformers.table.rank')}</div>
                  <div>{t('topPerformers.table.renewalDate')}</div>
                </div>

                {/* Data Rows */}
                {topPerformers.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-7 items-center px-4 py-2.5 text-sm text-black border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-500">
                      {item['#'] || '—'}
                    </div>
                    <div className="font-medium text-gray-800">
                      {item.companyName || t('topPerformers.unnamedCompany')}
                    </div>
                    <div className="text-gray-700">
                      {item.subscriptionCount ?? 0}
                    </div>
                    <div className="text-gray-700">—</div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-green-600 font-medium">
                        {item.salesFormatted || `${item.totalSales ?? 0} XOF`}
                      </span>
                    </div>
                    <div className="font-medium text-gray-700">
                      {item.rank === -1 ? (
                        <span className="text-gray-400">
                          {t('topPerformers.unranked')}
                        </span>
                      ) : (
                        `#${item.rank}`
                      )}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatDate(item.renewalDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Footer — fixed at bottom */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
              <span className="text-xs text-gray-500">
                Page {currentPage}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md border ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:bg-white hover:border-gray-400'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={topPerformers.length < itemsPerPage}
                  className={`p-1 rounded-md border ${
                    topPerformers.length < itemsPerPage
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:bg-white hover:border-gray-400'
                  }`}
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
};

export default TopPerformers;