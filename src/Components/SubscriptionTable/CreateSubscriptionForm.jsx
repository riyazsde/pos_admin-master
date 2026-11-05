// src/Components/SubscriptionTable/CreateSubscriptionForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Save, Loader2, Info, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../Store/hooks';
import {
  addSubscriptionPlan,
  updateSubscriptionPlan,
} from '../../Store/Features/subscriptions/subscriptionsSlice';
import { subscriptionService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Initial form
// ---------------------------------------------------------------------------
const buildInitialForm = (plan) => ({
  PlanName: plan?.PlanName || '',
  Description: plan?.Description || '',
  Subscription_Type: plan?.Subscription_Type || 'SaaS Only',
  Price: plan?.Price ?? '',
  expiry_day: plan?.expiry_day ?? null,
  fesility: (plan?.fesility || []).map((f) => ({
    fesilityLine: f.fesilityLine,
    statue: f.statue,
  })),
  Published: plan?.Published ?? plan?.Status ?? true,
});

const SUBSCRIPTION_TYPES = [
  'SaaS Only',
  'SaaS + Hardware',
  'Franchise',
  'Enterprise',
  'Pilot',
  'Government',
  'White-label',
];

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------
const Label = ({ children, required }) => (
  <label className="block text-sm font-semibold text-[#2E2A40] mb-2">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className={`w-full rounded-md border-0 bg-[#F6EAF0] px-3 py-2.5 text-sm text-[#2E2A40] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
      props.className || ''
    }`}
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full rounded-md border-0 bg-[#F6EAF0] px-3 py-2.5 text-sm text-[#2E2A40] focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    {children}
  </select>
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const CreateSubscriptionForm = ({ onBack, onComplete, editingPlan }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isEditMode = Boolean(editingPlan?.Admin_Plan_id);

  const [form, setForm] = useState(() => buildInitialForm(editingPlan));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preselectedPlan, setPreselectedPlan] = useState(null);

  // ✅ Preselected plan from plans view (only in create mode)
  useEffect(() => {
    if (isEditMode) return;
    const raw = sessionStorage.getItem('selectedPlan');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setPreselectedPlan(parsed);
        setForm((prev) => ({
          ...prev,
          PlanName: parsed.PlanName || prev.PlanName,
          Description: parsed.Description || prev.Description,
          Subscription_Type: parsed.Subscription_Type || prev.Subscription_Type,
          Price: parsed.Price ?? prev.Price,
          expiry_day: parsed.expiry_day ?? prev.expiry_day,
          fesility: Array.isArray(parsed.fesility)
            ? parsed.fesility.map((feature) => ({
                fesilityLine: feature.fesilityLine || '',
                statue: feature.statue !== false,
              }))
            : prev.fesility,
        }));
      } catch {
        // ignore
      }
    }
  }, [isEditMode]);

  // ✅ If editingPlan changes (e.g. user clicks edit on another plan), rebuild form
  useEffect(() => {
    if (editingPlan) setForm(buildInitialForm(editingPlan));
  }, [editingPlan]);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ---- Features ----
  const addFeature = () =>
    update('fesility', [...form.fesility, { fesilityLine: '', statue: true }]);
  const removeFeature = (idx) =>
    update(
      'fesility',
      form.fesility.filter((_, i) => i !== idx)
    );

  // ---- Validation ----
  const validate = () => {
    if (!form.PlanName.trim()) return t('subscriptions.validation.planNameRequired');
    if (!form.Price || Number(form.Price) <= 0)
      return t('subscriptions.validation.priceRequired');
    if (!form.fesility.some((feature) => feature.fesilityLine.trim()))
      return t('subscriptions.validation.featureRequired');
    return null;
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();

  const err = validate();
  if (err) {
    toast.error(err);
    return;
  }

  setIsSubmitting(true);
  const toastId = toast.loading(
    isEditMode ? t('subscriptions.updatingPlan') : t('subscriptions.creatingPlan')
  );

  try {
    const basePayload = {
      PlanName: form.PlanName.trim(),
      Subscription_Type: form.Subscription_Type,
      Description: form.Description.trim(),
      Price: Number(form.Price),
      expiry_day:
        form.expiry_day === '' || form.expiry_day == null
          ? null
          : Number(form.expiry_day),
      fesility: form.fesility
        .filter((f) => f.fesilityLine.trim())
        .map((f) => ({
        fesilityLine: f.fesilityLine.trim(),
        statue: f.statue,
        })),
      Published: form.Published,
    };

    let result;

    if (isEditMode) {
      const payload = { id: editingPlan.Admin_Plan_id, ...basePayload };
      result = await subscriptionService.updatePlan(payload);
      dispatch(updateSubscriptionPlan(result));

      toast.success(t('subscriptions.updateSuccess'), {
        id: toastId,
        description: t('subscriptions.updateSuccessDesc', {
          name: result?.PlanName || form.PlanName,
        }),
        duration: 3000,
      });
    } else {
      const planResult = await subscriptionService.createPlan(basePayload);
      dispatch(addSubscriptionPlan(planResult));

      toast.success(t('subscriptions.createSuccess'), {
        id: toastId,
        description: t('subscriptions.createSuccessDesc', {
          name: planResult?.PlanName || form.PlanName,
        }),
        duration: 3000,
      });

      sessionStorage.removeItem('selectedPlan');
      setTimeout(() => {
        if (onComplete) onComplete(planResult);
        else navigate('/subscription-list');
      }, 1200);
      return; // early return so we don't fall through
    }

    sessionStorage.removeItem('selectedPlan');
    setTimeout(() => {
      if (onComplete) onComplete(null);
      else navigate('/subscription-list');
    }, 1200);
  } catch (error) {
    console.error('Plan save error:', error);
    toast.error(
      isEditMode
        ? t('subscriptions.updateFailed')
        : t('subscriptions.createFailed'),
      {
        id: toastId,
        description:
          error?.response?.data?.errors?.[0]?.msg ||
          error?.response?.data?.message ||
          error?.message ||
          t('common.error'),
      }
    );
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen w-full bg-white poppins-text p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 max-w-4xl mx-auto">
        <button
          onClick={onBack || (() => navigate(-1))}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2E2A40]">
            {isEditMode
              ? t('subscriptions.editPlanTitle')
              : t('subscriptions.createPlanTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {isEditMode
              ? t('subscriptions.editPlanSubtitle', {
                  name: editingPlan.PlanName,
                })
              : t('subscriptions.createPlanSubtitle')}
          </p>
        </div>
      </div>

      {/* Preselected banner (create only) */}
      {!isEditMode && preselectedPlan && (
        <div className="max-w-4xl mx-auto mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-purple-50 border border-purple-100">
          <Info className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
          <div className="text-xs text-purple-800">
            <p className="font-semibold mb-0.5">
              {t('subscriptions.preselectedPlan', {
                name: preselectedPlan.PlanName,
                price: Number(preselectedPlan.Price).toFixed(2),
              })}
            </p>
            <p className="text-purple-600">
              {t('subscriptions.preselectedHint')}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto space-y-3"
      >
        <section className="rounded-md border border-gray-300 p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-medium text-gray-900">
            Subscription Info
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8">
            <div>
            <Label required>{t('subscriptions.form.planName')}</Label>
            <Input
              type="text"
              value={form.PlanName}
              onChange={(e) => update('PlanName', e.target.value)}
              placeholder={t('subscriptions.form.planNamePlaceholder')}
              disabled={isSubmitting}
            />
          </div>
            <div>
            <Label required>{t('subscriptions.form.subscriptionType')}</Label>
            <Select
              value={form.Subscription_Type}
              onChange={(e) => update('Subscription_Type', e.target.value)}
              disabled={isSubmitting}
            >
              {SUBSCRIPTION_TYPES.map((tp) => (
                <option key={tp}>{tp}</option>
              ))}
            </Select>
          </div>
            <div>
            <Label required>{t('subscriptions.form.price')}</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.Price}
              onChange={(e) => update('Price', e.target.value)}
              placeholder={t('subscriptions.form.pricePlaceholder')}
              disabled={isSubmitting}
            />
          </div>
            <div>
              <Label>{t('subscriptions.form.description')}</Label>
              <Input
                type="text"
                value={form.Description}
                onChange={(e) => update('Description', e.target.value)}
                placeholder={t('subscriptions.form.descriptionPlaceholder')}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label>Expiry day (optional)</Label>
              <Input
                type="number"
                min="1"
                value={form.expiry_day ?? ''}
                onChange={(e) => update('expiry_day', e.target.value)}
                placeholder="No expiry"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="rounded-md border border-gray-300 p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-medium text-gray-900">
            Features &amp; Permissions
          </h2>
          {form.fesility.length > 0 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
              {form.fesility.map((feature, idx) => (
                <div
                  key={idx}
                  className="min-w-0"
                >
                  <Label>Feature {idx + 1}</Label>
                  <Input
                    type="text"
                    value={feature.fesilityLine}
                    onChange={(e) =>
                      update(
                        'fesility',
                        form.fesility.map((item, itemIndex) =>
                          itemIndex === idx
                            ? { ...item, fesilityLine: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder={t('subscriptions.form.featurePlaceholder')}
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={addFeature}
              disabled={isSubmitting}
              className="flex min-w-28 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
            <button
              type="button"
              onClick={() => removeFeature(form.fesility.length - 1)}
              disabled={isSubmitting || form.fesility.length === 0}
              className="flex min-w-28 items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" /> Remove
            </button>
          </div>
        </section>

        {/* Status toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <input
            id="published"
            type="checkbox"
            checked={form.Published}
            onChange={(e) => update('Published', e.target.checked)}
            className="w-5 h-5 accent-purple-600"
            disabled={isSubmitting}
          />
          <label htmlFor="published" className="text-sm text-gray-700">
            {isEditMode
              ? t('subscriptions.form.keepActive')
              : t('subscriptions.form.activateNow')}
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onBack || (() => navigate(-1))}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white font-semibold text-sm rounded-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditMode
                  ? t('subscriptions.updating')
                  : t('subscriptions.creating')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode
                  ? t('subscriptions.updatePlan')
                  : t('subscriptions.createPlan')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubscriptionForm;