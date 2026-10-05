// src/Components/SignIn/VerifyOtp.jsx

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/Images/Home/logo.png';
import Gradient from '../../assets/Images/Home/Gradient.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { forgotPasswordService } from '../../Services/apiService';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const email = sessionStorage.getItem('resetEmail');

  // Guard — restart flow if no email
  useEffect(() => {
    if (!email) {
      toast.error(t('auth.verify.sessionExpired'), {
        description: t('auth.verify.sessionExpiredDesc'),
      });
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate, t]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error(t('auth.verify.enterOtp'));
      return;
    }
    if (otp.length < 4) {
      toast.error(t('auth.verify.otpMinLength'));
      return;
    }
    if (!newPassword) {
      toast.error(t('auth.verify.enterPassword'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('auth.verify.passwordsDontMatch'));
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(t('auth.verify.verifying'));

    try {
      const payload = await forgotPasswordService.verifyOtp(
        email,
        otp,
        newPassword
      );

      if (payload?.success === false) {
        throw new Error(payload?.message || t('auth.verify.invalidOtp'));
      }

      toast.success(t('auth.verify.success'), {
        id: toastId,
        description: t('auth.verify.successDesc'),
        duration: 2500,
      });

      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('otpVerified');

      setTimeout(() => navigate('/password-success'), 1000);
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error(t('auth.verify.failed'), {
        id: toastId,
        description:
          err?.code === 'ERR_NETWORK'
            ? t('auth.serverUnavailable')
            : err?.response?.data?.message ||
              err?.message ||
              t('auth.verify.otpIncorrect'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const toastId = toast.loading(t('auth.verify.resending'));

    try {
      const payload = await forgotPasswordService.resendOtp(email);

      if (payload?.success === false) {
        throw new Error(payload?.message || t('auth.verify.resendFailed'));
      }

      toast.success(t('auth.verify.resent'), {
        id: toastId,
        description: t('auth.forgot.otpSentDesc', { email }),
        duration: 2500,
      });
      setOtp('');
    } catch (err) {
      toast.error(t('auth.verify.resendFailed'), {
        id: toastId,
        description:
          err?.code === 'ERR_NETWORK'
            ? t('auth.serverUnavailable')
            : err?.response?.data?.message ||
              err?.message ||
              t('common.error'),
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative w-screen min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0"></div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">
        {/* Left Section */}
        <div
          className="hidden lg:flex flex-1 flex-col justify-center px-8 lg:px-32"
          style={{
            backgroundImage: `url(${Gradient})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="max-w-2xl">
            <h1 className="text-[36px] lg:text-[42px] font-extrabold text-blue-900 mb-6 leading-tight">
              {t('signIn.heroTitle1')} {t('signIn.heroTitle2')}
            </h1>
            <p className="text-gray-600 text-lg lg:text-xl mb-12 leading-relaxed max-w-xl">
              {t('signIn.heroSubtitle')}
            </p>
            <div className="flex items-center gap-4 bg-white rounded-xl px-8 py-5 shadow-lg w-[208px] h-[58.8px]">
              <div className="flex items-center gap-3 justify-between">
                <span className="font-medium text-xl">English</span>
                <img
                  src="https://flagcdn.com/us.svg"
                  alt="USA Flag"
                  className="w-8 h-5 rounded-sm shadow-sm object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:max-w-2xl bg-white shadow-xl overflow-y-auto px-4 sm:px-8 py-10 sm:py-16 min-h-screen lg:min-h-full flex items-center">
          <div className="max-w-lg mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
                {t('auth.verify.signInHeader')}
              </h1>
              <img
                src={logo}
                alt="Company Logo"
                className="h-9 w-[150px] sm:w-[210px]"
              />
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
                {t('auth.verify.title')}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
                {t('auth.verify.subtitle')}
              </p>
              {email && (
                <p className="text-black font-semibold text-base sm:text-lg mt-3">
                  {email}
                </p>
              )}
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP */}
              <div>
                <label className="block text-base sm:text-xl font-medium text-black mb-3">
                  {t('auth.verify.otpLabel')}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('auth.verify.otpPlaceholder')}
                  maxLength={8}
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base sm:text-lg tracking-[0.5em] text-center font-semibold disabled:opacity-60"
                  required
                />
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-base sm:text-xl font-medium text-black mb-3">
                  {t('auth.verify.newPasswordLabel')}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('auth.verify.newPasswordPlaceholder')}
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-14 text-base sm:text-lg disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-base sm:text-xl font-medium text-black mb-3">
                  {t('auth.verify.confirmPasswordLabel')}
                </label>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('auth.verify.confirmPasswordPlaceholder')}
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-14 text-base sm:text-lg disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 bottom-4 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium text-lg sm:text-xl py-4 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('auth.verify.verifying') : t('auth.verify.submit')}
              </button>

              {/* Resend */}
              <div className="text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  {t('auth.verify.noCode')}{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || isSubmitting}
                    className="font-semibold bg-gradient-to-r from-purple-700 to-red-600 bg-clip-text text-transparent hover:underline disabled:opacity-50"
                  >
                    {resending ? t('auth.verify.resending') : t('auth.verify.resend')}
                  </button>
                </p>
              </div>

              <div
                className="w-full mt-4 rounded-xl p-[2px]"
                style={{
                  background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="w-full text-gray-700 font-medium text-lg sm:text-xl py-4 bg-white rounded-[10px]"
                >
                  {t('common.back')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}