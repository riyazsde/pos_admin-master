import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setTopPerformersData,
  setTopPerformersLoading,
} from '../../Store/Features/dashboard/dashboardSlice';
import { dashboardService } from '../../Services/apiService';

const TopPerformers = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { topPerformers, topPerformersLoading } = useAppSelector(
    (state) => state.dashboard
  );

  // ✅ Fetch on mount
  useEffect(() => {
    if (topPerformers && topPerformers.length > 0) return;

    const fetchPerformers = async () => {
      dispatch(setTopPerformersLoading(true));
      try {
        const result = await dashboardService.getTopPerformers(1, 10);
        dispatch(setTopPerformersData(result));
      } catch (err) {
        console.error('Top performers fetch error:', err);
        dispatch(setTopPerformersLoading(false));
      }
    };

    fetchPerformers();
  }, [dispatch, topPerformers]);

  // ✅ Empty state
  if (topPerformersLoading && (!topPerformers || topPerformers.length === 0)) {
    return (
      <div className="h-full flex flex-col gap-4 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Top Performers</h2>
        </div>
        <div className="flex-1 bg-white rounded-3xl shadow-md border border-gray-100 p-4 animate-pulse">
          <div className="h-8 bg-gray-100 rounded mb-2"></div>
          <div className="h-8 bg-gray-100 rounded mb-2"></div>
          <div className="h-8 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  const hasData = topPerformers && topPerformers.length > 0;

  return (
    <div className="h-full flex flex-col gap-4 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Top Performers</h2>
        <button
          onClick={() => navigate('/top-performers-list')}
          className="text-sm font-semibold text-black hover:underline"
        >
          See all
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden min-h-0">
        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Trophy className="w-10 h-10 text-gray-300" />
            <p className="text-sm">No top performers yet</p>
          </div>
        ) : (
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
                <div>Company Name</div>
                <div>Subscription</div>
                <div>Device Count</div>
                <div>Total Sales</div>
                <div>Rank</div>
                <div className="flex items-center gap-1">Renewal Date</div>
              </div>

              {/* Data Rows */}
              {topPerformers.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-7 items-center px-4 py-2.5 text-sm text-black border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="font-medium text-gray-500">{item['#'] || '—'}</div>
                  <div className="font-medium text-gray-800">
                    {item.companyName || 'Unnamed Company'}
                  </div>
                  <div className="text-gray-700">{item.subscriptionCount ?? 0}</div>
                  <div className="text-gray-700">—</div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-green-600 font-medium">
                      {item.salesFormatted || `${item.totalSales ?? 0} XOF`}
                    </span>
                  </div>
                  <div className="font-medium text-gray-700">
                    {item.rank === -1 ? (
                      <span className="text-gray-400">Unranked</span>
                    ) : (
                      `#${item.rank}`
                    )}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {item.renewalDate
                      ? new Date(item.renewalDate).toLocaleDateString()
                      : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPerformers;