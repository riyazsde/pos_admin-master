// src/Components/Sidebar/Sidebar.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logo from '../../assets/Images/Home/logo.png';
import profileAvatar from '../../assets/Images/admin/SidebarIcon/profileAvatar.png';
import SignOutModal from './SignOutModal';
import image1 from '../../assets/Images/admin/SidebarIcon/1.png';
import image2 from '../../assets/Images/admin/SidebarIcon/2.png';
import image3 from '../../assets/Images/admin/SidebarIcon/3.png';
import image4 from '../../assets/Images/admin/SidebarIcon/4.png';
import image5 from '../../assets/Images/admin/SidebarIcon/5.png';
import image6 from '../../assets/Images/admin/SidebarIcon/6.png';
import image7 from '../../assets/Images/admin/SidebarIcon/7.png';
import image8 from '../../assets/Images/admin/SidebarIcon/8.png';
import image9 from '../../assets/Images/admin/SidebarIcon/9.png';

import { authService } from '../../Services/apiService';

// ✅ Parent route → child routes that should keep the parent highlighted
const CHILDREN_MAP = {
  '/Dashboard': [],
  '/clients': ['/client-details', '/create-clients', '/renew-management'],
  '/subscription-list': ['/create-subscription', '/subscription-plans'],
  '/report': [],
  '/ham': [],
  '/mom': [],
  '/audit-log': [],
  '/supports': ['/ticket-details'],
  '/pos-device': ['/pos-device-history'],
  '/settings': [
    '/sub-admin',
    '/change-password',
    '/account-management',
    '/device',
    '/language',
    '/date-time',
    '/currency',
    '/billing-history',
  ],
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignOutOpen, setSignOutOpen] = useState(false);

  // ✅ i18n hook — re-renders on language change
  const { t } = useTranslation();

  // ✅ Labels use t('nav.*') — these update instantly when language changes
  const menuItems = [
    { icon: image1, label: t('nav.dashboard'), route: '/Dashboard' },
    { icon: image2, label: t('nav.clients'), route: '/clients' },
    { icon: image3, label: t('nav.subscriptions'), route: '/subscription-list' },
    { icon: image4, label: t('nav.reports'), route: '/report' },
    { icon: image4, label: t('nav.ham'), route: '/ham' },
    { icon: image4, label: t('nav.momDevice'), route: '/mom' },
    { icon: image5, label: t('nav.auditLog'), route: '/audit-log' },
    { icon: image6, label: t('nav.supports'), route: '/supports' },
    { icon: image7, label: t('nav.posDevice'), route: '/pos-device' },
    { icon: image8, label: t('nav.settings'), route: '/settings' },
    { icon: image9, label: t('nav.signOut'), route: '/logout' },
  ];

  // ✅ Highlight logic — matches parent route AND any known child routes
  const checkIsSelected = (route) => {
    if (route === '/logout') return false;

    // Exact match
    if (location.pathname === route) return true;

    // Child route match
    const children = CHILDREN_MAP[route] || [];
    return children.some(
      (child) =>
        location.pathname === child ||
        location.pathname.startsWith(child + '/')
    );
  };

  const handleItemClick = (route) => {
    if (route === '/logout') {
      setSignOutOpen(true);
    } else {
      navigate(route);
    }
  };

  const handleConfirmSignOut = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSignOutOpen(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <div className="fixed left-0 top-0 w-[250px] sm:w-[280px] md:w-[250px] h-screen bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] flex flex-col z-40 overflow-hidden">
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <div className="flex items-center justify-center gap-[8.83px] mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-12 md:mb-16 flex-shrink-0">
            <img
              src={logo}
              className="w-[100px] sm:w-[120px] h-[16px] sm:h-[20px]"
              alt="Logo"
            />
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 md:gap-[19px] px-3 sm:px-4 md:px-[20.5px] pb-6 flex-1">
            {menuItems.map(({ icon, label, route }, idx) => {
              const isSelected = checkIsSelected(route);
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

      <SignOutModal
        isOpen={isSignOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}