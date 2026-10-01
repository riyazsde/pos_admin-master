import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Pencil,
  Loader2,
  Package,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSubscriptionsLoading,
  setSubscriptionsData,
  setSubscriptionsError,
} from '../../Store/Features/subscriptions/subscriptionsSlice';
import { subscriptionService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatPrice = (price) => {
  if (price === null || price === undefined) return '0';
  return Number(price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Detect tier from PlanName
const getTier = (planName = '') => {
  const name = String(planName).toLowerCase();
  const hasHW =
    name.includes('+ hw') ||
    name.includes('hardware') ||
    name.includes('bundle');

  if (name.includes('enterprise'))
    return { tier: 'enterprise', hasHW, order: 3 };
  if (name.includes('pro')) return { tier: 'pro', hasHW, order: 2 };
  return { tier: 'starter', hasHW, order: 1 };
};

// Popular = Pro tier
const isPopular = (plan) => {
  const name = String(plan?.PlanName || '').toLowerCase();
  return name.includes('pro') && !name.includes('enterprise');
};

// Badge label
const getBadgeLabel = (plan) => {
  const { tier, hasHW } = getTier(plan.PlanName);
  return `${tier.toUpperCase()}${hasHW ? ' BUNDLE' : ' PLAN'}`;
};

// Deposit note
const getDepositText = (price) => {
  if (!price) return '';
  const deposit = (Number(price) * 0.05).toFixed(2);
  return `$${deposit} deposit at signup · non-refundable on early cancel`;
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const SubscriptionPlans = ({ onBack, onGetStarted, onCreateNew }) => {
  const dispatch = useAppDispatch();

  const { plans, loading, hasLoaded } = useAppSelector(
    (state) => state.subscriptions
  );

  const [activeTier, setActiveTier] = useState('bundle');

  // ✅ Fetch once
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasLoaded || hasFetched.current) return;
    hasFetched.current = true;

    const fetchPlans = async () => {
      dispatch(setSubscriptionsLoading(true));
      try {
        const result = await subscriptionService.getAllPlans();
        dispatch(setSubscriptionsData(result));
      } catch (err) {
        console.error('Fetch plans error:', err);
        dispatch(setSubscriptionsError(err?.message || 'Failed to load plans'));
        toast.error('Failed to load plans', {
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Please try again later.',
        });
      }
    };

    fetchPlans();
  }, [dispatch, hasLoaded]);

  // ✅ Filter by tier
  const filteredPlans = plans.filter((plan) => {
    const { hasHW } = getTier(plan.PlanName);
    const type = String(plan.Subscription_Type || '').toLowerCase();
    const typeIsBundle = type.includes('hardware') || type.includes('bundle');
    const isBundle = hasHW || typeIsBundle;
    return activeTier === 'bundle' ? isBundle : !isBundle;
  });

  // Sort: starter → pro → enterprise
  const sortedPlans = [...filteredPlans].sort(
    (a, b) => getTier(a.PlanName).order - getTier(b.PlanName).order
  );

  const handleSelectPlan = (plan) => {
    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    onGetStarted?.(plan);
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* ================== HEADER ================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold text-black font-poppins">
            Subscriptions
          </h1>

          {/* Purchased / Create toggle */}
          <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
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

        {/* Create Subscription button */}
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#8E24AA] text-white font-semibold text-sm rounded-lg hover:bg-[#7B1FA2] transition-colors shadow-sm"
        >
          Create Subscription
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ================== TIER TOGGLE ================== */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full overflow-hidden shadow-sm">
          <button
            onClick={() => setActiveTier('saas')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTier === 'saas'
                ? 'bg-gradient-to-r from-[#F5E6F5] to-[#FCE4EC] text-gray-800'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            SaaS Only - no contract
          </button>
          <button
            onClick={() => setActiveTier('bundle')}
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              activeTier === 'bundle'
                ? 'bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Bundle - 2 year contract
          </button>
        </div>
      </div>

      {/* ================== PLANS GRID ================== */}
      {loading && !hasLoaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse h-[480px]"
            >
              <div className="h-5 w-32 bg-gray-200 rounded mb-6"></div>
              <div className="h-8 w-40 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-24 bg-gray-100 rounded mb-6"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : sortedPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3 bg-white rounded-2xl border border-gray-100 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
            <Package className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            No plans in this tier
          </p>
          <p className="text-xs text-gray-400 text-center max-w-xs mb-2">
            Try the other tier or create a new plan.
          </p>
          <button
            onClick={onCreateNew}
            className="mt-2 px-4 py-2 bg-[#8E24AA] text-white text-xs font-semibold rounded-lg"
          >
            Create Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sortedPlans.map((plan) => {
            const popular = isPopular(plan);
            const features = (plan.fesility || []).filter((f) => f.statue);

            return (
              <div
                key={plan.Admin_Plan_id || plan._id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all mt-4 lg:mt-0 ${
                  popular
                    ? 'bg-gradient-to-br from-[#6A1B9A] to-[#D32F2F] text-white shadow-xl lg:scale-[1.03] ring-2 ring-purple-200'
                    : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* POPULAR badge */}
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-[10px] font-bold text-[#8E24AA] rounded-full shadow-md border border-purple-200 whitespace-nowrap">
                    POPULAR
                  </div>
                )}

                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase ${
                      popular ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {getBadgeLabel(plan)}
                  </span>
                  <button
                    className={`p-1.5 rounded-md transition-colors ${
                      popular
                        ? 'hover:bg-white/20 text-white'
                        : 'hover:bg-gray-100 text-gray-400'
                    }`}
                    title="Edit plan"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Plan name */}
                <h3
                  className={`text-xl font-bold mb-1 ${
                    popular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.PlanName}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`text-3xl font-bold tabular-nums ${
                      popular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    ${formatPrice(plan.Price)}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      popular ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    /mo
                  </span>
                </div>

                {/* Deposit badge */}
                {plan.Price > 0 && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium mb-4 self-start ${
                      popular
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-purple-50 text-purple-700 border border-purple-100'
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        popular ? 'bg-white' : 'bg-purple-500'
                      }`}
                    ></span>
                    {getDepositText(plan.Price)}
                  </div>
                )}

                {/* Divider */}
                <div
                  className={`h-px mb-4 ${
                    popular ? 'bg-white/20' : 'bg-gray-100'
                  }`}
                ></div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {features.length === 0 ? (
                    <li
                      className={`text-xs italic ${
                        popular ? 'text-white/60' : 'text-gray-400'
                      }`}
                    >
                      No features listed
                    </li>
                  ) : (
                    features.map((f, idx) => (
                      <li
                        key={f._id || idx}
                        className={`flex items-start gap-2 text-xs ${
                          popular ? 'text-white/90' : 'text-gray-700'
                        }`}
                      >
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            popular ? 'text-white' : 'text-purple-600'
                          }`}
                        />
                        <span className="leading-relaxed">
                          {f.fesilityLine}
                        </span>
                      </li>
                    ))
                  )}
                </ul>

                {/* Get Started button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={!plan.Status}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    popular
                      ? 'bg-white text-[#8E24AA] hover:bg-gray-50 shadow-sm'
                      : 'bg-transparent border-2 border-[#8E24AA] text-[#8E24AA] hover:bg-purple-50'
                  }`}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;