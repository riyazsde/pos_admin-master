import React, { useState } from 'react';
import { format } from 'date-fns';
import TimePickerModal from './TimePickerModal';
import DatePickerModal from './DatePickerModal';
import { Pen } from 'lucide-react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';

const DateTimeSettings = () => {
  const [date, setDate] = useState(new Date("2025-04-01T00:00:00"));
  const [time, setTime] = useState(new Date("2025-01-01T07:38:00"));

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  const handleTimeSave = (newTime) => {
    setTime(newTime);
    setIsTimeModalOpen(false);
  };

  const handleDateSave = (newDate) => {
    setDate(newDate);
    setIsDateModalOpen(false);
  };

  return (
    <>
      <h1 className="text-xl md:text-[32px] font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
        <span className="text-gray-400 flex items-center gap-1 md:gap-2 text-base md:text-lg">
          Account Settings
          <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
        </span>
        <span className="text-base md:text-2xl">Date & Time</span>
      </h1>

      <div className="flex flex-col items-center font-poppins px-3 md:px-0">
        <div className="w-full max-w-2xl">
          {/* Change Time */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 w-full mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">Change Time</h2>
            <div
              className="relative w-full cursor-pointer"
              onClick={() => setIsTimeModalOpen(true)}
            >
              <div className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 text-left text-base md:text-lg font-medium text-black">
                {format(time, 'hh:mm a')}
              </div>
              <span className="absolute inset-y-0 right-4 flex items-center justify-center bg-black rounded-full h-8 w-8 mt-2 md:mt-3">
                <Pen className="w-4 h-4 text-white" />
              </span>
            </div>
          </div>

          {/* Change Date */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 md:p-6 w-full">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">Change Date</h2>
            <div
              className="relative w-full cursor-pointer"
              onClick={() => setIsDateModalOpen(true)}
            >
              <div className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 text-left text-base md:text-lg font-medium text-black">
                {format(date, 'MMMM dd, yyyy')}
              </div>
              <span className="absolute inset-y-0 right-4 flex items-center justify-center bg-black rounded-full h-8 w-8 mt-2 md:mt-3">
                <Pen className="w-4 h-4 text-white" />
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-6 md:mt-8 justify-end">
            <button className="w-full sm:w-auto border border-gray-400 rounded-lg py-2 md:py-3 px-6 md:px-8 text-base md:text-lg font-medium text-black hover:bg-gray-100 transition">
              Cancel
            </button>
            <button className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-2 md:py-3 px-6 md:px-8 text-base md:text-lg font-medium hover:opacity-90 transition">
              Submit Reply
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
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
