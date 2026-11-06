// src/Components/Clients/Performance.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import RestaurantPerformanceChart from './RestaurantPerformanceChart';
import mooeny from '../../assets/Images/admin/client/money.png';
import bill from '../../assets/Images/admin/client/bill.png';
import global from '../../assets/Images/admin/client/global-user.png';
import { clientService, reportService } from '../../Services/apiService';

const FILTER_MAP = {
  '24H': '24H',
  '1W': '1 week',
  '1M': '1 Month',
  '6M': '6 Month',
};

const formatNumber = (n) =>
  Number.isFinite(Number(n)) ? Number(n).toLocaleString() : '0';

const MetricCard = ({ imageSrc, title, value, bgColor }) => (
  <div className="bg-white rounded-3xl p-6 shadow-md flex items-center gap-4 w-full">
    <div
      className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center`}
    >
      <img src={imageSrc} alt={title} className="w-8 h-8 object-contain" />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-gray-600 font-medium text-sm sm:text-base">{title}</p>
      <p className="text-gray-900 font-bold text-xl sm:text-2xl">{value}</p>
    </div>
  </div>
);

/**
 * Accepts either:
 *   - restaurantId  → used directly
 *   - clientId      → resolved via getClientById → Owner.user_id
 *   - falls back to ?restaurant_id= or ?id= from URL
 * If none can be resolved, shows a friendly message instead of an error.
 */
const Performance = ({ clientId: clientIdProp, restaurantId: restaurantIdProp }) => {
  const [searchParams] = useSearchParams();

  const clientsId = clientIdProp ?? searchParams.get('id');
  const restaurantIdFromUrl = restaurantIdProp ?? searchParams.get('restaurant_id');

  const [selectedPeriod, setSelectedPeriod] = useState('24H');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perf, setPerf] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPerformance = async () => {
      setLoading(true);
      setError(null);
      try {
        let restaurantId = restaurantIdFromUrl;

        // Try to resolve from client if not directly provided
        if (!restaurantId && clientsId) {
          const client = await clientService.getClientById(clientsId);
          restaurantId = client?.Owner?.user_id ?? client?.Owner_User_id ?? null;
        }

        if (!restaurantId) {
          throw new Error(
            'NO_RESTAURANT_ID' // sentinel → handled below
          );
        }

        const data = await reportService.getRestaurantPerformance({
          restaurantId,
          filter: FILTER_MAP[selectedPeriod] ?? '24H',
        });

        if (!cancelled) setPerf(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message === 'NO_RESTAURANT_ID'
              ? 'NO_RESTAURANT_ID'
              : err?.message || 'Failed to load performance'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPerformance();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientsId, restaurantIdFromUrl, selectedPeriod]);

  const summary = perf?.summary || {};
  const chartData = perf?.chart || [];

  // ---- No restaurant ID (Owner is null in API) -------------------------
  if (error === 'NO_RESTAURANT_ID') {
    return (
      <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center bg-white rounded-2xl border border-gray-200 p-10">
        <AlertCircle className="w-10 h-10 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-800">
          No restaurant owner linked
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          This client has no <code>Owner.user_id</code> yet, so restaurant
          performance data can’t be fetched. Assign an owner to this client
          to view performance.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-2 font-[Poppins]">
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            imageSrc={mooeny}
            title="Total Sales"
            value={`${formatNumber(summary.totalSales)} XOF`}
            bgColor="bg-yellow-200"
          />
          <MetricCard
            imageSrc={bill}
            title="Total Orders"
            value={formatNumber(summary.totalOrders)}
            bgColor="bg-pink-200"
          />
          <MetricCard
            imageSrc={global}
            title="Total Active Clients"
            value={formatNumber(summary.totalActiveClients)}
            bgColor="bg-green-200"
          />
          <MetricCard
            imageSrc={mooeny}
            title="New Customers"
            value={formatNumber(summary.newCustomers)}
            bgColor="bg-yellow-200"
          />
          <MetricCard
            imageSrc={bill}
            title="Repeat Customers"
            value={formatNumber(summary.repeatCustomers)}
            bgColor="bg-pink-200"
          />
          <MetricCard
            imageSrc={global}
            title="Avg Order Value"
            value={`${formatNumber(summary.avgOrderValue)} XOF`}
            bgColor="bg-green-200"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-10 flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            Loading performance…
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-10 text-center text-red-500 font-medium">
            {error}
          </div>
        ) : (
          <RestaurantPerformanceChart
            data={chartData}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )}
      </div>
    </div>
  );
};

export default Performance;