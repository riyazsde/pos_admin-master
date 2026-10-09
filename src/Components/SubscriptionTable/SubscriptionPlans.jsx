// src/Components/SubscriptionTable/SubscriptionPlans.jsx

import React from 'react';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ---------------------------------------------------------------------------
// Static Figma Data (Matches the screenshot exactly)
// ---------------------------------------------------------------------------
const FIGMA_PLANS = [
  {
    id: 'starter',
    label: 'STARTER BUNDLE',
    name: 'Starter + HW',
    price: '49.99',
    deposit: '$899 deposit at signup · non-refundable on early cancel',
    contract: '2-year contract · ETF applies on early termination',
    isPro: false,
    features: [
      'POS + KDS + order management',
      'Location 5 devices',
      'Receipt printer (Epson Star)',
      'Full KDS + heat lock',
      'Loyalty & promo codes',
    ],
  },
  {
    id: 'pro',
    label: 'PRO BUNDLE',
    name: 'Pro + HW',
    price: '69.99',
    deposit: '$899 deposit at signup · non-refundable on early cancel',
    contract: '2-year contract · ETF applies on early termination',
    isPro: true, // This one gets the purple border and gradient button
    features: [
      'Everything in Starter',
      'Loyalty + promo codes',
      'Up to 3 locations & devices',
      'Full KDS + remote screen access',
      'Advanced reports & inventory',
    ],
  },
  {
    id: 'enterprise',
    label: 'ENTERPRISE BUNDLE',
    name: 'Enterprise + HW',
    price: '119.99',
    deposit: '$899 deposit at signup · non-refundable on early cancel',
    contract: '2-year contract · ETF applies on early termination',
    isPro: false,
    features: [
      'Everything in Pro',
      'Unlimited locations & devices',
      'Hardware SLA + 24h swap',
      'Dedicated account manager',
      'White-label / SSO SLA',
    ],
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const SubscriptionPlans = ({ onBack, onGetStarted, onCreateNew, onEditPlan }) => {
  const { t } = useTranslation();

  const handleSelectPlan = (plan) => {
    // Optional: store selected plan in session so form can pick it up
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    onGetStarted?.(plan);
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen font-poppins">
      {/* ================== HEADER ================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>

          <h1 className="text-xl lg:text-2xl font-bold text-black">
            {t('subscriptions.title')}
          </h1>

          {/* Purchased / Create Toggle */}
          <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={onBack}
              className="px-4 py-1.5 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Purchased
            </button>
            <button className="px-4 py-1.5 bg-[#8E24AA] text-white rounded-md text-sm font-medium shadow-sm">
              Create
            </button>
          </div>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          Create Subscription <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ================== TIER TOGGLE ================== */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full overflow-hidden shadow-sm border border-gray-200">
          <button className="px-8 py-3 text-sm font-semibold bg-gradient-to-r from-[#F5E6F5] to-[#FCE4EC] text-gray-800">
            SaaS Only - no contract
          </button>
          <button className="px-8 py-3 text-sm font-semibold bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white">
            Bundle - 2-year contract
          </button>
        </div>
      </div>

      {/* ================== STATIC FIGMA GRID ================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {FIGMA_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 flex flex-col transition-all mt-4 lg:mt-0 bg-white shadow-sm hover:shadow-md ${
              plan.isPro ? 'border-2 border-[#8E24AA]' : 'border border-gray-200'
            }`}
          >
            {/* Popular Badge for Pro */}
            {plan.isPro && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white text-[10px] font-bold rounded-full shadow-sm whitespace-nowrap">
                Most Popular
              </div>
            )}

            {/* Header row: Badge + Edit */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                {plan.label}
              </span>
              <button
                type="button"
                onClick={() => onEditPlan?.(plan)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              </button>
            </div>

            {/* Plan Name */}
            <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-gray-900 tabular-nums">
                ${plan.price}
              </span>
              <span className="text-sm font-medium text-gray-500">/mo</span>
            </div>

            {/* Deposit Tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium mb-4 self-start bg-orange-50 text-orange-700 border border-orange-100 w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
              <span className="truncate">{plan.deposit}</span>
            </div>

            {/* Contract Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium mb-6 self-start bg-purple-50 text-purple-700 border border-purple-200 w-full">
              <span className="w-3 h-3 rounded-sm border border-purple-400 flex items-center justify-center shrink-0">
                <Check className="w-2 h-2 text-purple-600" />
              </span>
              <span className="truncate">{plan.contract}</span>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-green-600" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                plan.isPro
                  ? 'bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white shadow-md hover:opacity-90'
                  : 'bg-white border-2 border-[#8E24AA] text-[#8E24AA] hover:bg-purple-50'
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;