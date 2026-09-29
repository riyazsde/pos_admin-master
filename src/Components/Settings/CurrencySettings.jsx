import React, { useState, useRef, useEffect } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';

// Custom hook to detect clicks outside of a component
const useOutsideAlerter = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const CurrencySettings = () => {
  const currencies = ["XOF (default)", "Dollar", "Euro", "Riyal", "INR"];
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideAlerter(dropdownRef, () => setIsOpen(false));

  // Load saved currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  const handleSelect = (currency) => {
    if (currency !== selectedCurrency) {
      setSelectedCurrency(currency);
      localStorage.setItem('selectedCurrency', currency);
    }
    setIsOpen(false);
  };

  return (
    <>
      <h1 className="text-[32px] font-bold text-gray-800 mb-10 flex items-center gap-4">
        <span className="text-gray-400 flex items-center gap-2">
          Account Settings <img src={arrow} alt="Arrow" className="w-5 h-5" />
        </span>
        <span className="text-gray-800">Currency</span>
      </h1>

      <div className="min-h-screen flex flex-col justify-center font-poppins p-4">
        <div className="flex flex-col items-center w-full">
          {/* Change Currency Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-lg mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">Change Currency</h2>

            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left flex justify-between items-center"
              >
                <span className="text-lg font-medium text-black">{selectedCurrency}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transition-all duration-200 transform scale-100 opacity-100">
                  <ul role="listbox">
                    {currencies.map((currency, index) => (
                      <li
                        key={index}
                        role="option"
                        onClick={() => handleSelect(currency)}
                        className={`
                          px-4 py-2 text-lg cursor-pointer text-black
                          hover:text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-red-500
                          ${index === 0 ? 'rounded-t-lg' : ''}
                          ${index === currencies.length - 1 ? 'rounded-b-lg' : ''}
                          ${currency === selectedCurrency ? 'bg-gray-100 cursor-not-allowed' : ''}
                        `}
                      >
                        {currency}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                setSelectedCurrency(currencies[0]);
                localStorage.removeItem('selectedCurrency');
              }}
              className="w-full sm:w-auto border border-gray-400 rounded-lg py-3 px-20 text-lg font-medium text-black hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-3 px-16 text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Submit Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAdminLayout(CurrencySettings);
