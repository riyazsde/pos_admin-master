import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
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

  const { subscriptions, subscriptionsLoading } = useAppSelector(
    (state) => state.dashboard
  );

  // ✅ Fetch on mount
  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) return;

    const fetchSubscriptions = async () => {
      dispatch(setSubscriptionsLoading(true));
      try {
        const result = await dashboardService.getSubscriptions(1, 5);
        dispatch(setSubscriptionsData(result));
      } catch (err) {
        console.error('Subscriptions fetch error:', err);
        dispatch(setSubscriptionsLoading(false));
      }
    };

    fetchSubscriptions();
  }, [dispatch, subscriptions]);

  // ✅ Transform API data → table rows
  const rows = subscriptions.map((sub, idx) => {
    const plan = getPlanInfo(sub.Admin_Plan_id);

    return {
      id: String(idx + 1).padStart(2, '0'),
      business: `Plan #${sub.Admin_Plan_id}`, // ⚠️ Placeholder — API has no business name
      plan: plan.name,
      date: sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-GB') : '—',
      amount: `${plan.amount} ${plan.currency}`,
      isActive: sub.isActive,
      paymentStatus: sub.paymentStatus,
    };
  });

  // ✅ Loading skeleton
  if (subscriptionsLoading && rows.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Active Subscriptions</h2>
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
        <h2 className="text-lg font-bold text-black">Active Subscriptions</h2>
        <div
          className="text-xs font-bold text-black hover:text-blue-600 cursor-pointer transition-colors"
          onClick={() => navigate('/subscription-list')}
        >
          See all
        </div>
      </div>

      {/* Empty state */}
      {rows.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 py-10">
          <CreditCard className="w-8 h-8 text-gray-300" />
          <p className="text-xs">No subscriptions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[600px] w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 bg-[#F9F5F6] rounded-t-xl text-xs font-semibold text-gray-500 py-3 px-4">
              <div className="text-center">#</div>
              <div className="text-left pl-2">Business Name</div>
              <div className="text-left pl-2">Plan Purchased</div>
              <div className="text-center">Purchased Date</div>
              <div className="text-right pr-4">Amount</div>
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
      )}
    </div>
  );
};

export default SubscriptionsPurchased;