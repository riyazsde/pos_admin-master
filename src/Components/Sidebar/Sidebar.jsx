// src/Components/Sidebar/Sidebar.jsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Activity, MonitorSmartphone } from 'lucide-react';

import logo from '../../assets/LOGOPlande.svg';
import SignOutModal from './SignOutModal';
import image1 from '../../assets/Images/admin/SidebarIcon/1.png';
import image2 from '../../assets/Images/admin/SidebarIcon/2.png';
import image3 from '../../assets/Images/admin/SidebarIcon/3.png';
import image5 from '../../assets/Images/admin/SidebarIcon/5.png';
import image6 from '../../assets/Images/admin/SidebarIcon/6.png';
import image7 from '../../assets/Images/admin/SidebarIcon/7.png';
import image8 from '../../assets/Images/admin/SidebarIcon/8.png';
import image9 from '../../assets/Images/admin/SidebarIcon/9.png';

import { authService } from '../../Services/apiService';

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

const itemBaseClasses =
  'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 min-h-[46px] w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6A1B9A] focus-visible:ring-offset-2';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignOutOpen, setSignOutOpen] = useState(false);
  const { t } = useTranslation();

  const dashboardItem = {
    icon: image1,
    label: t('nav.dashboard'),
    route: '/Dashboard',
  };

  const navItems = [
    { icon: image2, label: t('nav.clients'), route: '/clients' },
    { icon: image3, label: t('nav.subscriptions'), route: '/subscription-list' },
    { icon: BarChart3, label: t('nav.reports'), route: '/report', isLucide: true },
    { icon: Activity, label: t('nav.ham'), route: '/ham', isLucide: true },
    { icon: MonitorSmartphone, label: t('nav.momDevice'), route: '/mom', isLucide: true },
    { icon: image5, label: t('nav.auditLog'), route: '/audit-log' },
    { icon: image6, label: t('nav.supports'), route: '/supports' },
    { icon: image7, label: t('nav.posDevice'), route: '/pos-device' },
    { icon: image8, label: t('nav.settings'), route: '/settings' },
  ];

  const signOutItem = { icon: image9, label: t('nav.signOut') };

  const checkIsSelected = (route) => {
    if (location.pathname === route) return true;
    const children = CHILDREN_MAP[route] || [];
    return children.some(
      (child) =>
        location.pathname === child ||
        location.pathname.startsWith(child + '/')
    );
  };

  const handleConfirmSignOut = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSignOutOpen(false);
      navigate('/');
    }
  };

  const renderItem = ({ icon, label, route, isLucide }, isSelected) => {
    // Render Lucide icon component OR image
    const IconEl = isLucide ? (
      React.createElement(icon, {
        'aria-hidden': 'true',
        className: `w-5 h-5 flex-shrink-0 transition-all duration-200 ${
          isSelected ? 'text-white' : 'text-gray-500'
        }`,
        strokeWidth: 2,
      })
    ) : (
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className={`w-5 h-5 object-contain transition-all duration-200 flex-shrink-0 ${
          isSelected ? 'filter brightness-0 invert' : 'opacity-70'
        }`}
      />
    );

    return (
      <Link
        to={route}
        aria-current={isSelected ? 'page' : undefined}
        className={`${itemBaseClasses} ${
          isSelected
            ? 'bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] shadow-[0_4px_12px_rgba(106,27,154,0.25)]'
            : 'bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900'
        }`}
      >
        {IconEl}
        <span
          className={`font-semibold text-[15px] leading-tight transition-colors duration-200 truncate ${
            isSelected ? 'text-white' : ''
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed left-0 top-0 w-[250px] sm:w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col z-40 overflow-hidden"
      >
        {/* ───── Logo — aligned perfectly with Topbar padding ───── */}
        <div className="flex items-center px-6 h-[72px] flex-shrink-0 border-b border-transparent">
          <img
            src={logo}
            className="w-[140px] h-auto object-contain"
            alt="Triaxx POS"
          />
        </div>

        {/* ───── Dashboard — pinned to top ───── */}
        <div className="px-4 pt-2 pb-1 flex-shrink-0">
          {renderItem(dashboardItem, checkIsSelected(dashboardItem.route))}
        </div>

        {/* ───── Middle scrollable ───── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent px-4 py-2">
          <ul className="flex flex-col gap-1 list-none m-0">
            {navItems.map((item) => (
              <li key={item.route}>
                {renderItem(item, checkIsSelected(item.route))}
              </li>
            ))}
          </ul>
        </div>

        {/* ───── Sign Out — pinned bottom ───── */}
        <div className="px-4 pb-6 pt-4 flex-shrink-0 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className={`${itemBaseClasses} bg-transparent hover:bg-red-50 group`}
          >
            <img
              src={signOutItem.icon}
              alt=""
              aria-hidden="true"
              className="w-5 h-5 object-contain flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-semibold text-[15px] leading-tight truncate text-gray-700 group-hover:text-red-600 transition-colors">
              {signOutItem.label}
            </span>
          </button>
        </div>
      </nav>

      <SignOutModal
        isOpen={isSignOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}