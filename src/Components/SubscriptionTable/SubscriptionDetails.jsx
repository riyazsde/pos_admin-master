// src/Components/SubscriptionTable/SubscriptionDetails.jsx

import React from 'react';
import { ArrowLeft, Building2, CreditCard, Calendar, Hash, BadgeCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Field = ({ label, value, mono = false }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
      {label}
    </span>
    <span
      className={`text-sm text-gray-800 break-all ${
        mono ? 'font-mono text-xs' : 'font-poppins'
      }`}
    >
      {value || '—'}
    </span>
  </div>
);

const SubscriptionDetails = ({ subscription, onBack }) => {
  const { t, i18n } = useTranslation();

  if (!subscription) return null;

  const plan = subscription.Plan || {};

  const formatDate = (iso) => {
    if (!iso) return '—';
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return new Date(iso).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const status = subscription.Subscription_Status || '—';
  const statusColor =
    status.toLowerCase() === 'active'
      ? 'bg-green-100 text-green-700'
      : status.toLowerCase() === 'expired'
      ? 'bg-red-100 text-red-700'
      : 'bg-gray-100 text-gray-700';

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black font-poppins">
            {subscription.Business_Name || 'Subscription'}
          </h1>
          <p className="text-xs text-gray-500">
            Subscription ID: <span className="font-mono">#{subscription.Subscription_id}</span>
          </p>
        </div>

        <span
          className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="w-5 h-5 text-[#8E24AA]" />
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Plan Information
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Plan Name" value={plan.PlanName} />
            <Field label="Plan ID" value={plan.Admin_Plan_id} />
            <Field label="Subscription Type" value={plan.Subscription_Type} />
            <Field label="Price" value={plan.Price != null ? `$${plan.Price}` : '—'} />
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-[#D32F2F]" />
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Payment
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Amount"
              value={subscription.Amount != null ? `$${subscription.Amount}` : '—'}
            />
            <Field label="Mode of Payment" value={subscription.Mode_Of_Payment} />
            <Field label="Transaction ID" value={subscription.Transaction_id} />
            <Field
              label="Transaction Reference"
              value={subscription.Transaction_Reference}
              mono
            />
          </div>
        </div>

        {/* Business Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[#8E24AA]" />
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Business
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Business Name" value={subscription.Business_Name} />
            <Field label="Restaurant User ID" value={subscription.Restaurant_User_id} />
          </div>
        </div>

        {/* Dates Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#D32F2F]" />
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Timeline
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Purchase Date" value={formatDate(subscription.Purchase_Date)} />
            <Field label="Renewal Date" value={formatDate(subscription.Renewal_Date)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;