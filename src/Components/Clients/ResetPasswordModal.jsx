// src/Components/Clients/ResetPasswordModal.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { clientService } from '../../Services/apiService';

const ResetPasswordModal = ({ clientId, businessName, onClose }) => {
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Close on ESC (unless submitting)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, submitting]);

  const validate = () => {
    const next = {};
    if (!newPassword) {
      next.newPassword = t(
        'resetPassword.validation.required',
        'Password is required'
      );
    } else if (newPassword.length < 8) {
      next.newPassword = t(
        'resetPassword.validation.minLength',
        'Password must be at least 8 characters'
      );
    }
    if (!confirmPassword) {
      next.confirmPassword = t(
        'resetPassword.validation.confirmRequired',
        'Please confirm the password'
      );
    } else if (newPassword !== confirmPassword) {
      next.confirmPassword = t(
        'resetPassword.validation.mismatch',
        'Passwords do not match'
      );
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const toastId = toast.loading(
      t('resetPassword.resetting', 'Resetting password…')
    );
    try {
      await clientService.resetPassword(clientId, {
        newPassword,
        confirmPassword,
      });
      toast.success(t('resetPassword.success', 'Password reset successfully'), {
        id: toastId,
      });
      onClose();
    } catch (err) {
      toast.error(t('resetPassword.failed', 'Failed to reset password'), {
        id: toastId,
        description:
          err?.response?.data?.message ||
          err?.message ||
          t('common.error', 'Something went wrong'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="relative w-full max-w-[520px] bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => !submitting && onClose()}
          disabled={submitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition disabled:opacity-50"
          aria-label={t('common.close', 'Close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-2xl sm:text-[26px] font-bold text-black mb-1">
          {t('resetPassword.title', 'Reset Account Password')}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {t('resetPassword.subtitle', 'Set a new password for')}{' '}
          <span className="font-semibold text-gray-800">
            {businessName || t('resetPassword.thisClient', 'this client')}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-[#2E2A40] mb-2">
              {t('resetPassword.newPassword', 'New Password')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={submitting}
                placeholder={t(
                  'resetPassword.newPasswordPlaceholder',
                  'At least 8 characters'
                )}
                className={`w-full px-4 py-3 pr-11 border rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 ${
                  errors.newPassword ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-[#2E2A40] mb-2">
              {t('resetPassword.confirmPassword', 'Confirm Password')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                placeholder={t(
                  'resetPassword.confirmPasswordPlaceholder',
                  'Repeat the password'
                )}
                className={`w-full px-4 py-3 pr-11 border rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 ${
                  errors.confirmPassword
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              type="button"
              onClick={() => !submitting && onClose()}
              disabled={submitting}
              className="flex-1 px-5 py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-60"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('resetPassword.resetting', 'Resetting…')}
                </>
              ) : (
                t('resetPassword.submit', 'Reset Password')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;