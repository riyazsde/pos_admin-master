// src/Components/Dashboard/SubscriptionsPurchased.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSubscriptionsData,
  setSubscriptionsLoading,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';
import { getPlanInfo } from '../../utils/dashboardMaps';

const SubscriptionsPurchased = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  // Local pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { subscriptions, subscriptionsLoading } = useAppSelector(
    (state) => state.dashboard
  );

  // ✅ Fetch when page changes
  useEffect(() => {
    const fetchSubscriptions = async () => {
      dispatch(setSubscriptionsLoading(true));
      try {
        // Pass page and limit to API
        const result = await dashboardService.getSubscriptions(
          currentPage,
          itemsPerPage
        );
        dispatch(setSubscriptionsData(result));
      } catch (err) {
        console.error('Subscriptions fetch error:', err);
        dispatch(setSubscriptionsLoading(false));
      }
    };

    fetchSubscriptions();
  }, [dispatch, currentPage]);

  // ✅ Locale-aware date
  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-GB';
      return new Date(iso).toLocaleDateString(locale);
    } catch {
      return '—';
    }
  };

  // ✅ Transform API data → table rows
  const rows = subscriptions.map((sub, idx) => {
    const plan = getPlanInfo(sub.Admin_Plan_id);

    return {
      id: String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, '0'),
      business: `${t('subscriptions.planLabel')} #${sub.Admin_Plan_id}`,
      plan: plan.name,
      date: formatDate(sub.createdAt || sub.CreateAt),
      amount: `${plan.amount} ${plan.currency}`,
      isActive: sub.isActive,
      paymentStatus: sub.paymentStatus,
    };
  });

  // Pagination handlers
  const handleNext = () => {
    if (subscriptions.length === itemsPerPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // ✅ Loading skeleton
  if (subscriptionsLoading && rows.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">
            {t('subscriptions.activeTitle')}
          </h2>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-9 bg-gray-100 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-50 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">
          {t('subscriptions.activeTitle')}
        </h2>
        <div
          className="text-xs font-bold text-black hover:text-blue-600 cursor-pointer transition-colors"
          onClick={() => navigate('/subscription-list')}
        >
          {t('common.seeAll')}
        </div>
      </div>

      {/* Empty state */}
      {rows.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 py-10">
          <CreditCard className="w-8 h-8 text-gray-300" />
          <p className="text-xs">{t('subscriptions.noData')}</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Scrollable Table Area */}
          <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
            <div className="min-w-[600px] w-full">
              {/* Table Header */}
              <div className="grid grid-cols-5 bg-[#F9F5F6] rounded-t-xl text-xs font-semibold text-gray-500 py-3 px-4 sticky top-0 z-10">
                <div className="text-center">#</div>
                <div className="text-left pl-2">
                  {t('subscriptions.table.businessName')}
                </div>
                <div className="text-left pl-2">
                  {t('subscriptions.table.planPurchased')}
                </div>
                <div className="text-center">
                  {t('subscriptions.table.purchasedDate')}
                </div>
                <div className="text-right pr-4">
                  {t('subscriptions.table.amount')}
                </div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {rows.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 items-center border-b border-gray-100 py-3 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <div className="text-center font-semibold">{item.id}</div>
                    <div className="text-left pl-2 font-semibold text-gray-800">
                      {item.business}
                    </div>
                    <div className="text-left pl-2">{item.plan}</div>
                    <div className="text-center">{item.date}</div>
                    <div className="text-right pr-4 text-green-500 font-bold">
                      {item.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 shrink-0">
            <span className="text-xs text-gray-500 font-['Poppins']">
              Page {currentPage}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`p-1 rounded-md border ${
                  currentPage === 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={subscriptions.length < itemsPerPage}
                className={`p-1 rounded-md border ${
                  subscriptions.length < itemsPerPage
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPurchased;