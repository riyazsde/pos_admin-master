// src/Components/Topbar/Topbar.jsx

import React, { useState } from 'react';
import {
  Search,
  Menu,
  Bell,
  ChevronDown,
  User,
  X,
  AlertTriangle,
  CreditCard,
  Wifi,
  CheckCircle,
  Settings,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  Lock,
  Calendar,
  Globe,
} from 'lucide-react';
import porfileImg from '../../assets/Images/admin/Avatar.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import { authService } from '../../Services/apiService';
import {
  getFullName,
  getRoleName,
  getResponsibility,
  getLocation,
  getAvatar,
  formatDate,
} from '../../utils/userHelpers';

import {
  setLanguageCode,
  getCodeForLanguage,
} from '../../Store/Features/language/languageSlice';

const Topbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // ---------- Redux state ----------
  const reduxUser = useAppSelector((state) => state.auth?.user);
  const languages = useAppSelector((state) => state.language?.languages || []);
  const currentCode = useAppSelector(
    (state) => state.language?.currentCode || 'en'
  );
  const currentName = useAppSelector(
    (state) => state.language?.currentName || 'English'
  );

  // ✅ Handle language selection — dispatch only, no override effect
  const handleLanguageChange = (lang) => {
    const code = getCodeForLanguage(lang.Language_name);
    dispatch(
      setLanguageCode({
        code,
        name: lang.Language_name,
      })
    );
    setIsLanguageOpen(false);
  };

  // ---------- Build user object ----------
  const user = {
    name: getFullName(reduxUser),
    email: reduxUser?.email || 'N/A',
    phone: reduxUser?.phone || 'N/A',
    role: getRoleName(reduxUser),
    responsibility: getResponsibility(reduxUser),
    location: getLocation(reduxUser),
    joined: formatDate(reduxUser?.OnboardingDate),
    avatar: getAvatar(reduxUser, porfileImg),
  };

  // ---------- Mock notifications ----------
  const notifications = [
    {
      id: 1,
      title: 'Subscription Renewal Due Soon',
      desc: 'Downtown Bistro - 6 Months Plan renewing on June 30, 2026',
      tag: 'MEDIUM',
      time: '4 minutes ago',
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      title: 'Device Offline Alert',
      desc: 'POS Terminal at Harbor Grill has been offline for 24 hours',
      tag: 'HIGH',
      time: '10 minutes ago',
      icon: Wifi,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 3,
      title: 'Critical Stock Alert',
      desc: 'Fresh Salmon stock critically low at Downtown Bistro',
      tag: 'CRITICAL',
      time: '45 minutes ago',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
    },
  ];

  const getTagStyle = (tag) => {
    switch (tag) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    try {
      await authService.logout();
    } finally {
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <div className="relative hidden md:block">
              <div className="flex items-center bg-gradient-to-r from-purple-50 to-red-50 rounded-full px-4 py-2 min-w-[300px]">
                <Menu className="w-5 h-5 text-gray-700 mr-3" />
                <input
                  type="text"
                  placeholder={t('common.search') || 'Search'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 text-gray-700 placeholder-gray-500"
                />
                <button className="ml-3 p-1 hover:bg-white rounded-full transition-colors">
                  <Search className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* ✅ Language Selector */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-red-50 rounded-xl px-4 py-2 hover:shadow-sm transition-all"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isLanguageOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isLanguageOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLanguageOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {languages.filter((l) => l.Status).length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-400">
                        {t('common.loading') || 'Loading…'}
                      </div>
                    ) : (
                      languages
                        .filter((l) => l.Status)
                        .map((lang) => {
                          const isActive =
                            (currentName || '').toLowerCase() ===
                            (lang.Language_name || '').toLowerCase();

                          return (
                            <button
                              key={lang.Language_id ?? lang.Language_name}
                              type="button"
                              onClick={() => handleLanguageChange(lang)}
                              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? 'bg-purple-50 text-purple-700 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span>{lang.Language_name}</span>
                              {isActive && (
                                <CheckCircle className="w-4 h-4 text-purple-600" />
                              )}
                            </button>
                          );
                        })
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications.length}
                </span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-red-50 rounded-full px-4 py-2 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {reduxUser?.Name || 'User'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />

                  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-red-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                            <img
                              src={user.avatar}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {user.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium">
                          {t('common.myProfile') || 'My Profile'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Settings className="w-4 h-4" />
                        </div>
                        <span className="font-medium">
                          {t('common.settings') || 'Settings'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/supports');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <span className="font-medium">
                          {t('common.helpSupport') || 'Help & Support'}
                        </span>
                      </button>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                          <Lock className="w-4 h-4" />
                        </div>
                        <span className="font-medium">
                          {t('common.signOut') || 'Sign Out'}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;