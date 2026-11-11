import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../Store/hooks';
import { useTranslation } from 'react-i18next';
import { hamService, reportService } from '../../Services/apiService';

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600"
    aria-hidden="true"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

function ActiveAlerts() {
  const { kpis, dateFilter } = useAppSelector((state) => state.dashboard);
  const { t } = useTranslation();
  const [devices, setDevices] = useState([]);
  const [deviceError, setDeviceError] = useState('');
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [stock, setStock] = useState({ data: [], summary: { lowStockItems: 0 } });
  const [stockError, setStockError] = useState('');
  const [stockLoading, setStockLoading] = useState(true);
  const [filters, setFilters] = useState({
    threshold: '10',
    search: '',
    location: 'all',
  });
  const [appliedFilters, setAppliedFilters] = useState({
    threshold: 10,
    search: '',
    location: 'all',
  });

  useEffect(() => {
    let active = true;
    const fetchDevices = async () => {
      try {
        const result = await hamService.getSoldInRestaurant(dateFilter);
        if (active) setDevices(result.data);
      } catch (error) {
        console.error('Offline devices fetch error:', error);
        if (active) setDeviceError(error?.message || t('common.error'));
      } finally {
        if (active) setDevicesLoading(false);
      }
    };

    fetchDevices();
    return () => {
      active = false;
    };
  }, [dateFilter, t]);

  useEffect(() => {
    let active = true;
    const fetchStock = async () => {
      setStockLoading(true);
      setStockError('');
      try {
        const result = await reportService.getLowStockAlerts({
          ...appliedFilters,
          filter: dateFilter,
        });
        if (active) setStock(result);
      } catch (error) {
        console.error('Low stock alerts fetch error:', error);
        if (active) setStockError(error?.message || t('common.error'));
      } finally {
        if (active) setStockLoading(false);
      }
    };

    fetchStock();
    return () => {
      active = false;
    };
  }, [appliedFilters, dateFilter, t]);

  const offlineDevices = devices.filter(
    (device) =>
      device.Status === true &&
      device.paymentState === true &&
      device.isAcitve === false
  );
  const deviceItems = offlineDevices.slice(0, 3).map((device, index) => {
    const business =
      device.Business_Name || device.Restaurant_Name || device.Location;
    const name =
      device.Device_Name || device.Device || device.Name || device.Model;
    return [business, name].filter(Boolean).join(' - ') ||
      `${t('activeAlerts.deviceOffline')} #${index + 1}`;
  });
  const stockItems = stock.data.slice(0, 3).map((item, index) => {
    const label = [item.location, item.device].filter(Boolean).join(' - ');
    return label || `${t('activeAlerts.lowStock')} #${index + 1}`;
  });

  const handleFilterChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    const threshold = Number(filters.threshold);
    if (!Number.isFinite(threshold) || threshold < 0) {
      setStockError(t('activeAlerts.invalidThreshold'));
      return;
    }
    setAppliedFilters({
      threshold,
      search: filters.search.trim(),
      location: filters.location.trim() || 'all',
    });
  };

  const alerts = [
    {
      id: 'device-offline',
      title: t('activeAlerts.deviceOffline'),
      badgeText: t('activeAlerts.activeCount', {
        count: Number(kpis?.offlineDevices) || 0,
      }),
      badgeColor: 'bg-[#FFEBEB] text-[#E53935]',
      items: deviceItems,
      loading: devicesLoading,
      error: deviceError,
      empty: t('activeAlerts.noOfflineDevices'),
    },
    {
      id: 'low-stock',
      title: t('activeAlerts.lowStock'),
      badgeText: t('activeAlerts.activeCount', {
        count: stock.summary.lowStockItems,
      }),
      badgeColor: 'bg-[#FFF8E1] text-[#F57F17]',
      items: stockItems,
      loading: stockLoading,
      error: stockError,
      empty: t('activeAlerts.noLowStock'),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-4 shrink-0">
        {t('activeAlerts.title')}
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-6 flex-grow">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded border border-gray-100 p-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                <WarningIcon />
                <span>{alert.title}</span>
              </div>
              <span
                className={`${alert.badgeColor} text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap`}
              >
                {alert.badgeText}
              </span>
            </div>

            {alert.id === 'low-stock' && (
              <form
                onSubmit={handleFilterSubmit}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3"
              >
                <label className="text-xs text-gray-500">
                  {t('activeAlerts.threshold')}
                  <input
                    type="number"
                    min="0"
                    name="threshold"
                    value={filters.threshold}
                    onChange={handleFilterChange}
                    className="mt-1 w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-700"
                  />
                </label>
                <label className="text-xs text-gray-500">
                  {t('activeAlerts.search')}
                  <input
                    type="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="mt-1 w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-700"
                  />
                </label>
                <label className="text-xs text-gray-500">
                  {t('activeAlerts.location')}
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="mt-1 w-full rounded border border-gray-200 px-2 py-1 text-sm text-gray-700"
                  />
                </label>
                <button
                  type="submit"
                  className="sm:col-span-3 justify-self-end rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                >
                  {t('activeAlerts.applyFilters')}
                </button>
              </form>
            )}

            {alert.error && (
              <p className="mb-2 text-xs text-red-600" role="alert">
                {alert.error}
              </p>
            )}
            {alert.loading ? (
              <p className="pl-7 text-xs text-gray-400">{t('common.loading')}</p>
            ) : alert.items.length > 0 ? (
              <ul className="text-xs text-gray-500 space-y-1.5 pl-7">
                {alert.items.map((item, index) => (
                  <li key={`${alert.id}-${index}`} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              !alert.error && (
                <p className="pl-7 text-xs text-gray-400">{alert.empty}</p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveAlerts;
