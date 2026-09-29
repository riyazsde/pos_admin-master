import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔹 Import navigate
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import notificationBlue from '../../assets/Images/admin/Supports/sms-notification.png';

const TicketListItem = ({ status, ticketId, title, description, userName, isFirst, onStatusChange }) => {
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const navigate = useNavigate(); // 🔹 Hook for navigation

    const statusColors = {
        New: { bg: 'bg-blue-500', dot: 'bg-blue-500' },
        Resolved: { bg: 'bg-green-500', dot: 'bg-green-500' },
        'On-Going': { bg: 'bg-orange-500', dot: 'bg-orange-500' },
    };

    const currentStatus = statusColors[status];

    const handleStatusChangeClick = (newStatus) => {
        setIsStatusDropdownOpen(false);
        if (onStatusChange) {
            onStatusChange(ticketId, newStatus);
        }

        if (newStatus === 'New') {
            navigate('/ticket-details'); // 🔹 Replace with your route
        }
    };

    const statusButton = (
        <div className="relative">
            <button
                className={`flex items-center justify-center px-3 py-2 sm:px-4 gap-2 ${currentStatus.bg} rounded-lg cursor-pointer text-sm sm:text-base`}
                onClick={() => {
                    if (status === 'New') {
                        handleStatusChangeClick('New'); // 🔹 Directly navigate
                    } else {
                        setIsStatusDropdownOpen(!isStatusDropdownOpen); // 🔹 Toggle dropdown
                    }
                }}
            >
                <img
                    src={notificationBlue}
                    alt="status-icon"
                    className="h-4 w-4 sm:h-5 sm:w-5 filter brightness-0 saturate-100 invert sepia-100 hue-rotate-180"
                />
                <span className="font-medium text-sm sm:text-lg text-white">{status}</span>
                {status !== 'New' && (isStatusDropdownOpen ? (
                    <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                ) : (
                    <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                ))}
            </button>

            {/* Dropdown for On-Going and Resolved only */}
            {(status === 'On-Going' || status === 'Resolved') && isStatusDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-20">
                    {['On-Going', 'Resolved'].map((option, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-2 sm:px-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => handleStatusChangeClick(option)}
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <img src={notificationBlue} alt="status-icon" className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-black text-sm sm:text-base font-normal">
                                    {status === 'Resolved' && option === 'On-Going'
                                        ? 'Reopen (On-Going)'
                                        : option}
                                </span>
                            </div>
                            <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className={`flex flex-col items-start p-4 sm:p-6 gap-3 sm:gap-4 w-full bg-gradient-to-b from-purple-100 to-red-100 rounded-xl sm:rounded-2xl ${isFirst ? '' : 'mt-6 sm:mt-10'}`}>
            {/* Header Section - Responsive layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${currentStatus.dot}`}></div>
                    <p className="text-black font-medium text-sm sm:text-base">Ticket# {ticketId}</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-start sm:justify-center items-start sm:items-end gap-2 w-full sm:w-auto">
                    <p className="text-black font-medium text-xs sm:text-sm order-2 sm:order-1">Posted at 12:45 AM</p>
                    <div className="order-1 sm:order-2">
                        {statusButton}
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-black font-semibold text-sm sm:text-base w-full leading-tight">{title}</h3>
            
            {/* Description */}
            <p className="text-black font-normal text-sm sm:text-base leading-relaxed w-full">{description}</p>
            
            {/* Divider */}
            <div className="w-full border-b border-gray-500"></div>
            
            {/* Footer Section - Responsive layout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 sm:gap-0">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url(https://via.placeholder.com/28)' }}></div>
                    <p className="text-black font-medium text-xs sm:text-sm">{userName}</p>
                </div>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-red-700 font-medium text-xs sm:text-sm">Open Ticket</p>
            </div>
        </div>
    );
};

export default TicketListItem;