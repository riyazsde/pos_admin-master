// src/Components/Clients/CreateClientForm.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { clientService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Default values for fields the form doesn't collect but the API needs
// ---------------------------------------------------------------------------
const DEFAULT_VALUES = {
  type: 'Restaurant',
  Tax_ID: '',
  State: 'N/A',
  City: 'N/A',
  Time_Zone: 'Africa/Cairo',
  Send_Setup_Link: true,
  Plan: 'Starter',
  Billing: 'Monthly',
  Trial_Duration: '7 days',
  Support_Tier: 'Premium 24/7',
  POS_Terminal_Count: 0,
  KDS_Count: 0,
  Printer_Count: 0,
  Kitchen_Stations: 0,
  Tablet_Count: 0,
  Serial_Numbers: [],
  Mobile_Money_Providers: [],
  Payment_Methods_Enabled: [],
  Operational_Configuration: [],
  Status: true,
};

// Map display name → backend ID (language)
const LANGUAGE_MAP = {
  French: [1],
  English: [2],
  Arabic: [3],
  Spanish: [4],
};

// Map display name → backend ID (currency)
const CURRENCY_MAP = {
  XOF: [1],
  EUR: [2],
  USD: [3],
  GBP: [4],
};

const getLanguageIds = (language) => {
  if (!language) return [1];
  const trimmed = language.trim();
  const match = Object.keys(LANGUAGE_MAP).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase()
  );
  return match ? LANGUAGE_MAP[match] : [1];
};

const getCurrencyIds = (currency) => {
  if (!currency) return [1];
  const trimmed = currency.trim().toUpperCase();
  return CURRENCY_MAP[trimmed] || [1];
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const CreateClientForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [form, setForm] = useState({
    Business_Name: '',
    Display_Name: '',
    Email: '',
    password: '',
    Confirm_Password: '',
    language: 'French',
    currency: 'XOF',
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!form.Business_Name.trim())
      return t('createClient.validation.businessNameRequired');
    if (!form.Email.trim())
      return t('createClient.validation.emailRequired');
    if (!/^\S+@\S+\.\S+$/.test(form.Email))
      return t('createClient.validation.emailInvalid');
    if (!form.password || form.password.length < 6)
      return t('createClient.validation.passwordMinLength');
    if (form.password !== form.Confirm_Password)
      return t('createClient.validation.passwordsDontMatch');
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
    const toastId = toast.loading(t('createClient.creating'));

    try {
      const payload = {
        Business_Name: form.Business_Name.trim(),
        Display_Name: form.Display_Name.trim() || form.Business_Name.trim(),
        Business_logo: logoPreview || '',
        Email: form.Email.trim(),
        password: form.password,
        Confirm_Password: form.Confirm_Password,
        language: getLanguageIds(form.language),
        currency: getCurrencyIds(form.currency),
        ...DEFAULT_VALUES,
      };

      const created = await clientService.createClient(payload);

      toast.success(t('createClient.createSuccess'), {
        id: toastId,
        description: t('createClient.createSuccessDesc', {
          name: created?.Business_Name || form.Business_Name,
        }),
        duration: 3000,
      });

      setTimeout(() => navigate('/clients'), 1200);
    } catch (error) {
      console.error('Create client error:', error);
      toast.error(t('createClient.createFailed'), {
        id: toastId,
        description:
          error?.response?.data?.message ||
          error?.message ||
          t('createClient.createFailedDesc'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white poppins-text">
      {/* ============ Header with back button ============ */}
      <div className="flex items-center gap-3 m-6">
        <button
          onClick={() => navigate('/clients')}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          title={t('common.back')}
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-3xl font-bold text-[#2E2A40]">
          {t('createClient.pageTitle')}
        </h2>
      </div>

      <div className="w-full max-w-7xl mx-auto p-8 rounded-2xl bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] shadow-md">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#2E2A40]">
            {t('createClient.formTitle')}
          </h2>
          <p className="text-sm text-black/60 mt-2">
            {t('createClient.formSubtitle')}
          </p>
        </div>

        {/* Form */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          onSubmit={handleSubmit}
        >
          {/* Business Name */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              {t('createClient.fields.businessName')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.Business_Name}
              onChange={(e) => update('Business_Name', e.target.value)}
              placeholder={t('createClient.fields.businessNamePlaceholder')}
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Business Logo */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              {t('createClient.fields.businessLogo')}
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                disabled={isSubmitting}
                className="hidden"
              />
              <div className="w-full px-5 py-3 flex items-center justify-center gap-2 text-white bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded hover:opacity-90 transition-opacity">
                {logoFile
                  ? logoFile.name
                  : t('createClient.fields.chooseFile')}
                <Upload className="w-4 h-4" />
              </div>
            </label>
            {logoPreview && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {t('createClient.fields.logoSelected')}
                </span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              {t('createClient.fields.email')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.Email}
              onChange={(e) => update('Email', e.target.value)}
              placeholder={t('createClient.fields.emailPlaceholder')}
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              {t('createClient.fields.password')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder={t('createClient.fields.passwordPlaceholder')}
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              {t('createClient.fields.confirmPassword')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.Confirm_Password}
              onChange={(e) => update('Confirm_Password', e.target.value)}
              placeholder={t('createClient.fields.confirmPasswordPlaceholder')}
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              {t('createClient.fields.language')}
            </label>
            <input
              type="text"
              value={form.language}
              onChange={(e) => update('language', e.target.value)}
              placeholder={t('createClient.fields.languagePlaceholder')}
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Preferred Currency */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              {t('createClient.fields.currency')}
            </label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => update('currency', e.target.value)}
              placeholder={t('createClient.fields.currencyPlaceholder')}
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>
        </form>

        {/* Save Button */}
        <div className="flex justify-center mt-12">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full md:w-[400px] py-4 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-lg font-medium rounded-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('createClient.creating')}
              </>
            ) : (
              t('createClient.saveButton')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(CreateClientForm);