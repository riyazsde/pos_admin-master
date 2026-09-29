import React from 'react';
// Importing image icons
import money from '../../assets/Images/admin/client/money.png';
import bill from '../../assets/Images/admin/client/bill.png';
import global from '../../assets/Images/admin/client/global-user.png';

const TicketSummaryCard = ({ title, count, iconBgColor, textColor, iconType }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'money':
        return <img src={money} alt="Money Icon" className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'bill':
        return <img src={bill} alt="Bill Icon" className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'global':
        return <img src={global} alt="Global Icon" className="h-6 w-6 sm:h-8 sm:w-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full shadow-md rounded-2xl bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Icon Container */}
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}>
          {getIcon(iconType)}
        </div>
        
        {/* Content Container */}
        <div className="flex flex-col items-start gap-1 sm:gap-2 min-w-0 flex-1">
          <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg leading-tight">
            {title}
          </p>
          <h2 className={`font-bold text-xl sm:text-2xl md:text-3xl ${textColor} leading-tight`}>
            {count}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default TicketSummaryCard;