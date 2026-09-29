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

const LanguageSettings = () => {
  const languages = ["French (default)", "English", "Spanish", "Portuguese", "Arabic"];
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOutsideAlerter(dropdownRef, () => setIsOpen(false));

  const handleSelect = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <>
      <h1 className="text-[20px] sm:text-[32px] font-bold text-gray-800 mb-6 sm:mb-10 flex items-center gap-2 sm:gap-4">
        <span className="text-gray-400 flex items-center gap-1 sm:gap-2 text-base sm:text-lg">
          Account Settings <img src={arrow} alt="Arrow" className="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
        <span className="text-gray-800 text-base sm:text-2xl">Languages</span>
      </h1>

      <div className="min-h-screen flex flex-col justify-center font-poppins p-2 sm:p-4">
        <div className="flex flex-col items-center w-full">
          {/* Change Language Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 w-full max-w-lg mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Change Language</h2>

            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-left flex justify-between items-center"
              >
                <span className="text-base sm:text-lg font-medium text-black">{selectedLanguage}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <ul>
                    {languages.map((language, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(language)}
                        className={`px-3 sm:px-4 py-2 text-base sm:text-lg cursor-pointer text-black
                          hover:text-white hover:bg-gradient-to-r hover:from-purple-700 hover:to-red-500
                          ${index === 0 ? 'rounded-t-lg' : ''}
                          ${index === languages.length - 1 ? 'rounded-b-lg' : ''}`}
                      >
                        {language}
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
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto border border-gray-400 rounded-lg py-2 sm:py-3 px-10 sm:px-20 text-base sm:text-lg font-medium text-black hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-2 sm:py-3 px-10 sm:px-16 text-base sm:text-lg font-medium hover:opacity-90 transition-opacity">
              Submit Reply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAdminLayout(LanguageSettings);
