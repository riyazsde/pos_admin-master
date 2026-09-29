import React from 'react';
import { useNavigate } from 'react-router-dom';

const rows = Array.from({ length: 8 }).map((_, i) => ({
  action: 'Update',
  environment: 'Subscriptions',
  timestamp: 'April 29, 2025\n20:00',
  ip: '#12345648745'
}));

export default function ActivityTable() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-start px-2 sm:px-4 py-4">
      <h2 className="text-2xl sm:text-4xl font-bold text-black mb-6 sm:mb-10">Audit Logs</h2>

      {/* Scrollable table container for small screens */}
      <div className="w-full overflow-x-auto">
        {/* Header */}
        <div className="min-w-[640px] w-full h-[70px] sm:h-[86px] bg-gradient-to-b from-purple-100 to-red-100 border-x border-b border-gray-400 shadow-inner shadow-md rounded-t-xl flex items-center px-4 sm:px-6">
          {['Action', 'Environment', 'Time Stamp', 'IP Address', 'View more'].map((heading, index) => (
            <div key={index} className="flex-1 text-center">
              <span className="font-poppins font-semibold text-sm sm:text-lg text-black/60">{heading}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="min-w-[640px] w-full h-[70px] sm:h-[85px] bg-white border-x border-b border-gray-400 shadow-inner shadow-md flex items-center px-4 sm:px-6"
          >
            <div className="flex-1 text-center font-poppins font-semibold text-sm sm:text-lg text-black">
              {row.action}
            </div>
            <div className="flex-1 text-center font-poppins font-semibold text-sm sm:text-lg text-black">
              {row.environment}
            </div>
            <div className="flex-1 text-center font-poppins font-semibold text-sm sm:text-lg text-black">
              <div>{row.timestamp.split('\n')[0]}</div>
              <div>{row.timestamp.split('\n')[1]}</div>
            </div>
            <div className="flex-1 text-center font-poppins font-semibold text-sm sm:text-lg text-black">
              {row.ip}
            </div>
            <div className="flex-1 text-center">
              <button
                onClick={() => navigate('/audit-log')}
                className="font-poppins font-semibold text-sm sm:text-lg bg-gradient-to-b from-purple-600 to-red-600 bg-clip-text text-transparent"
              >
                View more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
