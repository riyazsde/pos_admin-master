import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import notificationBlue from '../../assets/Images/admin/Supports/sms-notification.png';

const TicketListItem = ({
  status,
  ticketId,
  title,
  description,
  userName,
  isFirst,
  onStatusChange,
  ticketData,
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const statusColors = {
    New: { bg: 'bg-[#2D7FF9]', dot: 'bg-[#2D7FF9]' },
    'On-Going': { bg: 'bg-[#F5A623]', dot: 'bg-[#F5A623]' },
    Resolved: { bg: 'bg-[#34C759]', dot: 'bg-[#34C759]' },
    Pending: { bg: 'bg-[#FF955A]', dot: 'bg-[#FF955A]' },
    Closed: { bg: 'bg-gray-500', dot: 'bg-gray-500' },
  };

  const currentStatus = statusColors[status] || statusColors.New;

  const handleStatusChangeClick = (newStatus) => {
    setIsStatusDropdownOpen(false);
    if (onStatusChange) onStatusChange(ticketId, newStatus);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('[data-status-button]')) return;
    navigate('/ticket-details', { state: { ticket: ticketData } });
  };

  const statusButton = (
    <div className="relative" data-status-button>
      <button
        className={`flex items-center justify-center px-4 py-2 gap-2 ${currentStatus.bg} rounded-lg cursor-pointer text-sm min-w-[100px]`}
        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
      >
        <img
          src={notificationBlue}
          alt="status-icon"
          className="h-4 w-4 filter brightness-0 invert"
        />
        <span className="font-medium text-white">{status}</span>
        {isStatusDropdownOpen ? (
          <ChevronUpIcon className="h-3.5 w-3.5 text-white" />
        ) : (
          <ChevronDownIcon className="h-3.5 w-3.5 text-white" />
        )}
      </button>

      {isStatusDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-20 overflow-hidden">
          {['New', 'On-Going', 'Resolved', 'Closed'].map((option) => (
            <div
              key={option}
              onClick={() => handleStatusChangeClick(option)}
              className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  (statusColors[option] || statusColors.New).dot
                }`}
              ></span>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      onClick={handleCardClick}
      className={`flex flex-col items-start p-5 sm:p-6 gap-4 w-full bg-gradient-to-b from-purple-50 to-red-50 rounded-xl sm:rounded-2xl cursor-pointer hover:shadow-md transition-shadow border border-purple-100 ${
        isFirst ? '' : 'mt-5'
      }`}
    >
      {/* Header row */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${currentStatus.dot}`}></div>
          <p className="text-gray-900 font-semibold text-sm sm:text-base">
            Ticket# {ticketId}
          </p>
        </div>
        <p className="text-gray-500 font-medium text-xs sm:text-sm">
          Posted at 12:45 AM
        </p>
      </div>

      {/* Title + status */}
      <div className="flex justify-between items-start w-full gap-4">
        <h3 className="text-gray-900 font-semibold text-sm sm:text-base flex-1">
          {title}
        </h3>
        {statusButton}
      </div>

      {/* Description */}
      <p className="text-gray-700 font-normal text-xs sm:text-sm leading-relaxed w-full line-clamp-3">
        {description}
      </p>

      <div className="w-full border-b border-gray-300/60"></div>

      {/* Footer */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full bg-cover bg-center border border-purple-200"
            style={{ backgroundImage: 'url(https://via.placeholder.com/28)' }}
          ></div>
          <p className="text-gray-800 font-medium text-xs sm:text-sm">
            {userName}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/ticket-details', { state: { ticket: ticketData } });
          }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-red-700 font-semibold text-xs sm:text-sm hover:underline"
        >
          Open Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketListItem;