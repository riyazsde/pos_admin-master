// src/hoc/withAdminLayout.js
import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Topbar from '../../Components/Topbar/Topbar';

const withAdminLayout = (WrappedComponent) => {
  return function AdminLayoutWrapper(props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
    };

    return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-[250px] shrink-0">
          <Sidebar />
        </div>

        {/* Sidebar - Mobile Slide-in */}
        <div
          className={`fixed inset-0 z-50 flex md:hidden transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0  bg-opacity-30"
            onClick={toggleSidebar}
          ></div>

          {/* Sidebar */}
          <div className="relative w-[250px] bg-white h-full shadow-lg z-50">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <Topbar onMenuClick={toggleSidebar} />

          {/* Page Content */}
          <div className="p-4 overflow-auto flex-1">
            <WrappedComponent {...props} />
          </div>
        </div>
      </div>
    );
  };
};

export default withAdminLayout;
