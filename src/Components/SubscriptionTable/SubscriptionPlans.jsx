import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Loader2, Plus, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { subscriptionService } from '../../Services/apiService';

const SUBSCRIPTION_TYPES = [
  'SaaS Only',
  'SaaS + Hardware',
  'Franchise',
  'Enterprise',
  'Pilot',
  'Government',
  'White-label',
];

const SubscriptionPlans = ({ onBack, onGetStarted, onCreateNew, onEditPlan }) => {
  const { t } = useTranslation();
  const [subscriptionType, setSubscriptionType] = useState(SUBSCRIPTION_TYPES[0]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchPlans = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await subscriptionService.getPublicPlans(subscriptionType);
        if (active) setPlans(result.data);
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              'Failed to load subscription plans'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPlans();
    return () => {
      active = false;
    };
  }, [subscriptionType, reloadKey]);

  const handleSelectPlan = (plan) => {
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    onGetStarted?.(plan);
  };

  return (
    <div className="min-h-screen bg-white p-4 font-poppins lg:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-100"
            aria-label="Back to subscriptions"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-black lg:text-2xl">
            {t('subscriptions.title')}
          </h1>
          <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-1">
            <button
              onClick={onBack}
              className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              Purchased
            </button>
            <button className="rounded-md bg-[#8E24AA] px-4 py-1.5 text-sm font-medium text-white shadow-sm">
              Create
            </button>
          </div>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Create Subscription <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-8 flex justify-center overflow-x-auto">
        <div className="inline-flex min-w-max overflow-hidden rounded-full border border-gray-200 shadow-sm">
          {SUBSCRIPTION_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSubscriptionType(type)}
              aria-pressed={subscriptionType === type}
              className={`px-5 py-3 text-sm font-semibold transition-colors ${
                subscriptionType === type
                  ? 'bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white'
                  : 'bg-gradient-to-r from-[#F5E6F5] to-[#FCE4EC] text-gray-700 hover:bg-purple-100'
              }`}
            >
              {type === 'SaaS Only'
                ? 'SaaS Only - no contract'
                : type === 'SaaS + Hardware'
                  ? 'Bundle - 2-year contract'
                  : type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
          Loading plans…
        </div>
      ) : error ? (
        <div className="mx-auto flex min-h-52 max-w-xl flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setReloadKey((key) => key + 1)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-gray-600">No published plans</p>
          <p className="text-xs text-gray-400">
            There are no plans available for {subscriptionType}.
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const features = Array.isArray(plan.fesility)
              ? plan.fesility.filter((feature) => feature.statue !== false)
              : [];
            const planId = plan.Admin_Plan_id || plan.id || `${plan.PlanName}-${index}`;

            return (
              <article
                key={planId}
                className="flex flex-col rounded-xl border border-gray-300 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {plan.Subscription_Type || subscriptionType}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditPlan?.(plan)}
                    aria-label={`Edit ${plan.PlanName || 'plan'}`}
                    className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-purple-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </button>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {plan.PlanName || 'Untitled plan'}
                </h2>
                <div className="mb-3 mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold tabular-nums text-[#8E24AA]">
                    ${Number(plan.Price || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">/ mo</span>
                </div>
                {plan.Description && (
                  <p className="mb-4 text-xs leading-relaxed text-gray-600">
                    {plan.Description}
                  </p>
                )}
                {plan.expiry_day != null && (
                  <p className="mb-3 rounded-md bg-purple-50 px-3 py-2 text-xs text-purple-700">
                    Expires after {plan.expiry_day} days
                  </p>
                )}
                <ul className="mb-6 flex-1 space-y-2">
                  {features.map((feature, featureIndex) => (
                    <li
                      key={`${feature.fesilityLine}-${featureIndex}`}
                      className="flex items-start gap-2 text-xs text-gray-700"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      <span>{feature.fesilityLine}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full rounded-lg border border-[#8E24AA] py-2.5 text-sm font-medium text-[#8E24AA] transition-colors hover:bg-purple-50"
                >
                  Get Started
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
