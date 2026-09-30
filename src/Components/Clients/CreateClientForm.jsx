import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { clientService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Default values for fields your form doesn't collect but the API needs
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

// ---------------------------------------------------------------------------
// Map display name → backend ID (language)
// Adjust IDs to match your backend's list
// ---------------------------------------------------------------------------
const LANGUAGE_MAP = {
  French: [1],
  English: [2],
  Arabic: [3],
  Spanish: [4],
};

// ---------------------------------------------------------------------------
// Map display name → backend ID (currency)
// ---------------------------------------------------------------------------
const CURRENCY_MAP = {
  XOF: [1],
  EUR: [2],
  USD: [3],
  GBP: [4],
};

// ---------------------------------------------------------------------------
// Helpers to convert display values to IDs, with safe fallbacks
// ---------------------------------------------------------------------------
const getLanguageIds = (language) => {
  if (!language) return [1]; // default French
  const trimmed = language.trim();
  const match = Object.keys(LANGUAGE_MAP).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase()
  );
  return match ? LANGUAGE_MAP[match] : [1];
};

const getCurrencyIds = (currency) => {
  if (!currency) return [1]; // default XOF
  const trimmed = currency.trim().toUpperCase();
  return CURRENCY_MAP[trimmed] || [1];
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const CreateClientForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [form, setForm] = useState({
    Business_Name: '',
    Display_Name: '',   // we'll auto-fill with Business_Name
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
    if (!form.Business_Name.trim()) return 'Business Name is required';
    if (!form.Email.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(form.Email)) return 'Email is invalid';
    if (!form.password || form.password.length < 6)
      return 'Password must be at least 6 characters';
    if (form.password !== form.Confirm_Password)
      return 'Passwords do not match';
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
    const toastId = toast.loading('Creating client...');

    try {
      // ⚠️ If your backend requires a real URL for Business_logo,
      //    upload the file first and use the returned URL.
      //    For now we send the data URL (or empty string).
      const payload = {
        // From the form
        Business_Name: form.Business_Name.trim(),
        Display_Name: form.Display_Name.trim() || form.Business_Name.trim(),
        Business_logo: logoPreview || '',
        Email: form.Email.trim(),
        password: form.password,
        Confirm_Password: form.Confirm_Password,
        language: getLanguageIds(form.language),
        currency: getCurrencyIds(form.currency),

        // Filled with defaults
        ...DEFAULT_VALUES,
      };

      const created = await clientService.createClient(payload);

      toast.success('Client created successfully!', {
        id: toastId,
        description: `${
          created?.Business_Name || form.Business_Name
        } has been onboarded.`,
        duration: 3000,
      });

      setTimeout(() => navigate('/clients'), 1200);
    } catch (error) {
      console.error('Create client error:', error);
      toast.error('Failed to create client', {
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
    <div className="min-h-screen w-full bg-white poppins-text">
      <h2 className="text-3xl font-bold text-[#2E2A40] m-6">Create Clients</h2>

      <div className="w-full max-w-7xl p-8 rounded-2xl bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] shadow-md">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#2E2A40]">Onboarding Client</h2>
          <p className="text-sm text-black/60 mt-2">
            Create new client by filling all the mandatory details
          </p>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
          {/* Business Name */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={form.Business_Name}
              onChange={(e) => update('Business_Name', e.target.value)}
              placeholder="Type Business name"
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Business Logo */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Business Logo
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
                {logoFile ? logoFile.name : 'Choose File'}
                <span className="material-icons">upload_file</span>
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
                <span className="text-xs text-gray-500">Logo selected</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.Email}
              onChange={(e) => update('Email', e.target.value)}
              placeholder="Enter Email for Login"
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Create Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="Create Password"
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.Confirm_Password}
              onChange={(e) => update('Confirm_Password', e.target.value)}
              placeholder="Confirm Password"
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Preferred Language
            </label>
            <input
              type="text"
              value={form.language}
              onChange={(e) => update('language', e.target.value)}
              placeholder="Type Language"
              disabled={isSubmitting}
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
          </div>

          {/* Preferred Currency */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Preferred Currency
            </label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => update('currency', e.target.value)}
              placeholder="Type Currency"
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
            className="w-full md:w-[400px] py-4 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-lg font-medium rounded-lg hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(CreateClientForm);