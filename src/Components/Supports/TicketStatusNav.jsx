import React from 'react';
import smsIcon from '../../assets/Images/admin/Supports/sms.png';
import smsBlue from '../../assets/Images/admin/Supports/sms-blue.png';
import notificationIcon from '../../assets/Images/admin/Supports/sms-notification.png';
import notificationBlue from '../../assets/Images/admin/Supports/sms-notification-blue.png';
import tracking from '../../assets/Images/admin/Supports/sms-tracking.png';
import trackingYellow from '../../assets/Images/admin/Supports/sms-tracking-yellow.png';
import starr from '../../assets/Images/admin/Supports/sms-star.png';
import starrGreen from '../../assets/Images/admin/Supports/sms-star-green.png';

const TicketStatusNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      name: 'All Tickets',
      statusMatch: 'All Tickets',
      defaultImage: smsBlue,
      blueImage: smsIcon,
    },
    {
      name: 'New',
      statusMatch: 'New',
      defaultImage: notificationIcon,
      blueImage: notificationBlue,
    },
    {
      name: 'On-Going',
      statusMatch: 'On-Going',
      defaultImage: tracking,
      yellowImage: trackingYellow,
    },
    {
      name: 'Resolved',
      statusMatch: 'Resolved',
      defaultImage: starr,
      greenImage: starrGreen,
    },
  ];

  const getImage = (tab, isActive) => {
    if (tab.statusMatch === 'All Tickets') {
      return isActive ? tab.blueImage : tab.defaultImage;
    }
    if (!isActive) return tab.defaultImage;

    switch (tab.statusMatch) {
      case 'New': return tab.blueImage;
      case 'On-Going': return tab.yellowImage;
      case 'Resolved': return tab.greenImage;
      default: return tab.defaultImage;
    }
  };

  const getColorClass = (status, isActive) => {
    if (!isActive) return { text: 'text-gray-500', border: '' };

    switch (status) {
      case 'New': return { text: 'text-blue-500', border: 'border-b-2 border-blue-500' };
      case 'On-Going': return { text: 'text-yellow-500', border: 'border-b-2 border-yellow-500' };
      case 'Resolved': return { text: 'text-green-500', border: 'border-b-2 border-green-500' };
      default: return { text: 'text-purple-700', border: 'border-b-2 border-purple-700' };
    }
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap items-end gap-6 w-full relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.statusMatch;
        const { text, border } = getColorClass(tab.statusMatch, isActive);
        const icon = getImage(tab, isActive);

        return (
          <div
            key={tab.name}
            onClick={() => setActiveTab(tab.statusMatch)}
            className={`flex items-center gap-2 pb-1 cursor-pointer transition-all duration-200 ${text} ${border}`}
          >
            <img
              src={icon}
              alt={`${tab.name} icon`}
              className="h-5 w-5 object-contain transition-transform duration-200"
            />
            <span className="font-medium text-base sm:text-lg">{tab.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TicketStatusNav;
