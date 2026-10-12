import React from 'react';
import smsIcon from '../../assets/Images/admin/Supports/sms.png';
import smsBlue from '../../assets/Images/admin/Supports/sms-blue.png';
import notificationIcon from '../../assets/Images/admin/Supports/sms-notification.png';
import notificationBlue from '../../assets/Images/admin/Supports/sms-notification-blue.png';
import tracking from '../../assets/Images/admin/Supports/sms-tracking.png';
import trackingYellow from '../../assets/Images/admin/Supports/sms-tracking-yellow.png';
import starr from '../../assets/Images/admin/Supports/sms-star.png';
import starrGreen from '../../assets/Images/admin/Supports/sms-star-green.png';

const TABS = [
  { name: 'All Tickets', defaultImage: smsBlue,         activeImage: smsIcon,          activeColor: 'text-purple-700',  borderColor: 'border-purple-700' },
  { name: 'New',         defaultImage: notificationIcon, activeImage: notificationBlue, activeColor: 'text-[#2D7FF9]',   borderColor: 'border-[#2D7FF9]' },
  { name: 'On-Going',    defaultImage: tracking,         activeImage: trackingYellow,   activeColor: 'text-[#F5A623]',   borderColor: 'border-[#F5A623]' },
  { name: 'Pending',     defaultImage: notificationIcon, activeImage: notificationBlue, activeColor: 'text-[#FF955A]',   borderColor: 'border-[#FF955A]' },
  { name: 'Resolved',    defaultImage: starr,            activeImage: starrGreen,       activeColor: 'text-[#34C759]',   borderColor: 'border-[#34C759]' },
  { name: 'Closed',      defaultImage: starr,            activeImage: starrGreen,       activeColor: 'text-gray-600',    borderColor: 'border-gray-600' },
  { name: 'Escalated',   defaultImage: notificationIcon, activeImage: notificationBlue, activeColor: 'text-red-600',     borderColor: 'border-red-600' },
];

const TicketStatusNav = ({ activeTab, setActiveTab }) => (
  <div className="flex flex-wrap md:flex-nowrap items-end gap-6 w-full border-b border-gray-100 pb-2">
    {TABS.map((tab) => {
      const isActive = activeTab === tab.name;
      const icon = isActive ? tab.activeImage : tab.defaultImage;
      return (
        <div
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex items-center gap-2 pb-1 cursor-pointer transition-all duration-200 ${
            isActive
              ? `${tab.activeColor} border-b-2 ${tab.borderColor}`
              : 'text-gray-400 border-b-2 border-transparent hover:text-gray-600'
          }`}
        >
          <img src={icon} alt={`${tab.name} icon`} className="h-4 w-4 sm:h-5 sm:w-5 object-contain" />
          <span className="font-medium text-sm sm:text-base whitespace-nowrap">{tab.name}</span>
        </div>
      );
    })}
  </div>
);

export default TicketStatusNav;