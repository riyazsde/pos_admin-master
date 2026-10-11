import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import withAdminLayout from '../AdminPanel/withAdminLayout';

import printer from '../../assets/Images/admin/Pos/printer.png';
import system from '../../assets/Images/admin/Pos/system.png';
import global from '../../assets/Images/admin/client/global-user.png';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setPosHardwareLoading,
  setPosHardwareData,
  setPosHardwareError,
} from '../../Store/Features/posHardware/posHardwareSlice';
import { posHardwareService, hamService } from '../../Services/apiService';

// Helper to format numbers
const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
};

// Helper for Condition Badges
const getConditionBadge = (condition) => {
  const normalized = condition?.toLowerCase() || '';
  switch (normalized) {
    case 'excellent':
      return 'bg-green-100 text-green-700';
    case 'good':
      return 'bg-blue-100 text-blue-700';
    case 'new':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Helper to map API data to Table format
// ⚠️ Adjust the keys on the right side to match your actual API response
const mapApiResponseToDevices = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item, index) => ({
    id: item.id || index,
    name: item.deviceName || item.name || 'Unknown Device',
    model: item.model || item.deviceModel || 'N/A',
    serial: item.serialNumber || item.serial || 'N/A',
    posId: item.posId || item.tagId || 'N/A',
    warrantyExp: item.warrantyExpiry || item.warrantyExp || 'N/A',
    purchaseDate: item.purchaseDate || 'N/A',
    condition: item.condition || 'Good',
    iconColor: 'bg-purple-100 text-purple-600',
  }));
};

const PosDevice = () => {
  const dispatch = useAppDispatch();

  const {
    totalClients,
    totalPrinters,
    totalSystems,
    loading,
    hasLoaded,
    lastUpdated,
  } = useAppSelector((state) => state.posHardware);

  // ✅ Local state for the devices table
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(true);

  // ✅ Fetch Dashboard Metrics
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
        console.error('POS hardware fetch error:', err);
        dispatch(
          setPosHardwareError(err?.message || 'Failed to load dashboard')
        );
        toast.error('Failed to load POS hardware data', {
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Please try again later.',
        });
      }
    };

    fetchDashboard();
  }, [dispatch, hasLoaded]);

  // ✅ Fetch All Devices using hamService
  useEffect(() => {
    const fetchDevices = async () => {
      setDevicesLoading(true);
      try {
        const result = await hamService.getMyDevices();
        // hamService returns { data, count }
        const mappedDevices = mapApiResponseToDevices(result.data);
        setDevices(mappedDevices);
      } catch (err) {
        console.error('Error fetching devices:', err);
        toast.error('Failed to load hardware devices list', {
          description: err?.message || 'Please try again later.',
        });
      } finally {
        setDevicesLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const metrics = [
    {
      title: 'Total Clients',
      value: formatNumber(totalClients),
      imageSrc: global,
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Printers',
      value: formatNumber(totalPrinters),
      imageSrc: printer,
      bgColor: 'bg-pink-100',
      valueColor: totalPrinters > 0 ? 'text-red-500' : undefined,
      trend: totalPrinters > 0 ? 'down' : null,
    },
    {
      title: 'Total POS Systems',
      value: formatNumber(totalSystems),
      imageSrc: system,
      bgColor: 'bg-green-100',
      trend: totalSystems > 0 ? 'up' : null,
    },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            POS Hardware Devices
          </h1>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      {loading && !hasLoaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 poppins-text">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-full bg-white rounded-[25px] flex items-center px-6 py-5 gap-6 animate-pulse border border-gray-100"
            >
              <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full bg-gray-200"></div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 poppins-text">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="relative w-full bg-white rounded-[25px] shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_4px_4px_rgba(0,0,0,0.25)] flex items-center px-6 py-5 gap-6"
            >
              {/* Icon circle */}
              <div
                className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full ${metric.bgColor} flex items-center justify-center shrink-0`}
              >
                <img
                  src={metric.imageSrc}
                  alt="icon"
                  className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]"
                />
              </div>

              {/* Text Block */}
              <div className="flex flex-col justify-center gap-1 min-w-0">
                <p className="text-[16px] sm:text-[18px] text-[#00000099] font-medium">
                  {metric.title}
                </p>
                <div className="flex items-center gap-2">
                  {metric.trend === 'up' && (
                    <span className="text-[#34C759] font-bold text-lg sm:text-xl">
                      ↑
                    </span>
                  )}
                  {metric.trend === 'down' && (
                    <span className="text-[#FF3B30] font-bold text-lg sm:text-xl">
                      ↓
                    </span>
                  )}
                  <span
                    className={`text-[20px] sm:text-[24px] font-bold leading-[30px] sm:leading-[36px] tabular-nums ${
                      metric.valueColor ||
                      (metric.trend === 'up'
                        ? 'text-[#34C759]'
                        : metric.trend === 'down'
                        ? 'text-[#FF3B30]'
                        : 'text-[#232323]')
                    }`}
                  >
                    {metric.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Hardware Devices Table Section */}
      <div className="mt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          All Hardware Devices
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Manage and track all hardware devices across locations
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {devicesLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                <p>Loading hardware devices...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p>No hardware devices found.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900 w-1/3">
                      Device
                    </th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900">
                      Serial Number
                    </th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900">
                      Warranty
                    </th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-900">
                      Condition
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr
                      key={device.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      {/* Device Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${device.iconColor}`}
                          >
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
                            >
                              <rect
                                x="2"
                                y="3"
                                width="20"
                                height="14"
                                rx="2"
                                ry="2"
                              ></rect>
                              <line x1="8" y1="21" x2="16" y2="21"></line>
                              <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {device.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {device.model}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Serial Number Column */}
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-900">{device.serial}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {device.posId}
                        </p>
                      </td>

                      {/* Warranty Column */}
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-900">
                          Exp: {device.warrantyExp}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Purchase: {device.purchaseDate}
                        </p>
                      </td>

                      {/* Condition Column */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionBadge(
                            device.condition
                          )}`}
                        >
                          {device.condition}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(PosDevice);