// src/Components/SubscriptionTable/CreateSubscriptionForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, Save, Loader2, Info } from 'lucide-react';
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
  fesility: (plan?.fesility || []).map((f) => ({
    fesilityLine: f.fesilityLine,
    statue: f.statue,
  })),
  Status: plan?.Status ?? true,
});

const SUBSCRIPTION_TYPES = ['SaaS Only', 'SaaS + Hardware'];

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
    className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-[#2E2A40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
      props.className || ''
    }`}
  />
);

const Textarea = ({ ...props }) => (
  <textarea
    {...props}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-[#2E2A40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-[#2E2A40] bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
  const [featureInput, setFeatureInput] = useState('');
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
          Subscription_Type: parsed.Subscription_Type || prev.Subscription_Type,
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
  const addFeature = () => {
    const line = featureInput.trim();
    if (!line) return;
    if (form.fesility.some((f) => f.fesilityLine === line)) {
      toast.error(t('subscriptions.featureAlreadyAdded'));
      return;
    }
    update('fesility', [
      ...form.fesility,
      { fesilityLine: line, statue: true },
    ]);
    setFeatureInput('');
  };

  const removeFeature = (idx) =>
    update(
      'fesility',
      form.fesility.filter((_, i) => i !== idx)
    );

  const toggleFeature = (idx) =>
    update(
      'fesility',
      form.fesility.map((f, i) =>
        i === idx ? { ...f, statue: !f.statue } : f
      )
    );

  // ---- Validation ----
  const validate = () => {
    if (!form.PlanName.trim()) return t('subscriptions.validation.planNameRequired');
    if (!form.Price || Number(form.Price) <= 0)
      return t('subscriptions.validation.priceRequired');
    if (form.fesility.length === 0)
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
      fesility: form.fesility.map((f) => ({
        fesilityLine: f.fesilityLine,
        statue: f.statue,
      })),
      Status: form.Status,
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
      // 1️⃣ Create the plan in the catalog
      const planResult = await subscriptionService.createPlan(basePayload);
      dispatch(addSubscriptionPlan(planResult));

      // 2️⃣ ALSO create a purchased subscription so it appears in the table
      //    (Replace this with your actual API call — this is the missing piece.)
      let newSubscription = null;
      try {
        if (subscriptionService.createSubscription) {
          newSubscription = await subscriptionService.createSubscription({
            Plan: planResult,
            Business_Name: form.Business_Name || 'New Business',
            Amount: Number(form.Price),
            Purchase_Date: new Date().toISOString(),
            Renewal_Date: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString(),
            Subscription_Status: 'Active',
            Mode_Of_Payment: form.Mode_Of_Payment || 'Stripe',
          });
        } else {
          // Fallback: build a local subscription object so the UI still updates
          newSubscription = {
            Subscription_id: `local-${Date.now()}`,
            Business_Name: form.Business_Name || 'New Business',
            Amount: Number(form.Price),
            Mode_Of_Payment: form.Mode_Of_Payment || 'Stripe',
            Purchase_Date: new Date().toISOString(),
            Renewal_Date: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString(),
            Subscription_Status: 'Active',
            Plan: {
              Admin_Plan_id: planResult?.Admin_Plan_id,
              PlanName: planResult?.PlanName || form.PlanName,
              Subscription_Type: planResult?.Subscription_Type || form.Subscription_Type,
              Price: Number(form.Price),
            },
          };
        }
      } catch (subErr) {
        console.warn('Subscription create failed, plan was still saved:', subErr);
      }

      toast.success(t('subscriptions.createSuccess'), {
        id: toastId,
        description: t('subscriptions.createSuccessDesc', {
          name: planResult?.PlanName || form.PlanName,
        }),
        duration: 3000,
      });

      sessionStorage.removeItem('selectedPlan');

      setTimeout(() => {
        // ✅ Pass the new subscription object back to the parent
        if (onComplete) onComplete(newSubscription);
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
    <div className="min-h-screen w-full bg-gray-50 poppins-text p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 max-w-4xl mx-auto">
        <button
          onClick={onBack || (() => navigate(-1))}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2A40]">
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
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <div>
          <Label>{t('subscriptions.form.description')}</Label>
          <Textarea
            rows={3}
            value={form.Description}
            onChange={(e) => update('Description', e.target.value)}
            placeholder={t('subscriptions.form.descriptionPlaceholder')}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* Features */}
        <div>
          <Label required>{t('subscriptions.form.features')}</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addFeature())
              }
              placeholder={t('subscriptions.form.featurePlaceholder')}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={addFeature}
              disabled={isSubmitting}
              className="px-4 py-3 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 text-sm font-medium shrink-0 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> {t('common.save')}
            </button>
          </div>

          {form.fesility.length > 0 && (
            <ul className="mt-3 space-y-2">
              {form.fesility.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-purple-50/60 border border-purple-100"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={feature.statue}
                      onChange={() => toggleFeature(idx)}
                      className="w-4 h-4 accent-purple-600"
                    />
                    <span
                      className={`text-sm truncate ${
                        feature.statue
                          ? 'text-gray-800 font-medium'
                          : 'text-gray-400 line-through'
                      }`}
                      title={feature.fesilityLine}
                    >
                      {feature.fesilityLine}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Status toggle */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <input
            id="status"
            type="checkbox"
            checked={form.Status}
            onChange={(e) => update('Status', e.target.checked)}
            className="w-5 h-5 accent-purple-600"
            disabled={isSubmitting}
          />
          <label htmlFor="status" className="text-sm text-gray-700">
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