import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { subscriptionService } from '../../Services/apiService';
import DeletePaymentConfirmModal from '../Settings/DeletePaymentConfirmModal';

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
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const [pendingDeletePlan, setPendingDeletePlan] = useState(null);

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

  const handleDeletePlan = (plan) => {
    const planId = plan.Admin_Plan_id || plan.id;
    if (!planId) {
      toast.error('Unable to delete this plan because it has no ID.');
      return;
    }
    setPendingDeletePlan(plan);
  };

  const confirmDeletePlan = async () => {
    if (!pendingDeletePlan) return;
    const planId = pendingDeletePlan.Admin_Plan_id || pendingDeletePlan.id;
    setDeletingPlanId(planId);
    const toastId = toast.loading('Deleting plan…');
    try {
      await subscriptionService.deletePlan(planId);
      setPlans((currentPlans) =>
        currentPlans.filter(
          (item) => (item.Admin_Plan_id || item.id) !== planId
        )
      );
      setPendingDeletePlan(null);
      toast.success('Plan deleted successfully.', { id: toastId });
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message ||
          requestError?.message ||
          'Failed to delete plan.',
        { id: toastId }
      );
    } finally {
      setDeletingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 font-poppins lg:p-6">
      <DeletePaymentConfirmModal
        isOpen={Boolean(pendingDeletePlan)}
        onClose={() => {
          if (deletingPlanId === null) setPendingDeletePlan(null);
        }}
        onConfirm={confirmDeletePlan}
        title="Delete subscription plan?"
        description={`Are you sure you want to delete "${pendingDeletePlan?.PlanName || 'this plan'}"? This action cannot be undone.`}
        loading={deletingPlanId !== null}
      />
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
        <div className="mx-auto grid max-w-[1024px] grid-cols-1 gap-2 min-[520px]:grid-cols-3">
          {plans.map((plan, index) => {
            const features = Array.isArray(plan.fesility)
              ? plan.fesility
                  .filter((feature) => feature.statue !== false)
                  .slice(0, 5)
              : [];
            const planId = plan.Admin_Plan_id || plan.id || `${plan.PlanName}-${index}`;
            const isPopular = index === 1;
            const isBundle = plan.Subscription_Type === 'SaaS + Hardware';
            const planLabel = `${plan.PlanName || 'PLAN'}${isBundle ? ' BUNDLE' : ''}`;

            return (
              <article
                key={planId}
                className={`relative flex min-h-[210px] flex-col rounded-[11px] bg-white p-[10px] ${
                  isPopular
                    ? 'border-2 border-[#8E24AA]'
                    : 'border border-[#d1d1d1]'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] px-2 py-[3px] text-[8px] font-semibold leading-none text-white">
                    Best value
                  </span>
                )}
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-medium uppercase leading-[11px] tracking-wide text-[#999]">
                      {planLabel}
                    </p>
                    <h2 className="truncate text-[13px] font-semibold leading-[16px] text-[#222]">
                      {plan.PlanName || 'Untitled plan'}
                    </h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[18px] font-semibold leading-[21px] tabular-nums text-[#a00065]">
                        ${Number(plan.Price || 0).toFixed(2)}
                      </span>
                      <span className="text-[9px] text-[#777]">/ mo</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-[3px]">
                    <button
                      type="button"
                      onClick={() => onEditPlan?.(plan)}
                      aria-label={`Edit ${plan.PlanName || 'plan'}`}
                      className="p-[2px] text-black hover:text-purple-700"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(plan)}
                      disabled={deletingPlanId === planId}
                      aria-label={`Delete ${plan.PlanName || 'plan'}`}
                      className="p-[2px] text-red-600 hover:text-red-800"
                    >
                      {deletingPlanId === planId ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-1 flex min-h-[22px] items-center gap-1.5 rounded-[4px] border border-[#f6a53b] bg-[#fff9ed] px-1.5 text-[8px] leading-[10px] text-[#b56a00]">
                  <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-[#f29922]" />
                  <span className="truncate">
                    {plan.Description || 'Subscription plan'}
                  </span>
                </div>
                <div className="mt-1 flex min-h-[22px] items-center gap-1.5 rounded-[4px] border border-[#c084fc] bg-[#fbf6ff] px-1.5 text-[8px] leading-[10px] text-[#7735a5]">
                  <Check className="h-[10px] w-[10px] shrink-0" />
                  <span className="truncate">
                    {plan.expiry_day != null
                      ? `Expires after ${plan.expiry_day} days`
                      : isBundle
                        ? 'Bundle subscription'
                        : 'No contract'}
                  </span>
                </div>
                <ul className="my-2 min-h-0 flex-1 space-y-1 overflow-hidden">
                  {features.map((feature, featureIndex) => (
                    <li
                      key={`${feature.fesilityLine}-${featureIndex}`}
                      className="flex min-w-0 items-center gap-1.5 text-[9px] leading-[12px] text-[#333]"
                    >
                      <Check className="h-[11px] w-[11px] shrink-0 text-[#36b878]" />
                      <span className="truncate">{feature.fesilityLine}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`h-[30px] w-full rounded-[6px] border border-[#a340c0] text-[11px] font-medium leading-none transition-colors ${
                    isPopular
                      ? 'bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white'
                      : 'bg-white text-[#a00065] hover:bg-purple-50'
                  }`}
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
