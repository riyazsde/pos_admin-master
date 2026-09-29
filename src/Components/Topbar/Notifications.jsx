import React from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import profileImg from '../../assets/Images/admin/Avatar.png';

const notificationsData = {
  Today: [
    {
      id: 1,
      name: 'Brian Griffin',
      action: 'wants to collaborate',
      time: '5 minutes ago',
      avatar: profileImg,
    },
  ],
  Yesterday: [
    {
      id: 2,
      name: 'Brian Griffin',
      action: 'sent you a message',
      time: 'Yesterday at 2:00 PM',
      avatar: profileImg,
    },
    {
      id: 3,
      name: 'You',
      action: 'were mentioned in a comment',
      time: 'Yesterday at 4:30 PM',
      avatar: profileImg,
    },
  ],
  'This Week': [
    {
      id: 4,
      name: 'Brian Griffin',
      action: 'wants to collaborate',
      time: '5 days ago',
      avatar: profileImg,
    },
    {
      id: 5,
      name: 'Brian Griffin',
      action: 'wants to collaborate',
      time: '5 days ago',
      avatar: profileImg,
    },
  ],
  'This Month': [
    {
      id: 6,
      name: 'Brian Griffin',
      action: 'wants to collaborate',
      time: '5 days ago',
      avatar: profileImg,
    },
    {
      id: 7,
      name: 'Brian Griffin',
      action: 'wants to collaborate',
      time: '5 days ago',
      avatar: profileImg,
    },
    {
      id: 8,
      name: 'Brian Griffin',
      action: 'wants to collaborate',
      time: '5 days ago',
      avatar: profileImg,
    },
  ],
};

const Notifications = () => {
  return (
    <div className="w-full mx-auto p-4 space-y-6 h-screen overflow-y-auto">
      {Object.entries(notificationsData).map(([section, items]) => (
        <div key={section}>
          <h2 className="text-[21px] font-bold text-black/60">{section}</h2>
          <div className="flex flex-col gap-3 mt-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 bg-white shadow-md p-4 rounded-lg"
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-[16px] text-[#333]">
                    <span className="font-semibold">{item.name}</span> {item.action}
                  </p>
                  <p className="text-sm text-[#666C7E]">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default withAdminLayout(Notifications);
