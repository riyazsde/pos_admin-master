import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Package, Filter, RefreshCw } from 'lucide-react';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setPosHardwareLoading,
  setPosHardwareData,
} from '../../Store/Features/posHardware/posHardwareSlice';
import { posHardwareService } from '../../Services/apiService';

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

const getDeviceLabel = (d) => {
  if (!d) return 'Device';
  if (typeof d.device === 'string') return d.device;
  if (typeof d.deviceName === 'string') return d.deviceName;
  if (typeof d.hardwareType === 'string') return d.hardwareType;
  return 'Device';
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
function HardwareDeviceHistory() {
  const dispatch = useAppDispatch();
  const [selectedDevice, setSelectedDevice] = useState('All');

  const { monthlyBreakdown, loading, hasLoaded } = useAppSelector(
    (state) => state.posHardware
  );

  // ✅ Ensure dashboard data is loaded (in case user landed here directly)
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasLoaded || hasFetched.current) return;
    hasFetched.current = true;

    const fetchDashboard = async () => {
      dispatch(setPosHardwareLoading(true));
      try {
        const data = await posHardwareService.getDashboard();
        dispatch(setPosHardwareData(data));
      } catch (err) {
        console.error('Hardware history fetch error:', err);
        dispatch(setPosHardwareLoading(false));
      }
    };

    fetchDashboard();
  }, [dispatch, hasLoaded]);

  // ✅ Flatten monthly breakdown into history rows
  const allRows = (monthlyBreakdown || []).flatMap((item, monthIdx) => {
    const detailed =
      item.soldDevices || item.items || item.hardwareList || null;

    if (Array.isArray(detailed) && detailed.length > 0) {
      return detailed.map((d, idx) => ({
        id: `${monthIdx}-${idx}-${d.id || ''}`,
        businessName:
          d.businessName || d.Business_Name || d.companyName || '—',
        planPurchased:
          d.planPurchased || d.planName || d.Plan?.PlanName || '—',
        renewalDate: formatDate(
          d.renewalDate || d.Renewal_Date || d.purchasedDate || null
        ),
        transactionId:
          d.transactionId || d.reference_number || d.referenceNumber || '—',
        device: getDeviceLabel(d),
      }));
    }

    // Fallback: summary row per month
    const monthLabel =
      item.month || item.monthName || `Month ${monthIdx + 1}`;
    const count = item.count ?? item.sales ?? 0;

    return [
      {
        id: `month-${monthIdx}`,
        businessName: monthLabel,
        planPurchased: '—',
        renewalDate: '—',
        transactionId: '—',
        device: `${count} sold`,
      },
    ];
  });

  // ✅ Filter by device type
  const filteredData =
    selectedDevice === 'All'
      ? allRows
      : allRows.filter((r) =>
          String(r.device).toLowerCase().includes(selectedDevice.toLowerCase())
        );

  const totalCount = filteredData.length;

  return (
    <div className="p-4 sm:p-6 w-full font-poppins">
      {/* Header with dropdown */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">
            POS Hardware Devices History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {totalCount} record{totalCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            onClick={() => {
              hasFetched.current = false;
              dispatch(setPosHardwareLoading(true));
              posHardwareService
                .getDashboard()
                .then((data) => dispatch(setPosHardwareData(data)))
                .catch(() => dispatch(setPosHardwareLoading(false)));
            }}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              className="border border-gray-300 rounded-md pl-9 pr-8 py-2 text-sm font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              <option value="All">All Devices</option>
              <option value="Printer">Printer</option>
              <option value="System">System</option>
              <option value="KDS">KDS</option>
              <option value="Tablet">Tablet</option>
            </select>
            <svg
              className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none"
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
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] reports-scroll">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-red-50">
              <tr className="text-left text-gray-600 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Business Name</th>
                <th className="px-4 py-3 font-semibold">Plan Purchased</th>
                <th className="px-4 py-3 font-semibold">Renewal Date</th>
                <th className="px-4 py-3 font-semibold">Transaction ID</th>
                <th className="px-4 py-3 font-semibold">Device Purchased</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading && !hasLoaded ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-16 text-center text-gray-400"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-2" />
                    <span className="text-sm">Loading history…</span>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        No hardware history yet
                      </p>
                      <p className="text-xs text-gray-400">
                        Hardware purchases will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-purple-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium truncate max-w-[200px]">
                      {item.businessName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[200px]">
                      {item.planPurchased}
                    </td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">
                      {item.renewalDate}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-600 truncate max-w-[200px]"
                      title={item.transactionId}
                    >
                      {item.transactionId}
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600 truncate max-w-[140px]">
                      {item.device}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
        .reports-scroll {
          scrollbar-width: thin;
          scrollbar-color: #b934d8 #f5f5f7;
        }
      `}</style>
    </div>
  );
}

export default withAdminLayout(HardwareDeviceHistory);