// src/Components/SignIn/ForgotPassword.jsx

import React, { useState } from 'react';
import logo from '../../assets/Images/Home/logo.png';
import Gradient from '../../assets/Images/Home/Gradient.png';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { forgotPasswordService } from '../../Services/apiService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const toastId = toast.loading(t('auth.forgot.sendingOtp'));

    try {
      const payload = await forgotPasswordService.sendOtp(email);

      if (payload?.success === false) {
        throw new Error(payload?.message || t('auth.forgot.sendOtpFailed'));
      }

      toast.success(t('auth.forgot.otpSent'), {
        id: toastId,
        description: t('auth.forgot.otpSentDesc', { email }),
        duration: 3000,
      });

      sessionStorage.setItem('resetEmail', email);

      setTimeout(() => navigate('/verify-otp'), 800);
    } catch (err) {
      console.error('Send OTP error:', err);
      toast.error(t('auth.forgot.sendOtpFailed'), {
        id: toastId,
        description:
          err?.code === 'ERR_NETWORK'
            ? t('auth.serverUnavailable')
            : err?.response?.data?.message ||
              err?.message ||
              t('auth.forgot.checkEmail'),
      });
    } finally {
      setIsSubmitting(false);
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
                {t('auth.forgot.signInHeader')}
              </h1>
              <img
                src={logo}
                alt="Company Logo"
                className="h-9 w-[150px] sm:w-[210px]"
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
                {t('auth.forgot.title')}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-sm mx-auto">
                {t('auth.forgot.subtitle')}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-base sm:text-xl font-medium text-black mb-3">
                  {t('auth.forgot.emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.forgot.emailPlaceholder')}
                  className="w-full px-6 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base sm:text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium text-lg sm:text-xl py-4 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('auth.forgot.sendingOtp') : t('auth.forgot.submit')}
                </button>

                <div
                  className="w-full mt-4 rounded-xl p-[2px]"
                  style={{
                    background:
                      'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
                  }}
                >
                  <Link
                    to="/"
                    className="block w-full text-center text-gray-700 font-medium text-lg sm:text-xl py-4 bg-white rounded-[10px]"
                  >
                    {t('common.back')}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}