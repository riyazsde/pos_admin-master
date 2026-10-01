import React, { useState, useEffect, useRef } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Package } from 'lucide-react';

// Sibling components
import SubscriptionPlans from '../SubscriptionTable/SubscriptionPlans';
import CreateSubscriptionForm from '../SubscriptionTable/CreateSubscriptionForm';

// Redux
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSubscriptionHistoryData,
  setSubscriptionHistoryLoading,
} from '../../Store/Features/subscriptions/subscriptionsSlice';
import { subscriptionService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return '—';
  }
};

// ---------------------------------------------------------------------------
// Table Row
// ---------------------------------------------------------------------------
const TableRow = ({ sub, index, navigate }) => {
  const id = String(index + 1).padStart(2, '0');
  const plan = sub.Plan || {};

  const goToDetails = () => {
    navigate(`/client-details?id=${sub.Restaurant_User_id}`);
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
            Purchased {formatDate(sub.Purchase_Date)}
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
          onClick={goToDetails}
          className="w-full max-w-[100px] h-[35px] bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-md text-white font-poppins text-xs font-medium hover:opacity-90 transition-opacity"
        >
          View more
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const SubscriptionTable = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'plans' | 'form'
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    subscriptionHistory,
    subscriptionHistoryPagination,
    historyLoading,
  } = useAppSelector((state) => state.subscriptions);

  // ✅ Fetch subscription history on mount
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchHistory = async () => {
      dispatch(setSubscriptionHistoryLoading(true));
      try {
        const result = await subscriptionService.getSubscriptionHistory(
          1,
          10,
          'all'
        );
        dispatch(setSubscriptionHistoryData(result));
      } catch (err) {
        console.error('Subscription history fetch error:', err);
        dispatch(setSubscriptionHistoryLoading(false));
        toast.error('Failed to load subscriptions', {
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Please try again later.',
        });
      }
    };

    fetchHistory();
  }, [dispatch]);

  // ---------------------------------------------------------------------
  // View: PLANS
  // ---------------------------------------------------------------------
  if (currentView === 'plans') {
    return (
      <SubscriptionPlans
        onBack={() => setCurrentView('list')}
        onGetStarted={() => setCurrentView('form')}
        onCreateNew={() => setCurrentView('form')}
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
        onComplete={() => setCurrentView('plans')}
      />
    );
  }

  // ---------------------------------------------------------------------
  // View: LIST (default)
  // ---------------------------------------------------------------------
  const isEmpty = subscriptionHistory.length === 0;
  const totalCount = subscriptionHistoryPagination?.total || 0;

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* ================== Header ================== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl lg:text-3xl font-bold text-black font-poppins">
            Subscriptions
          </h1>

          <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
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

        {/* Period dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-[110px] h-9 px-3 bg-white border border-gray-300 rounded-md shadow-sm text-black text-sm"
          >
            <span>{selectedPeriod}</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border border-gray-100 z-10">
              {['All', 'Today', 'This Week'].map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setSelectedPeriod(opt);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-xs text-gray-500 mb-4">
        {totalCount} subscription{totalCount !== 1 ? 's' : ''}
      </p>

      {/* ================== Table ================== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-12 items-center bg-[#F9FAFB] border-b border-gray-200 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Business Name</div>
          <div className="col-span-2">Plan Purchased</div>
          <div className="col-span-2">Renewal Date</div>
          <div className="col-span-2">Transaction Id</div>
          <div className="col-span-1">Payment</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Body */}
        {historyLoading && isEmpty ? (
          <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">Loading subscriptions…</span>
          </div>
        ) : isEmpty ? (
          <div className="p-10 flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No subscriptions found
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Purchased subscriptions will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {subscriptionHistory.map((sub, index) => (
              <TableRow
                key={sub.Subscription_id || index}
                sub={sub}
                index={index}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAdminLayout(SubscriptionTable);