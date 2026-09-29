import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/Images/Home/logo.png';
import profileAvatar from '../../assets/Images/admin/SidebarIcon/profileAvatar.png';
import SignOutModal from './SignOutModal'; // Adjust path as needed
import image1 from '../../assets/Images/admin/SidebarIcon/1.png';
import image2 from '../../assets/Images/admin/SidebarIcon/2.png';
import image3 from '../../assets/Images/admin/SidebarIcon/3.png';
import image4 from '../../assets/Images/admin/SidebarIcon/4.png';
import image5 from '../../assets/Images/admin/SidebarIcon/5.png';
import image6 from '../../assets/Images/admin/SidebarIcon/6.png';
import image7 from '../../assets/Images/admin/SidebarIcon/7.png';
import image8 from '../../assets/Images/admin/SidebarIcon/8.png';
import image9 from '../../assets/Images/admin/SidebarIcon/9.png';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignOutOpen, setSignOutOpen] = useState(false);

  const menuItems = [
    { icon: image1, label: 'Dashboard', route: '/dashboard' },
    { icon: image2, label: 'Clients', route: '/clients' },
    { icon: image3, label: 'Subscriptions', route: '/subscription-list' },
    { icon: image4, label: 'Reports', route: '/report' },
    { icon: image5, label: 'Audit Log', route: '/audit-log' },
    { icon: image6, label: 'Supports', route: '/supports' },
    { icon: image7, label: 'POS Device', route: '/pos-device' },
    { icon: image8, label: 'Settings', route: '/settings' },
    { icon: image9, label: 'Sign out', route: '/logout' },
  ];

  const handleItemClick = (route) => {
    if (route === '/logout') {
      setSignOutOpen(true);
    } else {
      navigate(route);
    }
  };

  const handleConfirmSignOut = () => {
    setSignOutOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className="fixed left-0 top-0 w-[250px] sm:w-[280px] md:w-[250px] h-screen bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] flex flex-col z-40 overflow-hidden">
        
        {/* Scrollable Content Container */}
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          
          {/* Logo */}
          <div className="flex items-center justify-center gap-[8.83px] mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-12 md:mb-16 flex-shrink-0">
            <img src={logo} className='w-[100px] sm:w-[120px] h-[16px] sm:h-[20px]' alt="Logo" />
          </div>

          {/* Profile */}
          <div className="flex justify-center mb-8 sm:mb-12 md:mb-16 px-4 flex-shrink-0">
            <div className="flex items-center gap-[12px] sm:gap-[15.24px] px-3 sm:px-4 py-[6px] sm:py-[7.62px] bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-[32px] w-full max-w-[148.57px] h-[50px] sm:h-[57.24px]">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-black font-medium text-sm sm:text-base leading-5 sm:leading-6 font-['Manrope'] truncate">Jimmy</p>
                <p className="text-black font-light text-xs leading-[16px] sm:leading-[18px] font-['Manrope']">Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-[19px] px-3 sm:px-4 md:px-[20.5px] pb-6 flex-1">
            {menuItems.map(({ icon, label, route }, idx) => {
              const isSelected = location.pathname === route;

              return (
                <div
                  key={idx}
                  onClick={() => handleItemClick(route)}
                  className={`cursor-pointer flex items-center gap-[8px] sm:gap-[10px] px-4 sm:px-[22px] py-2 sm:py-3 rounded-[20px] sm:rounded-[24px] transition-all duration-300 min-h-[44px] sm:min-h-[48px] ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] shadow-lg scale-[1.02] sm:scale-105'
                      : 'bg-transparent hover:bg-white/10'
                  }`}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-300 flex-shrink-0 ${
                      isSelected ? 'filter brightness-0 invert' : ''
                    }`}
                  />
                  <span
                    className={`font-bold text-base sm:text-lg leading-[120%] transition-colors duration-300 truncate ${
                      isSelected ? 'text-white' : 'text-black'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={isSignOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}