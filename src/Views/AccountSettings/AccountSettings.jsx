import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Settings,
  Briefcase,
  Users,
  FileText,
  LifeBuoy,
  CreditCard,
  Pencil,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import withAdminLayout from '../AdminPanel/withAdminLayout';

import AccountSection from '../../Components/Settings/AccountSection';
import BusinessSection from '../../Components/Settings/BusinessSection';
import AdminSection from '../../Components/Settings/AdminSection';
import LogsSection from '../../Components/Settings/LogsSection';
import PaymentSection from '../../Components/Settings/PaymentSection';

const sidebarItems = [
  { id: 'account', icon: Settings, label: 'Account Settings' },
  { id: 'business', icon: Briefcase, label: 'Business Settings' },
  { id: 'admins', icon: Users, label: 'Sub Admins', route: '/sub-admin' },
  { id: 'logs', icon: FileText, label: 'Audit Logs' },
  { id: 'support', icon: LifeBuoy, label: 'Support Tickets', route: '/supports' },
  { id: 'payments', icon: CreditCard, label: 'Payments' },
];

const SidebarItem = ({ item, isActive, onClick }) => (
  <li
    className={`flex items-center py-3 px-4 cursor-pointer rounded-lg transition-colors ${
      isActive ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
    }`}
    style={
      isActive
        ? {
            background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
          }
        : {}
    }
    onClick={() => onClick(item.id)}
  >
    <item.icon className="w-5 h-5 mr-3" />
    <span className="font-medium">{item.label}</span>
  </li>
);

const SettingsRow = ({ label, hasChevron = false }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
    <p className="text-gray-800 font-medium">{label}</p>
    <button className="focus:outline-none">
      {hasChevron ? (
        <ChevronRight className="w-5 h-5 text-gray-600" />
      ) : (
        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <Pencil className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </button>
  </div>
);

/**
 * ✅ Reusable Back Button
 * - If `onBack` is provided, uses that handler.
 * - Otherwise falls back to browser history (navigate(-1)).
 */
const BackButton = ({ onBack, label = 'Back' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 font-medium transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </div>
      <span>{label}</span>
    </button>
  );
};

const AccountSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('account');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = sidebarItems.find(item => item.route === currentPath);
    if (currentItem?.id === 'support') {
      setActiveSection(currentItem.id);
    }
  }, [location.pathname]);

  const handleSidebarClick = (sectionId) => {
    const selectedItem = sidebarItems.find(item => item.id === sectionId);
    if (selectedItem) {
      setActiveSection(sectionId);
      if (selectedItem.route) {
        navigate(selectedItem.route);
      }
      setSidebarOpen(false);
    }
  };

  /**
   * ✅ Back button handler used inside each section.
   * For sections with a dedicated route (sub-admin, supports) it navigates back.
   * For in-page sections, it returns to the default "account" section.
   */
  const handleSectionBack = (sectionId) => {
    const item = sidebarItems.find((i) => i.id === sectionId);

    // If the section has its own route → use browser back / fallback
    if (item?.route) {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        setActiveSection('account');
      }
      return;
    }

    // In-page section → return to Account section
    setActiveSection('account');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="max-w-xl">
            <BackButton />
            <AccountSection />
          </div>
        );

      case 'business':
        return (
          <div>
            <BackButton onBack={() => handleSectionBack('business')} />
            <BusinessSection />
          </div>
        );

      case 'admins':
        return (
          <div>
            <BackButton onBack={() => handleSectionBack('admins')} />
            <AdminSection />
          </div>
        );

      case 'logs':
        return (
          <div>
            <BackButton onBack={() => handleSectionBack('logs')} />
            <LogsSection />
          </div>
        );

      case 'payments':
        return (
          <div>
            <BackButton onBack={() => handleSectionBack('payments')} />
            <PaymentSection />
          </div>
        );

      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="font-sans min-h-screen">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex pt-14 md:pt-0 pb-14 md:pb-0">
        {/* Sidebar */}
        <aside
          className={`w-72 bg-white shadow-md p-4 fixed md:static z-50 
          h-[calc(100vh-56px)] top-14 md:top-0 md:h-full left-0 transform 
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
        >
          <nav>
            <ul className="space-y-2">
              {sidebarItems.map(item => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isActive={item.id === activeSection}
                  onClick={handleSidebarClick}
                />
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-10">{renderContent()}</main>
      </div>

      {/* Bottom Menu for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow z-40 border-t border-gray-200">
        <div className="flex justify-around items-center h-14">
          <button
            onClick={() => {
              setActiveSection('account');
              setSidebarOpen(false);
            }}
            className={`flex flex-col items-center text-sm ${
              activeSection === 'account' ? 'text-purple-600' : 'text-gray-500'
            }`}
          >
            <Settings className="w-5 h-5 mb-1" />
            Settings
          </button>

          <button
            onClick={() => {
              setSidebarOpen(true);
            }}
            className="flex flex-col items-center text-sm text-gray-500"
          >
            <Menu className="w-5 h-5 mb-1" />
            Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(AccountSettings);