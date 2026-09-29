import React, { useState, useEffect } from 'react';
import { getHours, getMinutes, setHours, setMinutes } from 'date-fns';

const TimePickerModal = ({ isOpen, onClose, onSave, initialTime }) => {
  // State now holds string values to allow for easier input management (e.g., "07")
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  // This effect sets the initial time when the modal opens
  useEffect(() => {
    if (isOpen && initialTime) {
      let h = getHours(initialTime);
      const m = getMinutes(initialTime);
      
      if (h >= 12) {
        setPeriod('PM');
        if (h > 12) h -= 12; // Convert to 12-hour format
      } else {
        setPeriod('AM');
        if (h === 0) h = 12; // Midnight case
      }
      
      setHour(String(h).padStart(2, '0'));
      setMinute(String(m).padStart(2, '0'));
    }
  }, [isOpen, initialTime]);

  // Generic handler to update time inputs, ensuring only numbers are entered
  const handleTimeChange = (setter) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setter(value);
  };
  
  // This function validates and formats the number when the user clicks away
  const handleBlur = (setter, max, min = 0) => (e) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      value = min; // Default to min if input is invalid
    } else if (value > max) {
      value = max; // Cap at max value
    } else if (value < min) {
      value = min; // Floor at min value
    }
    
    setter(String(value).padStart(2, '0'));
  };

  const handleSave = () => {
    let newTime = initialTime ? new Date(initialTime) : new Date();
    
    let hourToSet = parseInt(hour, 10);
    if (period === 'PM' && hourToSet < 12) {
      hourToSet += 12;
    } else if (period === 'AM' && hourToSet === 12) { // Handle 12 AM (midnight)
      hourToSet = 0;
    }
    
    newTime = setHours(newTime, hourToSet);
    newTime = setMinutes(newTime, parseInt(minute, 10));
    onSave(newTime);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-5">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs font-poppins">
        <h3 className="text-xl font-semibold mb-6">Enter time</h3>

        <div className="flex items-center justify-center gap-4">
          {/* Time Display with Inputs */}
          <div className="flex items-center justify-center bg-gray-100/60 border border-purple-300 rounded-2xl px-6 py-4">
            <div className="text-center">
              <input
                type="text"
                maxLength="2"
                value={hour}
                onChange={handleTimeChange(setHour)}
                onBlur={handleBlur(setHour, 12, 1)} // Hours are 1-12
                className="text-5xl font-bold text-gray-800 tracking-wider bg-transparent w-20 text-center focus:outline-none"
              />
              <p className="text-sm text-gray-500">Hour</p>
            </div>
            <span className="text-5xl font-bold text-gray-800 mx-2">:</span>
            <div className="text-center">
              <input
                type="text"
                maxLength="2"
                value={minute}
                onChange={handleTimeChange(setMinute)}
                onBlur={handleBlur(setMinute, 59, 0)} // Minutes are 0-59
                className="text-5xl font-bold text-gray-800 tracking-wider bg-transparent w-20 text-center focus:outline-none"
              />
              <p className="text-sm text-gray-500">Minute</p>
            </div>
          </div>

          {/* AM/PM Selector */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setPeriod('AM')}
              className={`px-4 py-3 w-16 text-lg font-semibold rounded-md transition-all duration-200 ${
                period === 'AM'
                  ? 'bg-gradient-to-r from-purple-700 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setPeriod('PM')}
              className={`px-4 py-3 w-16 text-lg font-semibold rounded-md transition-all duration-200 ${
                period === 'PM'
                  ? 'bg-gradient-to-r from-purple-700 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        <div className="flex justify-end items-center gap-6 mt-8">
          <button onClick={onClose} className="font-semibold text-gray-600">
            CANCEL
          </button>
          <button onClick={handleSave} className="font-semibold text-purple-700">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimePickerModal;