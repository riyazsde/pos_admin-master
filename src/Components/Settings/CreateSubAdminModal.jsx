
// src/Components/Settings/CreateSubAdminModal.jsx

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

import { subadminService } from '../../Services/apiService';

// =====================================================
// CENTRALIZED PERMISSION GLOSSARY
// Labels must match the sidebar navigation.
// Values must match the backend permission types.
// =====================================================

export const PERMISSION_TYPES = [
  { label: 'Dashboard', value: 'Dashboard' },
  { label: 'Clients', value: 'Clients' },
  { label: 'Subscriptions', value: 'Subscriptions' },
  { label: 'Reports', value: 'Reports' },

  // Sidebar label: MOM Device
  // Backend value: MDM Device
  { label: 'MOM Device', value: 'MDM Device' },

  { label: 'Inventory', value: 'Inventory' },
  { label: 'Audit Log', value: 'Audits Log' },
  { label: 'Support Tickets', value: 'Support Tickets' },
  { label: 'POS Devices', value: 'POS Devices' },
  { label: 'Settings', value: 'Settings' },
];

export default function CreateSubAdminModal({
  onClose,
  onCreated,
}) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    Name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    Responsibility_id: 1,
    permissions: ['Dashboard'],
    Status: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =====================================================
  // TOGGLE PERMISSIONS
  // =====================================================

  const togglePermission = (permissionValue) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionValue)
        ? prev.permissions.filter(
            (item) => item !== permissionValue
          )
        : [...prev.permissions, permissionValue],
    }));
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    if (!form.Name.trim()) {
      return t('subadmin.validation.nameRequired');
    }

    if (!form.email.trim()) {
      return t('subadmin.validation.emailRequired');
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return t('subadmin.validation.emailInvalid');
    }

    if (!form.password || form.password.length < 6) {
      return t('subadmin.validation.passwordMinLength');
    }

    if (form.password !== form.confirmPassword) {
      return t('subadmin.validation.passwordsDontMatch');
    }

    if (form.permissions.length === 0) {
      return t('subadmin.validation.permissionRequired');
    }

    return null;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (isSubmitting) return;

    const errorMessage = validate();

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);

    const toastId = toast.loading(
      t('subadmin.creating')
    );

    try {
      const payload = {
        Name: form.Name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        Confirm_Password: form.confirmPassword,
        Responsibility_id:
          Number(form.Responsibility_id) || 1,
        Role_id: 2,
        Status: form.Status,

        // IMPORTANT:
        // Send exact backend permission values.
        IsPermissons: form.permissions,
      };

      const created = await subadminService.create(payload);

      toast.success(t('subadmin.createSuccess'), {
        id: toastId,
        description: t(
          'subadmin.createSuccessDesc',
          {
            name: created?.Name || form.Name,
          }
        ),
      });

      onCreated?.(created);
      onClose?.();

    } catch (error) {
      console.error(
        'Create subadmin error:',
        error
      );

      toast.error(t('subadmin.createFailed'), {
        id: toastId,
        description:
          error?.response?.data?.errors?.[0]?.msg ||
          error?.response?.data?.message ||
          error?.message ||
          t('common.error'),
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* HEADER */}

        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">

          <div>
            <h1 className="text-2xl font-bold font-poppins text-gray-900">
              {t('subadmin.createTitle')}
            </h1>

            <p className="text-xs text-gray-500 mt-0.5">
              {t('subadmin.createSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <span className="text-gray-500 text-2xl font-bold">
              &times;
            </span>
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >

          {/* NAME */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('subadmin.form.firstName')}
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="text"
                value={form.Name}
                onChange={(e) =>
                  update('Name', e.target.value)
                }
                placeholder={t(
                  'subadmin.form.firstNamePlaceholder'
                )}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('subadmin.form.lastName')}
              </label>

              <input
                type="text"
                value={form.last_name}
                onChange={(e) =>
                  update('last_name', e.target.value)
                }
                placeholder={t(
                  'subadmin.form.lastNamePlaceholder'
                )}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

          </div>

          {/* EMAIL + PHONE */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('subadmin.form.email')}
                <span className="text-red-500"> *</span>
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  update('email', e.target.value)
                }
                placeholder={t(
                  'subadmin.form.emailPlaceholder'
                )}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('subadmin.form.phone')}
              </label>

              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  update('phone', e.target.value)
                }
                placeholder={t(
                  'subadmin.form.phonePlaceholder'
                )}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

          </div>

          {/* PASSWORD */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="relative">

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('subadmin.form.password')}
                <span className="text-red-500"> *</span>
              </label>

              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) =>
                  update('password', e.target.value)
                }
                placeholder={t(
                  'subadmin.form.passwordPlaceholder'
                )}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 bottom-2.5 text-gray-400"
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

            <div className="relative">

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('subadmin.form.confirmPassword')}
                <span className="text-red-500"> *</span>
              </label>

              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) =>
                  update('confirmPassword', e.target.value)
                }
                placeholder={t(
                  'subadmin.form.confirmPasswordPlaceholder'
                )}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm((prev) => !prev)
                }
                className="absolute right-3 bottom-2.5 text-gray-400"
              >
                {showConfirm
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

          </div>

          {/* RESPONSIBILITY + STATUS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('subadmin.form.responsibility')}
              </label>

              <select
                value={form.Responsibility_id}
                onChange={(e) =>
                  update(
                    'Responsibility_id',
                    Number(e.target.value)
                  )
                }
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value={1}>Restaurant Owner</option>
                <option value={2}>Manager</option>
                <option value={3}>Cashier</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('subadmin.form.status')}
              </label>

              <div className="flex items-center gap-3 h-[42px]">

                <input
                  type="checkbox"
                  id="create-status"
                  checked={form.Status}
                  onChange={(e) =>
                    update('Status', e.target.checked)
                  }
                  disabled={isSubmitting}
                  className="w-5 h-5 accent-purple-600"
                />

                <label
                  htmlFor="create-status"
                  className="text-sm text-gray-700"
                >
                  {form.Status
                    ? t('subadmin.active')
                    : t('subadmin.inactive')}
                </label>

              </div>
            </div>

          </div>

          {/* PERMISSIONS */}

          <div>

            <label className="block text-sm font-semibold text-gray-800 mb-3">
              {t('subadmin.form.permissions')}
              <span className="text-red-500"> *</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">

              {PERMISSION_TYPES.map((permission) => {

                const isChecked =
                  form.permissions.includes(permission.value);

                return (
                  <button
                    key={permission.value}
                    type="button"
                    onClick={() =>
                      togglePermission(permission.value)
                    }
                    disabled={isSubmitting}
                    aria-pressed={isChecked}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all text-left ${
                      isChecked
                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-purple-200'
                    }`}
                  >

                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {isChecked && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </span>

                    <span className="truncate">
                      {permission.label}
                    </span>

                  </button>
                );

              })}

            </div>

          </div>

        </form>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-95 disabled:opacity-60 flex items-center gap-2"
            style={{
              background:
                'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
            }}
          >

            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('subadmin.creating')}
              </>
            ) : (
              t('subadmin.createButtonShort')
            )}

          </button>

        </div>

      </div>

    </div>
  );
}
