import React from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';
import mac from '../../assets/Images/Home/mac.png';

// ✅ Device data with mac image passed in
const deviceData = [
  {
    image: mac,
    current: {
      deviceType: 'Windows',
      browser: 'Chrome Browser',
      location: 'Chennai, Tamil Nadu',
    },
    previous: {
      deviceType: 'Windows',
      location: 'Chennai, Tamil Nadu',
      timeAgo: '5 hours ago',
      browser: 'Microsoft Edge',
      browserIcon: 'https://img.icons8.com/color/48/microsoft-edge-2019.png',
    },
  },
  {
    image: mac,
    current: {
      deviceType: 'Windows',
      browser: 'Chrome Browser',
      location: 'Chennai, Tamil Nadu',
    },
    previous: {
      deviceType: 'Windows',
      location: 'Chennai, Tamil Nadu',
      timeAgo: '5 hours ago',
      browser: 'Microsoft Edge',
      browserIcon: 'https://img.icons8.com/color/48/microsoft-edge-2019.png',
    },
  },
];

// ✅ Green check icon
const GreenCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
    <circle cx="12" cy="12" r="12" fill="#34C759" />
    <path d="M17.3 8.3L10.4 15.2L7.7 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ✅ Enhanced responsive session row
const DeviceSession = ({ session, isCurrent }) => (
  <div className="flex flex-col gap-3 sm:gap-4">
    <div className="flex flex-col gap-1">
      <h3 className="text-lg sm:text-xl font-bold font-poppins break-words">{session.deviceType}</h3>
      {isCurrent && <p className="text-sm sm:text-base text-black font-poppins break-words">{session.browser}</p>}
      <p className="text-sm sm:text-base text-gray-600 font-poppins break-words">{session.location}</p>
      {!isCurrent && <p className="text-sm sm:text-base text-gray-600 font-poppins">{session.timeAgo}</p>}
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      {isCurrent ? (
        <>
          <GreenCheckIcon />
          <span className="text-sm sm:text-base text-gray-600 font-poppins">Your current system</span>
        </>
      ) : (
        <>
          {session.browserIcon && (
            <img src={session.browserIcon} alt="" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          )}
          <span className="text-sm sm:text-base text-gray-600 font-poppins break-words">{session.browser}</span>
        </>
      )}
    </div>
  </div>
);

// ✅ Enhanced responsive card layout
const DeviceCard = ({ device }) => {
  const { image, current, previous } = device;
  return (
    <div className="w-full flex flex-col lg:flex-row items-center p-4 sm:p-6 border-2 border-black rounded-2xl gap-6 sm:gap-8">
      {/* Image section - responsive sizing */}
      <div className="w-full lg:w-auto flex-shrink-0 flex justify-center">
        <img 
          src={image} 
          alt="Device" 
          className="w-32 h-auto sm:w-40 md:w-48 object-cover rounded-lg max-w-full" 
        />
      </div>
      
      {/* Content section - full width on mobile */}
      <div className="w-full flex flex-col gap-3 sm:gap-4 min-w-0">
        <DeviceSession session={current} isCurrent />
        <hr className="border-t border-black my-1 sm:my-2" />
        <DeviceSession session={previous} />
      </div>
    </div>
  );
};

// ✅ Enhanced responsive main component
function DeviceActivity() {
  return (
    <div className="bg-white min-h-screen p-3 sm:p-4 lg:p-8">
      {/* Responsive heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-gray-800 mb-6 sm:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="text-gray-400 flex items-center gap-2 text-lg sm:text-2xl lg:text-[32px]">
            Manage Account
            <img src={arrow} alt="Arrow" className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <span className="text-gray-800">Devices</span>
        </div>
      </h1>
      
      {/* Responsive container */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-0">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10">
          {deviceData.map((device, index) => (
            <DeviceCard key={index} device={device} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAdminLayout(DeviceActivity);