// src/Components/Dashboard/SubscriptionRenewalAlert.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setRenewalAlertsData,
  setRenewalAlertsLoading,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';

const SubscriptionRenewalAlert = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Keep in sync with your API limit

  const { renewalAlerts, renewalAlertsLoading } = useAppSelector(
    (state) => state.dashboard
  );

  // ✅ Locale-aware date formatting
  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
      return new Date(iso).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  // Check if a renewal date is within the next 7 days
  const isUrgent = (iso) => {
    if (!iso) return false;
    const diff = new Date(iso).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  };

  // ✅ Fetch when page changes
  useEffect(() => {
    const fetchRenewals = async () => {
      dispatch(setRenewalAlertsLoading(true));
      try {
        // Pass currentPage and itemsPerPage to API
        const result = await dashboardService.getRenewalAlerts(
          currentPage,
          itemsPerPage
        );
        dispatch(setRenewalAlertsData(result));
      } catch (err) {
        console.error('Renewal alerts fetch error:', err);
        dispatch(setRenewalAlertsLoading(false));
      }
    };

    fetchRenewals();
  }, [dispatch, currentPage]);

  // ✅ Handle "Send Alert" click
  const handleSendAlert = (subscription) => {
    toast.success(t('dashboard.alertSent'), {
      description: t('dashboard.alertSentDesc', {
        business: subscription.businessName,
      }),
      duration: 2500,
    });
  };

  // Pagination handlers
  const handleNext = () => {
    if (renewalAlerts.length === itemsPerPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // ✅ Loading skeleton
  if (renewalAlertsLoading && renewalAlerts.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-black font-['Poppins']">
            {t('dashboard.subscriptionRenewalAlert')}
          </h2>
        </div>
        <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm overflow-hidden h-[400px] flex flex-col animate-pulse">
          <div className="bg-gradient-to-r from-[#F3E5F5] to-[#FFEBEE] px-6 py-5 h-16"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-6 py-5 border-b border-gray-100">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasData = renewalAlerts && renewalAlerts.length > 0;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-black font-['Poppins']">
          {t('dashboard.subscriptionRenewalAlert')}
        </h2>
        <button
          className="text-xs sm:text-sm font-semibold text-black font-['Poppins'] hover:underline"
          onClick={() => navigate('/subscription-list')}
        >
          {t('common.seeAll')}
        </button>
      </div>

      {/* Table Container - Fixed Height */}
      <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm overflow-hidden h-[400px] flex flex-col">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-[#F3E5F5] to-[#FFEBEE] px-6 sm:px-8 py-5 border-b border-gray-100 shrink-0">
          <div className="grid grid-cols-12 gap-4 items-center">
            <span className="col-span-2 text-xs sm:text-sm font-semibold text-gray-500 font-['Poppins']">
              #
            </span>
            <span className="col-span-4 text-xs sm:text-sm font-semibold text-gray-500 font-['Poppins']">
              {t('dashboard.table.businessName')}
            </span>
            <span className="col-span-3 text-xs sm:text-sm font-semibold text-gray-500 font-['Poppins'] text-center">
              {t('dashboard.table.renewalDate')}
            </span>
            <span className="col-span-3 text-xs sm:text-sm font-semibold text-gray-500 font-['Poppins'] text-center">
              {t('dashboard.table.notifyClient')}
            </span>
          </div>
        </div>

        {/* Body - Scrollable */}
        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 px-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {t('dashboard.noUpcomingRenewals')}
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {t('dashboard.noUpcomingRenewalsDesc')}
            </p>
          </div>
        ) : (
          <>
            {/* Scrollable list area */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {renewalAlerts.map((item, index) => {
                const id = item.id || String(index + 1).padStart(2, '0');
                const businessName =
                  item.businessName ||
                  item.CompanyName ||
                  item.companyName ||
                  `${t('dashboard.businessLabel')} #${index + 1}`;
                const renewalDate =
                  item.renewalDate || item.RenewalDate || item.nextRenewalDate;
                const urgent = isUrgent(renewalDate);

                return (
                  <div
                    key={item.id || index}
                    className="px-6 sm:px-8 py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <span className="col-span-2 text-sm font-bold text-black font-['Poppins']">
                        {id}
                      </span>
                      <span className="col-span-4 text-sm font-bold text-black font-['Poppins'] truncate">
                        {businessName}
                      </span>
                      <span
                        className={`col-span-3 text-sm font-medium font-['Poppins'] text-center ${
                          urgent ? 'text-[#FF4D4D]' : 'text-gray-600'
                        }`}
                      >
                        {formatDate(renewalDate)}
                      </span>
                      <div className="col-span-3 flex justify-center">
                        <button
                          onClick={() =>
                            handleSendAlert({ ...item, businessName })
                          }
                          className="bg-gradient-to-b from-[#7B1FA2] to-[#D32F2F] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium font-['Poppins'] hover:opacity-90 transition-opacity w-full sm:w-auto flex items-center justify-center gap-1.5"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          {t('dashboard.sendAlert')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
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
                      : 'border-gray-300 text-gray-600 hover:bg-white hover:border-gray-400'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={renewalAlerts.length < itemsPerPage}
                  className={`p-1 rounded-md border ${
                    renewalAlerts.length < itemsPerPage
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

export default SubscriptionRenewalAlert;