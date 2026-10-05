// src/Components/Settings/LanguageSettings.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setLanguageCode,
  getCodeForLanguage,
} from '../../Store/Features/language/languageSlice';

// Custom hook — click outside
const useOutsideAlerter = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

const LanguageSettings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // ✅ Read languages from Redux (already fetched by App.jsx)
  const languages = useAppSelector((s) => s.language.languages);
  const currentCode = useAppSelector((s) => s.language.currentCode);

  const [selectedLanguage, setSelectedLanguage] = useState(currentCode);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideAlerter(dropdownRef, () => setIsOpen(false));

  // Keep selection in sync if currentCode changes externally
  useEffect(() => {
    setSelectedLanguage(currentCode);
  }, [currentCode]);

  // Filter to active languages only
  const activeLanguages = languages.filter((l) => l.Status);

  // Find label for currently selected code
  const getLabelForCode = (code) => {
    const lang = activeLanguages.find(
      (l) => getCodeForLanguage(l.Language_name) === code
    );
    return lang?.Language_name || 'English';
  };

  const handleSelect = (lang) => {
    const code = getCodeForLanguage(lang.Language_name);
    setSelectedLanguage(code);
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedLanguage) return;

    if (selectedLanguage === currentCode) {
      toast.info(t('language.noChange'));
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(t('language.saving'));

    try {
      const label = getLabelForCode(selectedLanguage);

      // ✅ Dispatch — main.jsx subscription flips i18n
      dispatch(
        setLanguageCode({
          code: selectedLanguage,
          name: label,
        })
      );

      toast.success(t('language.saveSuccess'), {
        id: toastId,
        description: t('language.saveSuccessDesc', { name: label }),
      });

      setTimeout(() => navigate('/settings'), 800);
    } catch (err) {
      console.error('Language save error:', err);
      toast.error(t('language.saveFailed'), {
        id: toastId,
        description: err?.message || t('common.error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  const currentLabel = getLabelForCode(selectedLanguage);

  return (
    <>
      {/* ============= Header with back button ============= */}
      <div className="flex items-center gap-3 mb-6 sm:mb-10">
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          title={t('common.back')}
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <h1 className="text-[20px] sm:text-[32px] font-bold text-gray-800 flex items-center gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={() => navigate('/settings')}
            className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-1 sm:gap-2 text-base sm:text-lg"
          >
            {t('accountSettings.title')}
            <img
              src={arrow}
              alt="Arrow"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </button>
          <span className="text-gray-800 text-base sm:text-2xl">
            {t('accountSettings.languages')}
          </span>
        </h1>
      </div>

      {/* ============= Body ============= */}
      <div className="min-h-screen flex flex-col justify-center font-poppins p-2 sm:p-4">
        <div className="flex flex-col items-center w-full">
          {/* Change Language Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 w-full max-w-lg mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
              {t('language.changeCard')}
            </h2>

            {activeLanguages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                <span className="text-sm">{t('common.loading')}</span>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-left flex justify-between items-center"
                >
                  <span className="text-base sm:text-lg font-medium text-black">
                    {currentLabel}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <ul>
                      {activeLanguages.map((lang, index) => {
                        const code = getCodeForLanguage(lang.Language_name);
                        const isSelected = code === selectedLanguage;

                        return (
                          <li
                            key={lang.Language_id ?? lang.Language_name}
                            onClick={() => handleSelect(lang)}
                            className={`px-3 sm:px-4 py-2 text-base sm:text-lg cursor-pointer text-black flex justify-between items-center
                              hover:text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-red-500
                              ${index === 0 ? 'rounded-t-lg' : ''}
                              ${
                                index === activeLanguages.length - 1
                                  ? 'rounded-b-lg'
                                  : ''
                              }
                              ${
                                isSelected
                                  ? 'bg-gray-100 font-semibold cursor-not-allowed'
                                  : ''
                              }`}
                          >
                            <span>{lang.Language_name}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-purple-600" />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto border border-gray-400 rounded-lg py-2 sm:py-3 px-10 sm:px-20 text-base sm:text-lg font-medium text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedLanguage === currentCode}
              className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-2 sm:py-3 px-10 sm:px-16 text-base sm:text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('language.saving')}
                </>
              ) : (
                t('language.submitButton')
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAdminLayout(LanguageSettings);