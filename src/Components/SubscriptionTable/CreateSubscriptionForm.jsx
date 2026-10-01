import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, Save, Loader2, Info } from 'lucide-react';

import { useAppDispatch } from '../../Store/hooks';
import { addSubscriptionPlan } from '../../Store/Features/subscriptions/subscriptionsSlice';
import { subscriptionService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
const initialForm = {
  PlanName: '',
  Description: '',
  Subscription_Type: 'SaaS Only',
  Price: '',
  fesility: [],
};

const SUBSCRIPTION_TYPES = ['SaaS Only', 'SaaS + Hardware'];

// ---------------------------------------------------------------------------
// Small UI helpers
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
const CreateSubscriptionForm = ({ onBack, onComplete }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState(initialForm);
  const [featureInput, setFeatureInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preselectedPlan, setPreselectedPlan] = useState(null);

  // ✅ Read the plan chosen on the previous screen (if any)
  useEffect(() => {
    const raw = sessionStorage.getItem('selectedPlan');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setPreselectedPlan(parsed);
        // Optionally pre-fill some fields based on the selected plan
        setForm((prev) => ({
          ...prev,
          Subscription_Type: parsed.Subscription_Type || prev.Subscription_Type,
        }));
      } catch {
        // ignore bad JSON
      }
    }
  }, []);

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ---- Features ----
  const addFeature = () => {
    const line = featureInput.trim();
    if (!line) return;
    if (form.fesility.some((f) => f.fesilityLine === line)) {
      toast.error('Feature already added');
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
    if (!form.PlanName.trim()) return 'Plan Name is required';
    if (!form.Price || Number(form.Price) <= 0)
      return 'Price must be greater than 0';
    if (form.fesility.length === 0) return 'Add at least one feature';
    return null;
  };

  // ---- Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating plan...');

    try {
      const payload = {
        PlanName: form.PlanName.trim(),
        Subscription_Type: form.Subscription_Type,
        Description: form.Description.trim(),
        Price: Number(form.Price),
        fesility: form.fesility.map((f) => ({
          fesilityLine: f.fesilityLine,
          statue: f.statue,
        })),
      };

      const created = await subscriptionService.createPlan(payload);

      // ✅ Add to Redux so it appears in the plans list without refetch
      dispatch(addSubscriptionPlan(created));

      toast.success('Plan created successfully!', {
        id: toastId,
        description: `"${created?.PlanName || form.PlanName}" is now available.`,
        duration: 3000,
      });

      sessionStorage.removeItem('selectedPlan');

      setTimeout(() => {
        if (onComplete) onComplete();
        else navigate('/subscription-list');
      }, 1200);
    } catch (error) {
      console.error('Create plan error:', error);
      toast.error('Failed to create plan', {
        id: toastId,
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Please check the form and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 poppins-text p-4 sm:p-6">
      {/* ================== Header ================== */}
      <div className="flex items-center gap-3 mb-6 max-w-4xl mx-auto">
        <button
          onClick={onBack || (() => navigate(-1))}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2A40]">
            Create Subscription Plan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure pricing, features, and availability
          </p>
        </div>
      </div>

      {/* ================== Pre-selected plan banner ================== */}
      {preselectedPlan && (
        <div className="max-w-4xl mx-auto mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-purple-50 border border-purple-100">
          <Info className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
          <div className="text-xs text-purple-800">
            <p className="font-semibold mb-0.5">
              You selected: {preselectedPlan.PlanName} — $
              {Number(preselectedPlan.Price).toFixed(2)}/mo
            </p>
            <p className="text-purple-600">
              Fill out the form below to create a <strong>new</strong> plan
              based on your choice.
            </p>
          </div>
        </div>
      )}

      {/* ================== Form ================== */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-6 sm:p-8 space-y-6"
      >
        {/* Row: Plan name + Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required>Plan Name</Label>
            <Input
              type="text"
              value={form.PlanName}
              onChange={(e) => update('PlanName', e.target.value)}
              placeholder="e.g. Business India"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label required>Subscription Type</Label>
            <Select
              value={form.Subscription_Type}
              onChange={(e) => update('Subscription_Type', e.target.value)}
              disabled={isSubmitting}
            >
              {SUBSCRIPTION_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea
            rows={3}
            value={form.Description}
            onChange={(e) => update('Description', e.target.value)}
            placeholder="Short description about the plan…"
            disabled={isSubmitting}
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required>Price (XOF)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.Price}
              onChange={(e) => update('Price', e.target.value)}
              placeholder="e.g. 429"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <Label required>Features</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addFeature())
              }
              placeholder="e.g. POS and order management"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={addFeature}
              disabled={isSubmitting}
              className="px-4 py-3 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 text-sm font-medium shrink-0 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add
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

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onBack || (() => navigate(-1))}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white font-semibold text-sm rounded-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Create Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubscriptionForm;