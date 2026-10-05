// src/Components/SignIn/ChangePassword.jsx

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { changePasswordService } from '../../Services/apiService';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    reEnterPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    if (!form.currentPassword) return t('auth.changePassword.currentRequired');
    if (!form.newPassword) return t('auth.changePassword.newRequired');
    if (form.newPassword.length < 6)
      return t('auth.changePassword.newMinLength');
    if (form.newPassword !== form.reEnterPassword)
      return t('auth.changePassword.passwordsDontMatch');
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
    const toastId = toast.loading(t('auth.changePassword.updating'));

    try {
      const payload = await changePasswordService.change(
        form.currentPassword,
        form.newPassword,
        form.reEnterPassword
      );

      if (payload?.success === false) {
        throw new Error(payload?.message || t('auth.changePassword.failed'));
      }

      toast.success(t('auth.changePassword.success'), {
        id: toastId,
        description: t('auth.changePassword.successDesc'),
        duration: 2500,
      });

      setForm({ currentPassword: '', newPassword: '', reEnterPassword: '' });

      setTimeout(() => navigate('/settings'), 1200);
    } catch (err) {
      toast.error(t('auth.changePassword.failed'), {
        id: toastId,
        description:
          err?.response?.data?.message ||
          err?.message ||
          t('common.error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#2E2A40]">
              {t('auth.changePassword.title')}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('auth.changePassword.subtitle')}
            </p>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
        >
          {/* Current Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-[#2E2A40] mb-2">
              {t('auth.changePassword.currentLabel')}
            </label>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={(e) => update('currentPassword', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 bottom-3 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-[#2E2A40] mb-2">
              {t('auth.changePassword.newLabel')}
            </label>
            <input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={(e) => update('newPassword', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 bottom-3 text-gray-400 hover:text-gray-600"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-[#2E2A40] mb-2">
              {t('auth.changePassword.confirmLabel')}
            </label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.reEnterPassword}
              onChange={(e) => update('reEnterPassword', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 bottom-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white text-sm font-semibold rounded-lg hover:opacity-95 disabled:opacity-60"
            >
              {isSubmitting
                ? t('auth.changePassword.updating')
                : t('auth.changePassword.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}