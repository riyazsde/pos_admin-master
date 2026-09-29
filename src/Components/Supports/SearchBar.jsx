import React, { useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const SearchBar = () => {
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState('Select Priority');
    const [selectedDateRange, setSelectedDateRange] = useState('Today');

    const priorityOptions = [
        { name: 'New Ticket', color: 'bg-blue-500' },
        { name: 'Ongoing Ticket', color: 'bg-yellow-500' },
        { name: 'Resolved Ticket', color: 'bg-green-500' },
    ];

    const dateOptions = [
        'Today',
        'Yesterday',
        'This Week',
        'This Month',
        'Three Month',
        'Six Month'
    ];

    const handlePrioritySelect = (priority) => {
        setSelectedPriority(priority);
        setIsPriorityDropdownOpen(false);
    };

    const handleDateSelect = (range) => {
        setSelectedDateRange(range);
        setIsDateDropdownOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between md:items-end w-full gap-4">
            {/* Search input */}
            <div className="flex items-center px-4 py-2 gap-2 bg-gradient-to-r from-purple-100 to-red-100 rounded-lg w-full md:w-auto">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search for ticket"
                    className="bg-transparent outline-none placeholder-gray-500 text-gray-500 text-base font-medium w-full md:w-36"
                />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row items-start md:items-end gap-4 w-full md:w-auto">
                {/* Priority Dropdown */}
                <div className="relative w-full sm:w-auto">
                    <button
                        className="flex items-center justify-between sm:justify-center w-full sm:w-auto px-4 py-2 gap-2 border border-black rounded-lg cursor-pointer"
                        onClick={() => {
                            setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
                            setIsDateDropdownOpen(false);
                        }}
                    >
                        <span className="text-black text-base font-normal truncate">{selectedPriority}</span>
                        <ChevronDownIcon className="h-4 w-4 text-black" />
                    </button>

                    {isPriorityDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-[246px] bg-white shadow-lg rounded-lg flex flex-col items-start gap-4 px-3 py-5 z-10">
                            {priorityOptions.map(({ name, color }) => (
                                <button
                                    key={name}
                                    onClick={() => handlePrioritySelect(name)}
                                    className={`flex items-center w-full h-8 px-2 py-4 gap-4 border-b border-black/20 font-[500] text-[16px] leading-[24px] font-[Manrope]
                                        ${selectedPriority === name
                                            ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                                            : 'text-black bg-white hover:text-white hover:bg-gradient-to-b hover:from-[#6A1B9A] hover:to-[#D32F2F] rounded'}
                                    `}
                                >
                                    <span className={`w-3 h-3 rounded-full ${color}`}></span>
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Dropdown */}
                <div className="relative w-full sm:w-auto">
                    <button
                        className="flex items-center justify-between sm:justify-center w-full sm:w-auto px-4 py-2 gap-2 border border-black rounded-lg cursor-pointer"
                        onClick={() => {
                            setIsDateDropdownOpen(!isDateDropdownOpen);
                            setIsPriorityDropdownOpen(false);
                        }}
                    >
                        <span className="text-black text-base font-normal truncate">{selectedDateRange}</span>
                        <ChevronDownIcon className="h-4 w-4 text-black" />
                    </button>

                    {isDateDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-[246px] bg-white shadow-lg rounded-lg flex flex-col items-start gap-4 px-3 py-5 z-10">
                            {dateOptions.map((range) => (
                                <button
                                    key={range}
                                    onClick={() => handleDateSelect(range)}
                                    className={`flex items-center w-full h-8 px-2 py-4 gap-4 border-b border-black/20 font-[500] text-[16px] leading-[24px] font-[Manrope]
                                        ${selectedDateRange === range
                                            ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                                            : 'text-black bg-white hover:text-white hover:bg-gradient-to-b hover:from-[#6A1B9A] hover:to-[#D32F2F] rounded'}
                                    `}
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
