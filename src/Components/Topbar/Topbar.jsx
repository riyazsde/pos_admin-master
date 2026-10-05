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
  const currentName = useAppSelector(
    (state) => state.language?.currentName || 'English'
  );

  // ✅ Handle language selection
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
          {/* ==================== Left Section ==================== */}
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

          {/* ==================== Right Section ==================== */}
          <div className="flex items-center space-x-4">
            {/* ---------- Language Selector ---------- */}
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

            {/* ---------- Notifications Bell ---------- */}
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

            {/* ---------- Profile Dropdown ---------- */}
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
                    {/* Profile Header */}
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

                    {/* Menu Items */}
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

      {/* ==================== Notification Slide-Over ==================== */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsNotificationOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                {t('common.notifications') || 'All Notifications'}
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <input
                    type="text"
                    placeholder={
                      t('notifications.searchPlaceholder') ||
                      'Search notifications...'
                    }
                    className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 w-48"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                  <Bell className="w-8 h-8 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const IconComponent = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${notif.color}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                            {notif.title}
                          </h3>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap mt-0.5">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                          {notif.desc}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTagStyle(
                              notif.tag
                            )}`}
                          >
                            {notif.tag}
                          </span>
                          <button className="text-xs font-medium text-purple-600 hover:text-purple-800 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== Profile Modal ==================== */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsProfileModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Cover */}
            <div className="relative h-32 bg-gradient-to-r from-purple-500 via-purple-400 to-red-400">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button className="absolute top-3 right-14 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-12 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {user.role}
                  {user.responsibility && ` • ${user.responsibility}`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                      Email
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                      Phone
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {user.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                      Location
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {user.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                      Joined
                    </p>
                    <p className="text-sm text-gray-700 truncate">
                      {user.joined}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {t('common.close') || 'Close'}
                </button>
                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    navigate('/change-password');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-red-500 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {t('common.changePassword') || 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;