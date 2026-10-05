// src/Components/Dashboard/ActiveAlerts.jsx

import React from 'react';
import { useAppSelector } from '../../Store/hooks';
import { useTranslation } from 'react-i18next';

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
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

function ActiveAlerts() {
  const { completeDashboardLoading } = useAppSelector(
    (state) => state.dashboard
  );
  const { t } = useTranslation();

  // ⚠️ Placeholder — replace with real data when API provides it.
  // The translation keys are fetched lazily so they stay dynamic.
  const MOCK_ALERTS = [
    {
      id: 'device-offline',
      title: t('activeAlerts.deviceOffline'),
      badgeText: t('activeAlerts.activeCount', { count: 12 }),
      badgeColor: 'bg-[#FFEBEB] text-[#E53935]',
      items: [
        t('activeAlerts.mock.deviceItem1'),
        t('activeAlerts.mock.deviceItem2'),
        t('activeAlerts.mock.deviceItem3'),
      ],
    },
    {
      id: 'low-stock',
      title: t('activeAlerts.lowStock'),
      badgeText: t('activeAlerts.activeCount', { count: 8 }),
      badgeColor: 'bg-[#FFF8E1] text-[#F57F17]',
      items: [
        t('activeAlerts.mock.stockItem1'),
        t('activeAlerts.mock.stockItem2'),
        t('activeAlerts.mock.stockItem3'),
      ],
    },
  ];

  const alerts = MOCK_ALERTS;

  if (completeDashboardLoading && alerts.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-4 shrink-0">
          {t('activeAlerts.title')}
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-6 flex-grow animate-pulse">
          <div className="h-24 bg-gray-50 rounded"></div>
          <div className="h-24 bg-gray-50 rounded"></div>
        </div>
      </div>
    );
  }

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
            <ul className="text-xs text-gray-500 space-y-1.5 pl-7">
              {alert.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveAlerts;