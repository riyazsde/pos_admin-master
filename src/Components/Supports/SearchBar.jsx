import React, { useState, useEffect } from 'react';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';

const PRIORITY_OPTIONS = [
  { name: 'New Ticket',      value: 'New',       color: 'bg-blue-500' },
  { name: 'Ongoing Ticket',  value: 'On-Going',  color: 'bg-yellow-500' },
  { name: 'Pending Ticket',  value: 'Pending',   color: 'bg-orange-500' },
  { name: 'Resolved Ticket', value: 'Resolved',  color: 'bg-green-500' },
  { name: 'Closed Ticket',   value: 'Closed',    color: 'bg-gray-500' },
];

const DATE_OPTIONS = [
  'Today', 'Yesterday', 'This Week',
  'This Month', 'Three Month', 'Six Month',
];

const SearchBar = ({ onSearch, onFilterChange }) => {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('Select Priority');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [query, setQuery] = useState('');

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => onSearch?.(query), 300);
    return () => clearTimeout(t);
  }, [query, onSearch]);

  const handlePrioritySelect = (priority) => {
    setSelectedPriority(priority.name);
    setIsPriorityOpen(false);
    onFilterChange?.({ status: priority.value });
  };

  const handlePriorityClear = () => {
    setSelectedPriority('Select Priority');
    setIsPriorityOpen(false);
    onFilterChange?.({ status: null });
  };

  const handleDateSelect = (range) => {
    setSelectedDate(range);
    setIsDateOpen(false);
    onFilterChange?.({ dateRange: range });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-end w-full gap-4">
      <div className="flex items-center px-4 py-2 gap-2 bg-gradient-to-r from-purple-100 to-red-100 rounded-lg w-full md:w-auto">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for ticket"
          className="bg-transparent outline-none placeholder-gray-500 text-gray-500 text-base font-medium w-full md:w-56"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start md:items-end gap-4 w-full md:w-auto">
        {/* Priority dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            className="flex items-center justify-between sm:justify-center w-full sm:w-auto px-4 py-2 gap-2 border border-black rounded-lg cursor-pointer"
            onClick={() => {
              setIsPriorityOpen(!isPriorityOpen);
              setIsDateOpen(false);
            }}
          >
            <span className="text-black text-base font-normal truncate">
              {selectedPriority}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-black" />
          </button>

          {isPriorityOpen && (
            <div className="absolute top-full left-0 mt-2 w-[246px] bg-white shadow-lg rounded-lg flex flex-col items-start gap-4 px-3 py-5 z-10">
              <button
                type="button"
                onClick={handlePriorityClear}
                className="flex items-center w-full h-8 px-2 py-4 gap-4 border-b border-black/20 text-black bg-white hover:bg-gray-50 rounded"
              >
                Clear filter
              </button>
              {PRIORITY_OPTIONS.map(({ name, value, color }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handlePrioritySelect({ name, value, color })}
                  className={`flex items-center w-full h-8 px-2 py-4 gap-4 border-b border-black/20 font-medium text-base ${
                    selectedPriority === name
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                      : 'text-black bg-white hover:text-white hover:bg-gradient-to-b hover:from-[#6A1B9A] hover:to-[#D32F2F] rounded'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${color}`} />
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            className="flex items-center justify-between sm:justify-center w-full sm:w-auto px-4 py-2 gap-2 border border-black rounded-lg cursor-pointer"
            onClick={() => {
              setIsDateOpen(!isDateOpen);
              setIsPriorityOpen(false);
            }}
          >
            <span className="text-black text-base font-normal truncate">
              {selectedDate}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-black" />
          </button>

          {isDateOpen && (
            <div className="absolute top-full right-0 mt-2 w-[246px] bg-white shadow-lg rounded-lg flex flex-col items-start gap-4 px-3 py-5 z-10">
              {DATE_OPTIONS.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleDateSelect(range)}
                  className={`flex items-center w-full h-8 px-2 py-4 gap-4 border-b border-black/20 font-medium text-base ${
                    selectedDate === range
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                      : 'text-black bg-white hover:text-white hover:bg-gradient-to-b hover:from-[#6A1B9A] hover:to-[#D32F2F] rounded'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;