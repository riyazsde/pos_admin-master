// src/Components/Settings/CurrencySettings.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Plus, X, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';
import { currencyService } from '../../Services/apiService';

// Click-outside hook
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

const CurrencySettings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newCurrency, setNewCurrency] = useState({
    name: '',
    icon: '',
  });

  const fetchedRef = useRef(false);

  useOutsideAlerter(dropdownRef, () => setIsOpen(false));

  // ✅ Fetch currencies
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      try {
        const result = await currencyService.getAll();
        setCurrencies(result.data || []);
        if (result.data?.length > 0) {
          // Prefer saved currency from localStorage
          const savedName = localStorage.getItem('selectedCurrency');
          const match = result.data.find((c) => c.name === savedName);
          setSelectedCurrency(match || result.data[0]);
        }
      } catch (err) {
        console.error('Currency fetch error:', err);
        toast.error(t('currency.loadFailed'), {
          description: err?.message || t('common.error'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // ✅ Create currency
  const handleCreateCurrency = async (e) => {
    e.preventDefault();
    if (!newCurrency.name.trim() || !newCurrency.icon.trim()) {
      toast.error(t('currency.fillRequired'));
      return;
    }

    setIsCreating(true);
    const toastId = toast.loading(t('currency.creating'));

    try {
      const created = await currencyService.create({
        name: newCurrency.name.trim().toUpperCase(),
        icon: newCurrency.icon.trim(),
        Status: true,
      });

      toast.success(t('currency.createSuccess'), { id: toastId });

      if (created) {
        setCurrencies((prev) => [...prev, created]);
      } else {
        const refetched = await currencyService.getAll();
        setCurrencies(refetched.data || []);
      }

      setNewCurrency({ name: '', icon: '' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Currency create error:', err);
      toast.error(t('currency.createFailed'), {
        id: toastId,
        description:
          err?.response?.data?.message ||
          err?.message ||
          t('common.error'),
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCurrency) return;

    setIsSubmitting(true);
    const toastId = toast.loading(t('currency.saving'));

    try {
      localStorage.setItem('selectedCurrency', selectedCurrency.name);

      toast.success(t('currency.saveSuccess'), {
        id: toastId,
        description: t('currency.saveSuccessDesc', {
          name: selectedCurrency.name,
        }),
      });

      setTimeout(() => navigate('/settings'), 800);
    } catch (err) {
      console.error('Currency save error:', err);
      toast.error(t('currency.saveFailed'), {
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

  const handleSelect = (currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  // Header (reusable)
  const Header = () => (
    <div className="flex items-center gap-3 mb-4 md:mb-10">
      <button
        onClick={() => navigate('/settings')}
        className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
        title={t('common.back')}
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      <h1 className="text-xl md:text-[32px] font-bold text-gray-800 flex items-center gap-2 md:gap-4 flex-wrap">
        <button
          onClick={() => navigate('/settings')}
          className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-1 md:gap-2 text-base md:text-2xl"
        >
          {t('accountSettings.title')}
          <img src={arrow} alt="Arrow" className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <span className="text-base md:text-3xl text-gray-800">
          {t('currency.title')}
        </span>
      </h1>
    </div>
  );

  return (
    <>
      <Header />

      <div className="min-h-screen flex flex-col justify-center font-poppins p-4">
        <div className="flex flex-col items-center w-full">
          {/* Create toggle */}
          <div className="w-full max-w-lg flex justify-end mb-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white text-sm font-semibold rounded-lg hover:opacity-90 shadow-sm"
            >
              {showCreateForm ? (
                <>
                  <X className="w-4 h-4" /> {t('common.cancel')}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> {t('currency.addCurrency')}
                </>
              )}
            </button>
          </div>

          {/* Create form */}
          {showCreateForm && (
            <form
              onSubmit={handleCreateCurrency}
              className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 w-full max-w-lg mb-6 space-y-4"
            >
              <h3 className="text-xl md:text-2xl font-bold text-black">
                {t('currency.createTitle')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t('currency.form.name')}
                  </label>
                  <input
                    type="text"
                    value={newCurrency.name}
                    onChange={(e) =>
                      setNewCurrency((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. XOF"
                    disabled={isCreating}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t('currency.form.icon')}
                  </label>
                  <input
                    type="text"
                    value={newCurrency.icon}
                    onChange={(e) =>
                      setNewCurrency((p) => ({ ...p, icon: e.target.value }))
                    }
                    placeholder="e.g. CFA"
                    disabled={isCreating}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white text-sm font-semibold rounded-lg hover:opacity-95 disabled:opacity-60 flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('currency.creating')}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {t('currency.createButton')}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Change Currency Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-lg mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">
              {t('currency.changeCard')}
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                <span className="text-sm">{t('currency.loading')}</span>
              </div>
            ) : currencies.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-6">
                {t('currency.noData')}
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left flex justify-between items-center"
                >
                  <span className="text-lg font-medium text-black">
                    {selectedCurrency
                      ? `${selectedCurrency.name} (${selectedCurrency.icon})`
                      : t('currency.selectPlaceholder')}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
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
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200">
                    <ul role="listbox">
                      {currencies.map((currency, index) => {
                        const isSelected =
                          selectedCurrency?._id === currency._id;
                        return (
                          <li
                            key={currency._id || index}
                            role="option"
                            onClick={() => handleSelect(currency)}
                            className={`
                              px-4 py-2 text-lg cursor-pointer text-black flex justify-between items-center
                              hover:text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-red-500
                              ${index === 0 ? 'rounded-t-lg' : ''}
                              ${
                                index === currencies.length - 1
                                  ? 'rounded-b-lg'
                                  : ''
                              }
                              ${
                                isSelected
                                  ? 'bg-gray-100 cursor-not-allowed'
                                  : ''
                              }
                            `}
                          >
                            <span>
                              {currency.name} ({currency.icon})
                            </span>
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
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto border border-gray-400 rounded-lg py-3 px-20 text-lg font-medium text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedCurrency}
              className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-3 px-16 text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('currency.saving')}
                </>
              ) : (
                t('currency.submitButton')
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAdminLayout(CurrencySettings);