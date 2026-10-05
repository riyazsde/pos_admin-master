// src/Components/Clients/ClientDetails.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';

// Assets
import Restaurant from '../../assets/Images/admin/client/Restaurant.png';
import Lock from '../../assets/Images/admin/client/Lock.png';
import uil_message from '../../assets/Images/admin/client/uil_message.png';
import Icon from '../../assets/Images/admin/client/Icon.png';
import arrow from '../../assets/Images/Home/arrow.png';

// Components
import Performance from './Performance';
import RenewalPopupModal from './RenewalPopupModal';

// Service
import { clientService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatDate = (iso, locale = 'en-US') => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return '—';
  }
};

const computeYearsWithUs = (onboardingIso, t) => {
  if (!onboardingIso) return '—';
  try {
    const start = new Date(onboardingIso);
    const now = new Date();
    const years = Math.floor(
      (now - start) / (1000 * 60 * 60 * 24 * 365)
    );
    if (years < 1) return t('clientDetails.lessThanYear');
    return years === 1
      ? t('clientDetails.oneYear')
      : t('clientDetails.yearsCount', { count: years });
  } catch {
    return '—';
  }
};

const formatLocation = (client) => {
  const parts = [client?.State, client?.City].filter(
    (p) => p && p !== 'N/A'
  );
  return parts.length > 0 ? parts.join(', ') : null;
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const ClientDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const clientId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState('about');
  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  // ✅ Fetch client by ID
  useEffect(() => {
    if (fetchedRef.current) return;

    if (!clientId) {
      toast.error(t('clientDetails.missingId'));
      navigate('/clients');
      return;
    }
    fetchedRef.current = true;

    const fetchClient = async () => {
      setIsLoading(true);
      try {
        const data = await clientService.getClientById(clientId);
        console.log('✅ [CLIENT DETAIL] Fetched:', data);
        setClient(data);
      } catch (err) {
        console.error('❌ [CLIENT DETAIL] Fetch error:', err);
        toast.error(t('clientDetails.loadFailed'), {
          description:
            err?.response?.data?.message ||
            err?.message ||
            t('common.error'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [clientId, navigate, t]);

  // ---------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="text-sm">{t('clientDetails.loading')}</span>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-sm">{t('clientDetails.notFound')}</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------
  const businessName = client.Business_Name || '—';
  const displayName = client.Display_Name || businessName;
  const plan = client.Plan || t('clientDetails.noPlan');
  const isActive = client.Status === true;
  const statusText = isActive
    ? t('clientDetails.activeUser')
    : t('clientDetails.inactiveUser');
  const yearsWithUs = computeYearsWithUs(client.OnboardingDate, t);
  const location = formatLocation(client);
  const languageName = client.language?.[0]?.Language_name || '—';
  const currencyName = client.currency?.[0]?.name || 'XOF';
  const email = client.Email || '—';
  const phone = client.phone || '—';

  // Employee bars (still mock since API doesn't provide yet)
  const employeeData = [
    [t('clientDetails.roles.managers'), 10],
    [t('clientDetails.roles.waiters'), 100],
    [t('clientDetails.roles.cashiers'), 5],
    [t('clientDetails.roles.kitchenStaff'), 20],
  ];
  const maxEmployeeCount = Math.max(...employeeData.map(([, c]) => c), 1);

  // Detail fields for the account section
  const accountFields = [
    [t('clientDetails.fields.currentPlan'), plan],
    [t('clientDetails.fields.email'), email],
    [t('clientDetails.fields.phone'), phone],
    [t('clientDetails.fields.language'), languageName],
    [t('clientDetails.fields.currency'), currencyName],
    [
      t('clientDetails.fields.onboardingDate'),
      formatDate(client.OnboardingDate, locale),
    ],
    [
      t('clientDetails.fields.totalOrders'),
      client.TotalOrdersLastYear ?? 0,
    ],
    [
      t('clientDetails.fields.lastYearSales'),
      `${client.lastYearSales ?? 0} ${currencyName}`,
    ],
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 text-black">
      {/* ============= Header with clickable breadcrumb ============= */}
      <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-gray-800 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <button
          onClick={() => navigate('/clients')}
          className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2 sm:gap-5 text-xl sm:text-2xl lg:text-[32px]"
        >
          {t('clientDetails.breadcrumb')}
          <img
            src={arrow}
            alt="Arrow"
            className="w-3 h-3 sm:w-4 sm:h-4 inline-block"
          />
        </button>
        <span>{t('clientDetails.title')}</span>
      </h1>

      {/* ============= Tabs ============= */}
      <div className="relative w-full max-w-[300px] sm:w-[254px]">
        <div className="flex gap-8 sm:gap-8 pb-2 justify-start sm:justify-between">
          {[
            { key: 'about', label: t('clientDetails.about') },
            { key: 'performance', label: t('clientDetails.performance') },
          ].map(({ key, label }) => (
            <div
              key={key}
              onClick={() => setActiveTab(key)}
              className={`cursor-pointer text-lg sm:text-[20px] capitalize ${
                activeTab === key
                  ? 'font-bold text-black'
                  : 'text-gray-600 font-medium'
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="h-[4px] w-full sm:w-[254px] bg-gray-400 relative rounded-full overflow-hidden">
          <div
            className="h-full absolute top-0 left-0 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] transition-all duration-300"
            style={{
              width: window.innerWidth < 640 ? '50%' : '30%',
              transform:
                activeTab === 'about'
                  ? 'translateX(0%)'
                  : window.innerWidth < 640
                  ? 'translateX(100%)'
                  : 'translateX(232%)',
            }}
          ></div>
        </div>
      </div>

      {/* ============= TAB: ABOUT ============= */}
      {activeTab === 'about' && (
        <>
          {/* Top Section */}
          <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Business Logo */}
            <div className="w-full lg:w-[377px] h-[200px] sm:h-[212px] rounded-xl shadow-md overflow-hidden bg-gray-50 flex items-center justify-center">
              {client.Business_logo ? (
                <img
                  src={client.Business_logo}
                  alt={businessName}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <img
                  src={Restaurant}
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Info Box */}
            <div className="flex flex-col justify-center w-full lg:w-[645px] bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] p-4 sm:p-6 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold">
                {businessName}
              </h2>

              <div className="flex items-center gap-2 mt-1 text-base sm:text-[18px] font-medium">
                <span
                  className={
                    isActive ? 'text-[#34C759]' : 'text-red-500'
                  }
                >
                  {statusText}
                </span>
                <span
                  className={`w-[5px] h-[5px] rounded-full ${
                    isActive ? 'bg-[#34C759]' : 'bg-red-500'
                  }`}
                ></span>
                <span className="text-black">{yearsWithUs}</span>
              </div>

              <p className="text-sm mt-1 font-medium">
                {t('clientDetails.fields.type')}: {client.type || '—'}
              </p>

              <p className="mt-2 text-base sm:text-[18px] font-medium leading-[22px]">
                {displayName}
                {location && (
                  <>
                    {' — '}
                    {t('clientDetails.fields.location')}: {location}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
              {t('clientDetails.accountSection')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mb-6 sm:mb-8">
              {accountFields.map(([label, value]) => (
                <div key={label}>
                  <p className="text-base sm:text-[18px] font-semibold">
                    {label}
                  </p>
                  <div className="bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] rounded-lg px-4 py-3 mt-2 text-base sm:text-[18px] font-medium truncate">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
              <button
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded-xl text-base sm:text-[18px] w-full sm:w-auto hover:opacity-90 transition-opacity"
                onClick={() => setShowModal(true)}
              >
                <span className="hidden sm:inline">
                  {t('clientDetails.sendRenewal')}
                </span>
                <span className="sm:hidden">
                  {t('clientDetails.sendRenewalShort')}
                </span>
                <img
                  src={uil_message}
                  alt="Message"
                  className="w-4 h-4 sm:w-auto sm:h-auto"
                />
              </button>

              <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded-xl text-base sm:text-[18px] w-full sm:w-auto hover:opacity-90 transition-opacity">
                <span className="hidden sm:inline">
                  {t('clientDetails.resetPassword')}
                </span>
                <span className="sm:hidden">
                  {t('clientDetails.resetPasswordShort')}
                </span>
                <img
                  src={Lock}
                  alt="Lock"
                  className="w-4 h-4 sm:w-auto sm:h-auto"
                />
              </button>
            </div>
          </div>

          {/* Employee Details */}
          <div className="mt-12 sm:mt-16 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
                {t('clientDetails.employeeDetails')}
              </h2>
              <div className="flex items-center gap-2 text-base sm:text-[18px] font-medium cursor-pointer poppins-text">
                <span>{t('clientDetails.viewMore')}</span>
                <img
                  src={Icon}
                  alt="Icon"
                  className="w-4 h-4 sm:w-auto sm:h-auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mt-6 sm:mt-8">
              {employeeData.map(([role, count], i) => (
                <div key={i} className="w-full">
                  <div className="flex justify-between items-center text-lg sm:text-[20px] font-semibold">
                    <p>{role}</p>
                    <p className="text-base sm:text-[18px] font-medium">
                      {count}
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-gray-300 mt-2 rounded-full relative">
                    <div
                      className="h-1.5 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded-full"
                      style={{
                        width: `${(count / maxEmployeeCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ============= TAB: PERFORMANCE ============= */}
      {activeTab === 'performance' && <Performance clientId={clientId} />}

      {/* ============= RENEWAL MODAL ============= */}
      {showModal && (
        <RenewalPopupModal
          onClose={() => setShowModal(false)}
          client={client}
        />
      )}
    </div>
  );
};

export default withAdminLayout(ClientDetails);