import React, { useState, useEffect } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, getYear, setYear, getMonth, setMonth
} from 'date-fns';
import { Pencil } from 'lucide-react';

const DatePickerModal = ({ isOpen, onClose, onSave, initialDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('days'); // 'days' or 'monthYear'

  useEffect(() => {
    if (isOpen) {
      const safeInitialDate = (initialDate && getYear(initialDate) >= getYear(new Date())) ? initialDate : new Date();
      setCurrentMonth(safeInitialDate);
      setSelectedDate(safeInitialDate);
      setViewMode('days');
    }
  }, [isOpen, initialDate]);

  const handleSave = () => {
    setCurrentMonth(selectedDate);
    onSave(selectedDate);
  };
  
  const handleClose = () => {
    setCurrentMonth(selectedDate);
    onClose();
  };

  // --- FIX: When a year is selected, update the selectedDate as well ---
  const handleYearSelect = (year) => {
    const newDate = setYear(selectedDate, year);
    setSelectedDate(newDate);
    setCurrentMonth(newDate); // Also sync the calendar view
  };

  // --- FIX: When a month is selected, update the selectedDate as well ---
  const handleMonthSelect = (monthIndex) => {
    const newDate = setMonth(selectedDate, monthIndex);
    setSelectedDate(newDate);
    setCurrentMonth(newDate); // Also sync the calendar view
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysInMonth = eachDayOfInterval({ start: startOfWeek(startOfMonth(currentMonth)), end: endOfWeek(endOfMonth(currentMonth)) });
  
  const currentSystemYear = getYear(new Date());
  const years = Array.from({ length: 8 }, (_, i) => currentSystemYear + i);
  const isPrevMonthDisabled = isSameMonth(currentMonth, new Date());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 font-poppins">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 to-red-500 p-4 text-white">
          <div className="text-md mb-2">Select date</div>
          <div className="flex justify-between items-center">
            {/* This will now update instantly when you change the year or month */}
            <span className="text-3xl font-bold">{format(selectedDate, "EEE, MMM dd")}</span>
            <button
              onClick={() => setViewMode(v => v === 'days' ? 'monthYear' : 'days')}
              className="focus:outline-none p-1 rounded-full hover:bg-black/20"
            >
              <Pencil className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {viewMode === 'days' && (
          <div className="flex justify-between items-center p-3 bg-white">
            <span className="font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</span>
            <div>
              <button 
                onClick={prevMonth} 
                disabled={isPrevMonthDisabled}
                className="px-2 py-1 text-xl hover:bg-gray-100 rounded-full disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                {'<'}
              </button>
              <button onClick={nextMonth} className="px-2 py-1 text-xl hover:bg-gray-100 rounded-full">{'>'}</button>
            </div>
          </div>
        )}
        
        <div className="p-4">
          {viewMode === 'days' ? (
            <div className="animate-fade-in">
              <div className="grid grid-cols-7 gap-y-2 text-center text-sm text-gray-500 mb-2">
                {dayNames.map((day, index) => <div key={index}>{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map(day => {
                    const isPastDay = day < new Date() && !isSameDay(day, new Date());
                    return (
                        <button
                          key={day.toString()}
                          onClick={() => !isPastDay && setSelectedDate(day)}
                          disabled={isPastDay}
                          className={`w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center
                            ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : 'text-gray-800'}
                            ${isSameDay(day, selectedDate) ? 'bg-red-500 text-white shadow-md' : 'hover:bg-gray-100'}
                            ${isPastDay ? 'text-gray-300 cursor-not-allowed' : ''}
                          `}
                        >
                          {format(day, 'd')}
                        </button>
                    )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-3">Months</h3>
                <div className="grid grid-cols-6 gap-2 text-center">
                  {monthNames.map((month, index) => {
                    const isPastMonth = getYear(currentMonth) === currentSystemYear && index < getMonth(new Date());
                    return (
                      <button
                        key={month}
                        onClick={() => !isPastMonth && handleMonthSelect(index)}
                        disabled={isPastMonth}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200
                          ${index === getMonth(currentMonth) ? 'bg-purple-600 text-white' : ' hover:bg-gray-200 text-gray-700'}
                          ${isPastMonth ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-3">Year</h3>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`p-3 rounded-lg font-medium transition-colors duration-200
                        ${year === getYear(currentMonth) ? 'bg-purple-600 text-white' : ' hover:bg-gray-200 text-gray-700'}
                      `}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-6 p-4 bg-white border-t">
          <button onClick={handleClose} className="font-bold text-gray-600 hover:text-gray-800">CANCEL</button>
          <button onClick={handleSave} className="font-bold text-purple-700 border border-purple-400 rounded-md px-6 py-1.5 hover:bg-purple-50">Save</button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerModal;