import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import withAdminLayout from '../AdminPanel/withAdminLayout';

import printer from '../../assets/Images/admin/Pos/printer.png';
import system from '../../assets/Images/admin/Pos/system.png';
import global from '../../assets/Images/admin/client/global-user.png';

import HardwareChart from '../../Components/PosDevice/HardwareChart';
import HardwareSold from '../../Components/PosDevice/HardwareSold';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setPosHardwareLoading,
  setPosHardwareData,
  setPosHardwareError,
} from '../../Store/Features/posHardware/posHardwareSlice';
import { posHardwareService } from '../../Services/apiService';

const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US');
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

  // ✅ Fetch once
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

  // ✅ Metrics now use real API data
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

     {/* Charts and Table */}
<div className="flex flex-col lg:flex-row w-full gap-6 mt-10 items-stretch">
  <div className="w-full lg:w-[40%] flex">
    <HardwareChart />
  </div>
  <div className="w-full lg:w-[60%] flex">
    <HardwareSold />
  </div>
</div>
    </div>
  );
};

export default withAdminLayout(PosDevice);