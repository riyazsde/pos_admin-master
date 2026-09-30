import React from 'react';
import { useAppSelector } from '../../Store/hooks';
import { CheckCircle2 } from 'lucide-react';

const UpcommingRenewals = () => {
  const { renewalAlerts, completeDashboardLoading } = useAppSelector(
    (state) => state.dashboard
  );

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const formatAmount = (amount, currency = 'XOF') => {
    if (amount === null || amount === undefined) return '—';
    return `${Number(amount).toLocaleString('en-US')} ${currency}`;
  };

  // Normalize incoming data (flexible field names)
  const rows = (renewalAlerts || []).map((item, index) => ({
    id: item.id || String(index + 1).padStart(2, '0'),
    restaurant:
      item.businessName ||
      item.restaurantName ||
      item.CompanyName ||
      item.companyName ||
      `Client #${index + 1}`,
    plan: item.Plan || item.plan || '—',
    date: formatDate(item.renewalDate || item.RenewalDate || item.nextRenewalDate),
    amount: item.amount
      ? formatAmount(item.amount, item.currency)
      : item.Amount || '—',
  }));

  const hasData = rows.length > 0;

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-4 shrink-0">
        Upcoming Renewals
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-grow flex flex-col">
        {completeDashboardLoading && !hasData ? (
          <div className="flex-1 p-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded mb-2"></div>
            ))}
          </div>
        ) : !hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 p-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No upcoming renewals
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              All subscriptions are up to date. Renewal alerts will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse h-full">
              <thead>
                <tr className="bg-[#FDF5F5] text-gray-600 text-sm">
                  <th className="py-3 px-4 font-medium">#</th>
                  <th className="py-3 px-4 font-medium">Restaurant</th>
                  <th className="py-3 px-4 font-medium">Plan</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {rows.map((row, index) => (
                  <tr
                    key={row.id + index}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      index === rows.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-gray-500">{row.id}</td>
                    <td className="py-4 px-4 text-gray-800">{row.restaurant}</td>
                    <td className="py-4 px-4 text-green-500">{row.plan}</td>
                    <td className="py-4 px-4 text-green-500">{row.date}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium text-right">
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcommingRenewals;