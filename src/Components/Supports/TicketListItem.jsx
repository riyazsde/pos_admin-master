import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import notificationBlue from '../../assets/Images/admin/Supports/sms-notification.png';

const STATUS_OPTIONS = ['New', 'On-Going', 'Resolved', 'Pending', 'Closed'];

const STATUS_COLORS = {
  New:       { bg: 'bg-[#2D7FF9]', dot: 'bg-[#2D7FF9]' },
  'On-Going':{ bg: 'bg-[#F5A623]', dot: 'bg-[#F5A623]' },
  Resolved:  { bg: 'bg-[#34C759]', dot: 'bg-[#34C759]' },
  Pending:   { bg: 'bg-[#FF955A]', dot: 'bg-[#FF955A]' },
  Closed:    { bg: 'bg-gray-500',  dot: 'bg-gray-500' },
};

const TicketListItem = ({
  status,
  ticketId,
  title,
  description,
  userName,
  isFirst,
  onStatusChange, // (ticketDbId, newUiStatus) => Promise<void>
  ticketData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const current = STATUS_COLORS[status] || STATUS_COLORS.New;

  const handleSelect = (option) => {
    setIsOpen(false);
    if (option === status) return;
    onStatusChange?.(ticketData?.dbId ?? ticketId, option);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('[data-status-button]')) return;
    navigate('/ticket-details', { state: { ticket: ticketData } });
  };

  const postedAt = ticketData?.createdDate
    ? new Date(ticketData.createdDate).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '12:45 AM';

  return (
    <div
      onClick={handleCardClick}
      className={`flex flex-col items-start p-5 sm:p-6 gap-4 w-full bg-gradient-to-b from-purple-50 to-red-50 rounded-xl sm:rounded-2xl cursor-pointer hover:shadow-md transition-shadow border border-purple-100 ${
        isFirst ? '' : 'mt-5'
      }`}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${current.dot}`} />
          <p className="text-gray-900 font-semibold text-sm sm:text-base">
            Ticket# {ticketId}
          </p>
        </div>
        <p className="text-gray-500 font-medium text-xs sm:text-sm">
          Posted at {postedAt}
        </p>
      </div>

      <div className="flex justify-between items-start w-full gap-4">
        <h3 className="text-gray-900 font-semibold text-sm sm:text-base flex-1">
          {title}
        </h3>

        {/* Status dropdown */}
        <div className="relative" data-status-button>
          <button
            type="button"
            className={`flex items-center justify-center px-4 py-2 gap-2 ${current.bg} rounded-lg cursor-pointer text-sm min-w-[100px]`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <img
              src={notificationBlue}
              alt="status-icon"
              className="h-4 w-4 filter brightness-0 invert"
            />
            <span className="font-medium text-white">{status}</span>
            {isOpen ? (
              <ChevronUpIcon className="h-3.5 w-3.5 text-white" />
            ) : (
              <ChevronDownIcon className="h-3.5 w-3.5 text-white" />
            )}
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-20 overflow-hidden">
              {STATUS_OPTIONS.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 flex items-center gap-3 text-sm ${
                    option === status
                      ? 'bg-gray-50 font-semibold text-gray-900'
                      : 'text-gray-700'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[option].dot}`}
                  />
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-700 font-normal text-xs sm:text-sm leading-relaxed w-full line-clamp-3">
        {description}
      </p>

      <div className="w-full border-b border-gray-300/60" />

      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full bg-cover bg-center border border-purple-200"
            style={{ backgroundImage: 'url(https://via.placeholder.com/28)' }}
          />
          <p className="text-gray-800 font-medium text-xs sm:text-sm">
            {userName}
          </p>
        </div>
        <button
          type="button"
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