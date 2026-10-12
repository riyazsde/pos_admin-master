import React, { useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import PasswordResetModal from './PasswordResetModal';
import { changePasswordService } from '../../Services/apiService';
import { toast } from 'sonner';

const ChangePasswordForm = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Password strength
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(newPassword);
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = [
    'bg-red-400', 'bg-red-400', 'bg-yellow-400',
    'bg-yellow-500', 'bg-green-500', 'bg-green-600',
  ][strength];

  const handleSavePassword = async () => {
    // Validation with sonner
    if (!currentPassword.trim()) {
      toast.error('Please enter your current password.');
      return;
    }
    if (!newPassword.trim()) {
      toast.error('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      toast.error('New password must be different from current password.');
      return;
    }

    const toastId = toast.loading('Updating your password...');

    try {
      setLoading(true);

      // ✅ Positional args — matches your service signature
      await changePasswordService.change(
        currentPassword,
        newPassword,
        confirmPassword
      );

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // ✅ Success toast
      toast.success('Password changed successfully! 🎉', {
        id: toastId,
        description: 'Your new password is now active.',
        duration: 4000,
      });
    } catch (err) {
      const status = err?.response?.status;
      let message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to change password. Please try again.';

      if (status === 404) {
        message = 'Password service unavailable. Please contact support.';
      } else if (status === 401) {
        message = 'Your session expired. Please log in again.';
      } else if (status === 400) {
        message = err?.response?.data?.message || 'Invalid password details. Please check and retry.';
      }

      toast.error(message, { id: toastId, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 w-full max-w-5xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2 flex-wrap">
        <span className="text-gray-400 flex items-center gap-2">
          Account Settings
          <img src={arrow} alt="Arrow" className="w-4 h-4" />
        </span>
        Change Password
      </h1>

      <div className="flex flex-col gap-8">
        <h2 className="text-lg md:text-xl text-black/60 font-medium">
          Change Password
        </h2>

        <div className="flex flex-col gap-8">
          {/* Current Password + Forget Password */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Enter Current Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 outline-none text-black text-sm md:text-base"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div className="flex justify-start md:justify-end">
              <button
                type="button"
                onClick={openModal}
                className="bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-xs md:text-sm py-2 px-4 rounded-lg w-full md:w-auto"
              >
                Forget Password
              </button>
            </div>
          </div>

          {/* New + Confirm Password */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Enter New Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 outline-none text-black text-sm md:text-base"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {newPassword && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} transition-all duration-300`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Re-enter New Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 outline-none text-black text-sm md:text-base"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {confirmPassword && (
                <p
                  className={`text-xs mt-1 flex items-center gap-1 ${
                    newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle2 size={12} /> Passwords match
                    </>
                  ) : (
                    <>
                      <XCircle size={12} /> Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSavePassword}
              disabled={loading}
              className={`bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white font-medium text-base md:text-lg py-3 px-6 md:px-10 rounded-xl w-full md:w-auto flex items-center justify-center gap-2 transition-opacity ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-95'
              }`}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Saving...' : 'Save Password'}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <PasswordResetModal onClose={closeModal} />}
    </div>
  );
};

export default withAdminLayout(ChangePasswordForm);