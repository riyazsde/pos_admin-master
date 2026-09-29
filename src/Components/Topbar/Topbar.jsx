import React, { useState } from 'react';
import {
  Search, Menu, Bell, ChevronDown, User, X, AlertTriangle, CreditCard,
  ShieldAlert, CheckCircle, Wifi, UserPlus, DollarSign, Settings,
  LogOut, HelpCircle, Mail, Phone, MapPin, Edit3, Camera, Lock,
  Briefcase, Calendar, Globe
} from 'lucide-react';
import porfileImg from '../../assets/Images/admin/Avatar.png';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('French');
  const navigate = useNavigate();

  const languages = ['French', 'English'];

  // Mock user data
  const user = {
    name: 'Jack Anderson',
    email: 'jack.anderson@triaxx.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    location: 'New York, USA',
    joined: 'Jan 15, 2024',
    avatar: porfileImg,
  };

  // Mock notification data
  const notifications = [
    { id: 1, type: 'subscription', title: 'Subscription Renewal Due Soon', desc: 'Downtown Bistro - 6 Months Plan renewing on June 30, 2026', tag: 'MEDIUM', time: '4 minutes ago', icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
    { id: 2, type: 'device', title: 'Device Offline Alert', desc: 'POS Terminal at Harbor Grill has been offline for 24 hours', tag: 'HIGH', time: '10 minutes ago', icon: Wifi, color: 'bg-red-100 text-red-600' },
    { id: 3, type: 'stock', title: 'Critical Stock Alert', desc: 'Fresh Salmon stock critically low at Downtown Bistro (3 kg remaining)', tag: 'CRITICAL', time: '45 minutes ago', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    { id: 4, type: 'login', title: 'Failed Login Attempt', desc: 'Multiple failed login attempts detected from IP 45.123.67.89', tag: 'HIGH', time: '1 hours ago', icon: ShieldAlert, color: 'bg-orange-100 text-orange-600' },
    { id: 5, type: 'request', title: 'New Location Request', desc: 'Seaside Cafe has requested to join the platform', tag: 'MEDIUM', time: '1 hours ago', icon: UserPlus, color: 'bg-green-100 text-green-600' },
    { id: 6, type: 'sales', title: 'Daily Sales Summary', desc: 'Total sales for April 26, 2026: $12,450 across all locations', tag: 'LOW', time: '8 hours ago', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { id: 7, type: 'warning', title: 'Low Stock Warning', desc: 'Chicken Breast stock low at Harbor Grill (8 kg remaining)', tag: 'MEDIUM', time: '12 hours ago', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const getTagStyle = (tag) => {
    switch (tag) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    // Clear any auth tokens here
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          {/* Left Section - Menu and Search */}
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
                  placeholder="Search"
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
            {/* Language Selector */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-red-50 rounded-xl px-4 py-2 hover:shadow-sm transition-all"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <span className="text-sm font-medium text-gray-700">{selectedLanguage}</span>
                <div className="w-6 h-4 bg-gradient-to-r from-blue-600 via-white to-red-600 rounded-sm flex overflow-hidden">
                  <div className="w-2 bg-blue-600"></div>
                  <div className="w-2 bg-white"></div>
                  <div className="w-2 bg-red-600"></div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
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
                  3
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
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Jack</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <>
                  {/* Click outside overlay */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {/* Profile Header */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-red-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">{user.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
                        <span className="font-medium">My Profile</span>
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
                        <span className="font-medium">Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/help');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Help & Support</span>
                      </button>
                    </div>

                    {/* Sign Out */}
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Slide-Over Panel */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsNotificationOpen(false)}
          ></div>

          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">All Notifications</h2>
              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <input
                    type="text"
                    placeholder="Search notifications..."
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map((notif) => {
                const IconComponent = notif.icon;
                return (
                  <div
                    key={notif.id}
                    className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${notif.color}`}>
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
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTagStyle(notif.tag)}`}>
                          {notif.tag}
                        </span>
                        <button className="text-xs font-medium text-purple-600 hover:text-purple-800 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsProfileModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Cover / Header */}
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

            {/* Avatar */}
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-12 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              {/* User Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{user.role}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Email</p>
                    <p className="text-sm text-gray-700 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Phone</p>
                    <p className="text-sm text-gray-700 truncate">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Location</p>
                    <p className="text-sm text-gray-700 truncate">{user.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Joined</p>
                    <p className="text-sm text-gray-700 truncate">{user.joined}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    navigate('/settings');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-red-500 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Topbar;