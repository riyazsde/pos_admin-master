// src/Components/SubscriptionTable/SubscriptionTable.jsx

import React, { useState, useEffect, useRef } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Package, ArrowLeft, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SubscriptionPlans from '../SubscriptionTable/SubscriptionPlans';
import CreateSubscriptionForm from '../SubscriptionTable/CreateSubscriptionForm';
import SubscriptionDetails from '../SubscriptionTable/SubscriptionDetails';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSubscriptionHistoryData,
  setSubscriptionHistoryLoading,
  addSubscriptionHistoryItem, // ✅ import
} from '../../Store/Features/subscriptions/subscriptionsSlice';
import { subscriptionService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Table Row (unchanged)
// ---------------------------------------------------------------------------
const TableRow = ({ sub, index, onViewMore, t, i18n }) => {
  const id = String(index + 1).padStart(2, '0');
  const plan = sub.Plan || {};

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
      return new Date(iso).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="hidden lg:grid grid-cols-12 items-center w-full bg-white border-b border-gray-100 px-4 xl:px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="col-span-1 text-gray-500 font-poppins text-sm xl:text-base tabular-nums">
        {id}
      </div>
      <div
        className="col-span-3 text-gray-800 font-poppins text-sm xl:text-base font-medium truncate"
        title={sub.Business_Name}
      >
        {sub.Business_Name || '—'}
      </div>
      <div className="col-span-2 font-poppins text-sm xl:text-base">
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium truncate">
            {plan.PlanName || '—'}
          </span>
          <span className="text-[10px] text-gray-400 truncate">
            {plan.Subscription_Type || ''}
          </span>
        </div>
      </div>
      <div className="col-span-2 font-poppins text-sm xl:text-base">
        <div className="flex flex-col">
          <span className="text-gray-700 tabular-nums">
            {formatDate(sub.Renewal_Date)}
          </span>
          <span className="text-[10px] text-gray-400">
            {t('subscriptions.purchasedOn')} {formatDate(sub.Purchase_Date)}
          </span>
        </div>
      </div>
      <div
        className="col-span-2 font-poppins text-xs xl:text-sm text-gray-600 truncate"
        title={sub.Transaction_Reference}
      >
        {sub.Transaction_Reference || '—'}
      </div>
      <div className="col-span-1 font-poppins text-sm xl:text-base text-gray-700 truncate">
        {sub.Mode_Of_Payment || '—'}
      </div>
      <div className="col-span-1 flex justify-end items-center">
        <button
          onClick={() => onViewMore(sub)}
          className="w-full max-w-[100px] h-[35px] bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-md text-white font-poppins text-xs font-medium hover:opacity-90 transition-opacity"
        >
          {t('subscriptions.viewMore')}
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const SubscriptionTable = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const {
    subscriptionHistory,
    subscriptionHistoryPagination,
    historyLoading,
  } = useAppSelector((state) => state.subscriptions);

  // ✅ REMOVE the hasFetched guard so we refetch on every mount / view switch
  useEffect(() => {
    if (currentView !== 'list') return; // only fetch when we're on the list view

    const fetchHistory = async () => {
      dispatch(setSubscriptionHistoryLoading(true));
      try {
        const result = await subscriptionService.getSubscriptionHistory(1, 10, 'all');
        dispatch(setSubscriptionHistoryData(result));
      } catch (err) {
        console.error('Subscription history fetch error:', err);
        dispatch(setSubscriptionHistoryLoading(false));
        toast.error(t('subscriptions.loadFailed'), {
          description:
            err?.response?.data?.message || err?.message || t('common.error'),
        });
      }
    };

    fetchHistory();
  }, [dispatch, t, currentView]);

  // ---------------------------------------------------------------------
  // View: PLANS
  // ---------------------------------------------------------------------
  if (currentView === 'plans') {
    return (
      <SubscriptionPlans
        onBack={() => setCurrentView('list')}
        onGetStarted={() => setCurrentView('form')}
        onCreateNew={() => setCurrentView('form')}
        onEditPlan={(plan) => console.log('Edit plan:', plan)}
      />
    );
  }

  // ---------------------------------------------------------------------
  // View: FORM
  // ---------------------------------------------------------------------
  if (currentView === 'form') {
    return (
      <CreateSubscriptionForm
        onBack={() => setCurrentView('plans')}
        onComplete={(newSub) => {
          // ✅ If the form returns the new subscription object, push it into the store
          if (newSub) {
            dispatch(addSubscriptionHistoryItem(newSub));
          }
          // Then go back to list — the useEffect above will also refetch to stay in sync
          setCurrentView('list');
        }}
      />
    );
  }

  // ---------------------------------------------------------------------
  // View: DETAILS
  // ---------------------------------------------------------------------
  if (currentView === 'details' && selectedSubscription) {
    return (
      <SubscriptionDetails
        subscription={selectedSubscription}
        onBack={() => {
          setSelectedSubscription(null);
          setCurrentView('list');
        }}
      />
    );
  }

  // ---------------------------------------------------------------------
  // View: LIST
  // ---------------------------------------------------------------------
  const isEmpty = subscriptionHistory.length === 0;
  const totalCount = subscriptionHistoryPagination?.total || 0;

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen font-poppins">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>

          <h1 className="text-xl lg:text-2xl font-bold text-black">
            {t('subscriptions.title')}
          </h1>

          <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setCurrentView('list')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentView === 'list'
                  ? 'bg-[#8E24AA] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-300'
              }`}
            >
              Purchased
            </button>
            <button
              onClick={() => setCurrentView('plans')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentView === 'plans' || currentView === 'form'
                  ? 'bg-[#8E24AA] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-300'
              }`}
            >
              Create
            </button>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('plans')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          Create Subscription <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        {totalCount} {totalCount === 1 ? 'subscription' : 'subscriptions'}
      </p>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {historyLoading && isEmpty ? (
          <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">{t('subscriptions.loadingHistory')}</span>
          </div>
        ) : isEmpty ? (
          <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {t('subscriptions.noSubscriptions')}
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {t('subscriptions.noSubscriptionsDesc')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {subscriptionHistory.map((sub, index) => (
              <TableRow
                key={sub.Subscription_id || index}
                sub={sub}
                index={index}
                t={t}
                i18n={i18n}
                onViewMore={(s) => {
                  setSelectedSubscription(s);
                  setCurrentView('details');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAdminLayout(SubscriptionTable);