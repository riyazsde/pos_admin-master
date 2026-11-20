// src/Components/SubscriptionTable/SubscriptionDetails.jsx

import React from 'react';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  FileText,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSubscriptionDetailsData } from './subscriptionDetailsData';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
};

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString('en-US') : '—';
};

const displayValue = (value) => {
  if (value === true) return 'Active';
  if (value === false) return 'Inactive';
  return value === null || value === undefined || value === '' ? '—' : value;
};

const getBillingField = (record, ...fields) => {
  const field = fields.find(
    (field) =>
      record?.[field] !== undefined &&
      record?.[field] !== null &&
      record?.[field] !== ''
  );
  return field ? record[field] : '—';
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const SubscriptionDetails = ({ subscription, onBack }) => {
  const { t } = useTranslation();

  const details = getSubscriptionDetailsData(subscription);
  const numericPlanPrice =
    details.planPrice === null || details.planPrice === ''
      ? null
      : Number(details.planPrice);
  const currentPlan = {
    name: details.planName,
    type: details.planType,
    price: Number.isFinite(numericPlanPrice) ? numericPlanPrice : null,
  };

  const renewalDate = formatDate(details.renewalDate);
  const nextBilling = formatDate(details.nextBillingDate);
  const contractEndDate = formatDate(details.contractEndDate);

  // Derive validity + estimate from the same source of truth
  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen font-poppins">
      {/* ================= BREADCRUMB & HEADER ================= */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          Subscriptions <span className="text-gray-400 font-normal mx-1">&gt;</span> Subscription & Billing Details
        </h1>
      </div>

      {/* ================= GRADIENT PLAN HEADER ================= */}
      <div className="bg-gradient-to-r from-[#7B1FA2] via-[#9C27B0] to-[#D32F2F] rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Current Plan</span>
            <h2 className="text-2xl font-bold mt-1">{currentPlan.name}</h2>
            <p className="text-sm text-white/80 mt-1">{currentPlan.type}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Plan Price</span>
            <div className="text-3xl font-bold mt-1">
              {currentPlan.price === null ? '—' : formatAmount(currentPlan.price)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20 relative z-10">
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Renewal Date</p>
            <p className="text-sm font-medium">{renewalDate}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Deposit Status</p>
            <p className="text-sm font-medium">{displayValue(details.depositStatus)}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Contract Status</p>
            <p className="text-sm font-medium">{displayValue(details.contractStatus)}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Next Billing</p>
            <p className="text-sm font-medium">{nextBilling}</p>
          </div>
        </div>
      </div>

      {/* ================= INFO & ETF CALCULATOR GRID ================= */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Account & Subscription Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#8E24AA]" /> Account & Subscription Details
          </h3>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Customer</p>
              <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                <Building2 className="w-4 h-4 text-gray-500" />
                {details.businessName}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Purchase Date</p>
              <p className="text-sm font-medium text-gray-800">{formatDate(details.purchaseDate)}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">No. of Renewals</p>
              <p className="text-sm font-medium text-gray-800">{details.renewalCount ?? '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Device Count</p>
              <p className="text-sm font-medium text-gray-800">{details.deviceCount ?? '—'}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Contract End Date</p>
              <p className="text-sm font-medium text-gray-800">{contractEndDate}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Deposit Amount</p>
              <p className="text-sm font-medium text-gray-800">{formatAmount(details.depositAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SELECTED SUBSCRIPTION PAYMENT ================= */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#D32F2F]" /> Payment Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Customer</p>
            <p className="text-sm font-medium text-gray-800">{details.businessName}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Payment Method</p>
            <p className="text-sm font-medium text-gray-800">{details.paymentMethod}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Payment Status</p>
            <p className="text-sm font-medium text-gray-800">{displayValue(details.paymentStatus)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Transaction Reference</p>
            <p className="text-sm font-medium text-gray-800">{details.transactionReference}</p>
          </div>
        </div>
      </div>

      {/* ================= BILLING HISTORY ================= */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" /> Billing History
          </h3>
        </div>
        {details.billingHistory.length === 0 ? (
          <p className="px-5 py-8 text-sm text-center text-gray-500">
            {t('subscriptions.billingHistoryUnavailable')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {details.billingHistory.map((item, index) => (
                  <tr
                    key={item.id || item.Invoice || item.invoice || index}
                    className="border-b border-gray-50"
                  >
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(getBillingField(item, 'Date', 'date', 'Purchase_Date', 'createdAt'))}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 font-medium">
                      {getBillingField(item, 'Description', 'description', 'PlanName')}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                      {formatAmount(getBillingField(item, 'Amount', 'amount'))}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {getBillingField(item, 'Status', 'status')}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 font-mono">
                      {getBillingField(item, 'Invoice', 'invoice', 'Transaction_Reference')}
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

export default SubscriptionDetails;