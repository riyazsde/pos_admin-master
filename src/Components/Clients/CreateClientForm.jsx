// src/Components/Clients/CreateClientForm.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Upload,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { clientService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Constants
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

const LANGUAGE_MAP = {
  French: [1],
  English: [2],
  Arabic: [3],
  Spanish: [4],
};

const CURRENCY_MAP = {
  XOF: [1],
  EUR: [2],
  USD: [3],
  GBP: [4],
};

const getLanguageIds = (language) => LANGUAGE_MAP[language] || [1];
const getCurrencyIds = (currency) => CURRENCY_MAP[currency] || [1];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD_LEN = 8;
const MAX_BUSINESS_NAME_LEN = 80;
const MAX_LOGO_MB = 2;

// ---------------------------------------------------------------------------
// Field wrapper (label + error + optional hint)
// ---------------------------------------------------------------------------
const Field = ({ label, required, error, hint, children }) => (
  <div>
    <label className="block text-lg font-medium text-[#2E2A40] mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        {error}
      </p>
    ) : hint ? (
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
    ) : null}
  </div>
);

const PasswordInput = ({
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  show,
  onToggle,
  error,
}) => (
  <div className="relative">
    <input
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-5 pr-12 py-3 border rounded text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 ${
        error ? 'border-red-400' : 'border-black/50'
      }`}
    />
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const CreateClientForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    Business_Name: '',
    Display_Name: '',
    Email: '',
    password: '',
    Confirm_Password: '',
    language: 'French',
    currency: 'XOF',
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const markTouched = (key) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogoFile(null);
      setLogoPreview('');
      return;
    }

    // Size guard
    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      toast.error(
        t(
          'createClient.validation.logoTooLarge',
          `Logo must be smaller than ${MAX_LOGO_MB} MB`
        )
      );
      e.target.value = '';
      setLogoFile(null);
      setLogoPreview('');
      return;
    }

    // Type guard
    if (!file.type.startsWith('image/')) {
      toast.error(
        t('createClient.validation.logoInvalidType', 'Please select an image file')
      );
      e.target.value = '';
      setLogoFile(null);
      setLogoPreview('');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
    markTouched('Business_logo');
  };

  // -------------------- Validation --------------------
  const errors = useMemo(() => {
    const e = {};

    // Business name
    const name = form.Business_Name.trim();
    if (!name) {
      e.Business_Name = t(
        'createClient.validation.businessNameRequired',
        'Business name is required'
      );
    } else if (name.length < 2) {
      e.Business_Name = t(
        'createClient.validation.businessNameTooShort',
        'Business name is too short'
      );
    } else if (name.length > MAX_BUSINESS_NAME_LEN) {
      e.Business_Name = t(
        'createClient.validation.businessNameTooLong',
        `Business name cannot exceed ${MAX_BUSINESS_NAME_LEN} characters`
      );
    }

    // Logo
    if (!logoPreview) {
      e.Business_logo = t(
        'createClient.validation.logoRequired',
        'Business logo is required'
      );
    }

    // Email
    const email = form.Email.trim();
    if (!email) {
      e.Email = t(
        'createClient.validation.emailRequired',
        'Email is required'
      );
    } else if (!EMAIL_RE.test(email)) {
      e.Email = t(
        'createClient.validation.emailInvalid',
        'Enter a valid email address'
      );
    }

    // Password
    if (!form.password) {
      e.password = t(
        'createClient.validation.passwordRequired',
        'Password is required'
      );
    } else if (form.password.length < MIN_PASSWORD_LEN) {
      e.password = t(
        'createClient.validation.passwordMinLength',
        `Password must be at least ${MIN_PASSWORD_LEN} characters`
      );
    } else if (form.password.length > 64) {
      e.password = t(
        'createClient.validation.passwordMaxLength',
        'Password cannot exceed 64 characters'
      );
    }

    // Confirm
    if (!form.Confirm_Password) {
      e.Confirm_Password = t(
        'createClient.validation.confirmRequired',
        'Please confirm the password'
      );
    } else if (form.Confirm_Password !== form.password) {
      e.Confirm_Password = t(
        'createClient.validation.passwordsDontMatch',
        'Passwords do not match'
      );
    }

    // Language
    if (!form.language) {
      e.language = t(
        'createClient.validation.languageRequired',
        'Language is required'
      );
    }

    // Currency
    if (!form.currency) {
      e.currency = t(
        'createClient.validation.currencyRequired',
        'Currency is required'
      );
    }

    return e;
  }, [form, logoPreview, t]);

  const isValid = Object.keys(errors).length === 0;

  // Only show error if field has been touched (or form submitted)
  const errorFor = (key) =>
    submitted || touched[key] ? errors[key] : undefined;

  // Password strength hint
  const passwordStrength = useMemo(() => {
    const p = form.password || '';
    let score = 0;
    if (p.length >= MIN_PASSWORD_LEN) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 5);
  }, [form.password]);

  const strengthLabel = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][
    Math.max(0, passwordStrength - 1)
  ];
  const strengthColor =
    passwordStrength <= 2
      ? 'bg-red-400'
      : passwordStrength === 3
      ? 'bg-amber-400'
      : 'bg-green-500';

  // -------------------- Submit --------------------
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      const firstKey = Object.keys(errors)[0];
      toast.error(errors[firstKey] || 'Please fix the highlighted fields');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(
      t('createClient.creating', 'Creating client…')
    );

    try {
      const payload = {
        Business_Name: form.Business_Name.trim(),
        Display_Name:
          form.Display_Name.trim() || form.Business_Name.trim(),
        Business_logo: logoPreview,
        Email: form.Email.trim(),
        password: form.password,
        language: getLanguageIds(form.language),
        currency: getCurrencyIds(form.currency),
        ...DEFAULT_VALUES,
      };

      const created = await clientService.createClient(payload);

      toast.success(t('createClient.createSuccess', 'Client created'), {
        id: toastId,
        description: t('createClient.createSuccessDesc', {
          name: created?.Business_Name || form.Business_Name,
          defaultValue: `${created?.Business_Name || form.Business_Name} was created successfully`,
        }),
        duration: 3000,
      });

      setTimeout(() => navigate('/clients'), 1200);
    } catch (error) {
      console.error('Create client error:', error);
      toast.error(t('createClient.createFailed', 'Failed to create client'), {
        id: toastId,
        description:
          error?.response?.data?.message ||
          error?.message ||
          t('createClient.createFailedDesc', 'Please try again'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen w-full bg-white poppins-text">
      {/* Header */}
      <div className="flex items-center gap-3 m-6">
        <button
          onClick={() => navigate('/clients')}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          title={t('common.back', 'Back')}
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-3xl font-bold text-[#2E2A40]">
          {t('createClient.pageTitle', 'Create Client')}
        </h2>
      </div>

      <div className="w-full max-w-7xl mx-auto p-8 rounded-2xl bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] shadow-md">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#2E2A40]">
            {t('createClient.formTitle', 'Client Information')}
          </h2>
          <p className="text-sm text-black/60 mt-2">
            {t(
              'createClient.formSubtitle',
              'Fill in the details below. All fields marked * are required.'
            )}
          </p>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Business Name */}
          <Field
            label={t('createClient.fields.businessName', 'Business Name')}
            required
            error={errorFor('Business_Name')}
            hint={
              !errorFor('Business_Name') && form.Business_Name
                ? `${form.Business_Name.trim().length}/${MAX_BUSINESS_NAME_LEN}`
                : undefined
            }
          >
            <input
              type="text"
              value={form.Business_Name}
              onChange={(e) => update('Business_Name', e.target.value)}
              onBlur={() => markTouched('Business_Name')}
              placeholder={t(
                'createClient.fields.businessNamePlaceholder',
                'e.g. Acme Restaurant'
              )}
              disabled={isSubmitting}
              maxLength={MAX_BUSINESS_NAME_LEN}
              className={`w-full px-5 py-3 border rounded text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 ${
                errorFor('Business_Name')
                  ? 'border-red-400'
                  : 'border-black/50'
              }`}
            />
          </Field>

          {/* Business Logo */}
          <Field
            label={t('createClient.fields.businessLogo', 'Business Logo')}
            required
            error={errorFor('Business_logo')}
            hint={
              !errorFor('Business_logo')
                ? t(
                    'createClient.fields.logoHint',
                    'PNG, JPG or SVG · max 2 MB'
                  )
                : undefined
            }
          >
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                onChange={handleLogoChange}
                disabled={isSubmitting}
                className="hidden"
              />
              <div
                className={`w-full px-5 py-3 flex items-center justify-center gap-2 text-white bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded hover:opacity-90 transition-opacity ${
                  errorFor('Business_logo') ? 'ring-2 ring-red-400' : ''
                }`}
              >
                {logoFile
                  ? logoFile.name
                  : t('createClient.fields.chooseFile', 'Choose File')}
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
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  {t('createClient.fields.logoSelected', 'Logo selected')}
                </span>
              </div>
            )}
          </Field>

          {/* Email */}
          <Field
            label={t('createClient.fields.email', 'Email')}
            required
            error={errorFor('Email')}
          >
            <input
              type="email"
              value={form.Email}
              onChange={(e) => update('Email', e.target.value)}
              onBlur={() => markTouched('Email')}
              placeholder={t(
                'createClient.fields.emailPlaceholder',
                'name@example.com'
              )}
              disabled={isSubmitting}
              autoComplete="email"
              className={`w-full px-5 py-3 border rounded text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 ${
                errorFor('Email') ? 'border-red-400' : 'border-black/50'
              }`}
            />
          </Field>

          {/* Password */}
          <Field
            label={t('createClient.fields.password', 'Password')}
            required
            error={errorFor('password')}
          >
            <PasswordInput
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              onBlur={() => markTouched('password')}
              placeholder={t(
                'createClient.fields.passwordPlaceholder',
                'At least 8 characters'
              )}
              disabled={isSubmitting}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              error={!!errorFor('password')}
            />
            {form.password && !errorFor('password') && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthColor} transition-all duration-300`}
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {strengthLabel}
                </span>
              </div>
            )}
          </Field>

          {/* Confirm Password */}
          <Field
            label={t(
              'createClient.fields.confirmPassword',
              'Confirm Password'
            )}
            required
            error={errorFor('Confirm_Password')}
          >
            <PasswordInput
              value={form.Confirm_Password}
              onChange={(e) => update('Confirm_Password', e.target.value)}
              onBlur={() => markTouched('Confirm_Password')}
              placeholder={t(
                'createClient.fields.confirmPasswordPlaceholder',
                'Repeat your password'
              )}
              disabled={isSubmitting}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((v) => !v)}
              error={!!errorFor('Confirm_Password')}
            />
            {form.Confirm_Password &&
              form.password &&
              form.Confirm_Password === form.password &&
              !errorFor('Confirm_Password') && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('createClient.validation.passwordsMatch', 'Passwords match')}
                </p>
              )}
          </Field>

          {/* Language */}
          <Field
            label={t('createClient.fields.language', 'Preferred Language')}
            required
            error={errorFor('language')}
          >
            <select
              value={form.language}
              onChange={(e) => update('language', e.target.value)}
              onBlur={() => markTouched('language')}
              disabled={isSubmitting}
              className={`w-full px-5 py-3 border rounded text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 bg-white ${
                errorFor('language') ? 'border-red-400' : 'border-black/50'
              }`}
            >
              {Object.keys(LANGUAGE_MAP).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </Field>

          {/* Currency */}
          <Field
            label={t('createClient.fields.currency', 'Preferred Currency')}
            required
            error={errorFor('currency')}
          >
            <select
              value={form.currency}
              onChange={(e) => update('currency', e.target.value)}
              onBlur={() => markTouched('currency')}
              disabled={isSubmitting}
              className={`w-full px-5 py-3 border rounded text-base text-black/80 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 bg-white ${
                errorFor('currency') ? 'border-red-400' : 'border-black/50'
              }`}
            >
              {Object.keys(CURRENCY_MAP).map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </Field>
        </form>

        {/* Required-fields reminder + submit */}
        <div className="flex flex-col items-center gap-3 mt-12">
          {submitted && !isValid && (
            <p className="text-xs text-red-500">
              {t(
                'createClient.validation.fixErrors',
                'Please fix the highlighted fields before submitting.'
              )}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || (submitted && !isValid)}
            className="w-full md:w-[400px] py-4 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-lg font-medium rounded-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('createClient.creating', 'Creating…')}
              </>
            ) : (
              t('createClient.saveButton', 'Create Client')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(CreateClientForm);