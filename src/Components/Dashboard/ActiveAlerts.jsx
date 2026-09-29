import React from 'react';

const WarningIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-gray-600"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

function ActiveAlerts() {
  return (
    // Added h-full and flex flex-col to match the table's parent structure
    <div className="w-full h-full  flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-4 shrink-0">Active Alerts</h2>
      
      {/* flex-grow ensures this card stretches equally with the table card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-6 flex-grow">
        
        {/* Alert Item 1 */}
        <div className="rounded border border-gray-100 p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-800 font-medium">
              <WarningIcon />
              <span>Device Offline</span>
            </div>
            <span className="bg-[#FFEBEB] text-[#E53935] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
              12 active
            </span>
          </div>
          <ul className="text-xs text-gray-500 space-y-1.5 pl-7">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              Restaurant #42 - Main POS
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              Restaurant #78 - Kitchen Display
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              Restaurant #91 - Kiosk 2
            </li>
          </ul>
        </div>

        {/* Alert Item 2 */}
        <div className="rounded border border-gray-100 p-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-800 font-medium">
              <WarningIcon />
              <span>Low Stock</span>
            </div>
            <span className="bg-[#FFF8E1] text-[#F57F17] text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
              8 active
            </span>
          </div>
          <ul className="text-xs text-gray-500 space-y-1.5 pl-7">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              Restaurant #15 - Receipt Paper
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              Restaurant #33 - Coffee Beans
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              Restaurant #54 - Napkins
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default ActiveAlerts;