// src/Components/Settings/DateTimeSettings.jsx

import React, { useState, useEffect, useRef } from 'react';
import { format, parse } from 'date-fns';
import { Pen, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import TimePickerModal from './TimePickerModal';
import DatePickerModal from './DatePickerModal';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';
import { accountSettingsService } from '../../Services/apiService';

// Common IANA timezones
const TIMEZONES = [
  'UTC',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Africa/Cairo',
  'Africa/Lagos',
  'Africa/Johannesburg',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const DateTimeSettings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [timezone, setTimezone] = useState('UTC');

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchedRef = useRef(false);

  // ---------------------------------------------------------------------
  // ✅ Fetch existing settings on mount
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchSettings = async () => {
      try {
        const data = await accountSettingsService.getDateTime();

        if (data) {
          // Parse date "YYYY-MM-DD"
          if (data.date) {
            const parsedDate = parse(data.date, 'yyyy-MM-dd', new Date());
            if (!isNaN(parsedDate.getTime())) setDate(parsedDate);
          }

          // Parse time "HH:mm" (24-hour)
          if (data.time) {
            const [h, m] = data.time.split(':');
            const d = new Date();
            d.setHours(Number(h), Number(m), 0, 0);
            setTime(d);
          }

          // Timezone
          if (data.timezone) setTimezone(data.timezone);
        }
      } catch (err) {
        console.error('Date/time fetch error:', err);
        toast.error(t('dateTime.loadFailed'), {
          description:
            err?.response?.data?.message ||
            err?.message ||
            t('common.error'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [t]);

  // ---------------------------------------------------------------------
  // ✅ Handle picker saves (support both Date objects and strings)
  // ---------------------------------------------------------------------
  const handleTimeSave = (newTime) => {
    if (typeof newTime === 'string') {
      const [h, m] = newTime.split(':');
      const d = new Date();
      d.setHours(Number(h), Number(m), 0, 0);
      setTime(d);
    } else if (newTime instanceof Date) {
      setTime(newTime);
    }
    setIsTimeModalOpen(false);
  };

  const handleDateSave = (newDate) => {
    if (typeof newDate === 'string') {
      const parsed = parse(newDate, 'yyyy-MM-dd', new Date());
      setDate(isNaN(parsed.getTime()) ? new Date() : parsed);
    } else if (newDate instanceof Date) {
      setDate(newDate);
    }
    setIsDateModalOpen(false);
  };

  // ---------------------------------------------------------------------
  // ✅ Submit → POST to API
  // ---------------------------------------------------------------------
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading(t('dateTime.saving'));

    try {
      // Format matches backend: YYYY-MM-DD, HH:mm (24h), IANA timezone
      const payload = {
        date: format(date, 'yyyy-MM-dd'),
        time: format(time, 'HH:mm'),
        timezone,
      };

      console.log('📤 [DATE-TIME] Payload:', payload);

      const result = await accountSettingsService.updateDateTime(payload);

      console.log('✅ [DATE-TIME] Response:', result);

      toast.success(t('dateTime.saveSuccess'), {
        id: toastId,
        duration: 2000,
      });

      // Return to settings hub
      setTimeout(() => navigate('/settings'), 800);
    } catch (err) {
      console.error('❌ [DATE-TIME] Error:', err);
      console.error('❌ [DATE-TIME] Response:', err?.response?.data);

      toast.error(t('dateTime.saveFailed'), {
        id: toastId,
        description:
          err?.response?.data?.errors?.[0]?.msg ||
          err?.response?.data?.message ||
          err?.message ||
          t('common.error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  // ---------------------------------------------------------------------
  // ✅ Reusable Header (with back button + clickable breadcrumb)
  // ---------------------------------------------------------------------
  const Header = () => (
    <div className="flex items-center gap-3 mb-4 md:mb-6">
      <button
        onClick={() => navigate('/settings')}
        className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
        title={t('common.back')}
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      <h1 className="text-xl md:text-[32px] font-bold text-gray-800 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => navigate('/settings')}
          className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-1 md:gap-2 text-base md:text-lg"
        >
          {t('accountSettings.title')}
          <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
        </button>
        <span className="text-base md:text-2xl">{t('dateTime.title')}</span>
      </h1>
    </div>
  );

  // ---------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="text-sm">{t('dateTime.loading')}</span>
          </div>
        </div>
      </>
    );
  }

  // ---------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------
  return (
    <>
      <Header />

      <div className="flex flex-col items-center font-poppins px-3 md:px-0">
        <div className="w-full max-w-2xl">
          {/* ============== Change Time ============== */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 w-full mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">
              {t('dateTime.timeCard')}
            </h2>
            <div
              className={`relative w-full ${
                isSubmitting ? 'opacity-60 pointer-events-none' : 'cursor-pointer'
              }`}
              onClick={() => !isSubmitting && setIsTimeModalOpen(true)}
            >
              <div className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 text-left text-base md:text-lg font-medium text-black">
                {format(time, 'hh:mm a')}
              </div>
              <span className="absolute inset-y-0 right-4 flex items-center justify-center bg-black rounded-full h-8 w-8 mt-2 md:mt-3">
                <Pen className="w-4 h-4 text-white" />
              </span>
            </div>
          </div>

          {/* ============== Change Date ============== */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 w-full mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">
              {t('dateTime.dateCard')}
            </h2>
            <div
              className={`relative w-full ${
                isSubmitting ? 'opacity-60 pointer-events-none' : 'cursor-pointer'
              }`}
              onClick={() => !isSubmitting && setIsDateModalOpen(true)}
            >
              <div className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 text-left text-base md:text-lg font-medium text-black">
                {format(date, 'MMMM dd, yyyy')}
              </div>
              <span className="absolute inset-y-0 right-4 flex items-center justify-center bg-black rounded-full h-8 w-8 mt-2 md:mt-3">
                <Pen className="w-4 h-4 text-white" />
              </span>
            </div>
          </div>

          {/* ============== Timezone ============== */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 w-full">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">
              {t('dateTime.timezoneCard')}
            </h2>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 text-left text-base md:text-lg font-medium text-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {/* ============== Action Buttons ============== */}
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-6 md:mt-8 justify-end">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto border border-gray-400 rounded-lg py-2 md:py-3 px-6 md:px-8 text-base md:text-lg font-medium text-black hover:bg-gray-100 transition disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-2 md:py-3 px-6 md:px-8 text-base md:text-lg font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('dateTime.saving')}
                </>
              ) : (
                t('dateTime.submitButton')
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============== Modals ============== */}
      <TimePickerModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onSave={handleTimeSave}
        initialTime={time}
      />
      <DatePickerModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSave={handleDateSave}
        initialDate={date}
      />
    </>
  );
};

export default withAdminLayout(DateTimeSettings);