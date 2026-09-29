import React, { useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { ChevronDown } from 'lucide-react';

const rows = Array.from({ length: 12 }).map((_, i) => ({
  userName: 'Fahim',
  role: 'Developer',
  client: 'Chinese Ramen Bowl',
  action: i === 0 ? 'Update' : 'File Delete',
  environment: i === 0 ? 'Floor Plan' : 'Reservations',
  ip: '#12345648745',
  date: 'April 29, 2025',
  time: '20:00',
}));

const AuditLogTable = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const periods = ['Today', 'This Week', 'This Month', 'This Year'];

  return (
    <div className="w-full overflow-y-auto poppins-text px-4 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Audits</h1>

        {/* Period Dropdown */}
        <div className="relative w-fit">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between gap-2 w-[129px] h-[35px] px-4 py-2 bg-white border border-black rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700 text-sm font-medium">{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[246px] bg-white shadow-md rounded-lg flex flex-col px-3 py-5 z-30">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left h-8 px-2 py-1 border-b border-black/20 font-[500] text-[16px] leading-[24px] font-[Manrope]
                    ${selectedPeriod === period
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                      : 'text-black hover:bg-gray-100'}
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[768px]">
          {/* Table Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-purple-200 to-red-200 border-b border-black/20 rounded-t-lg h-16 flex items-center px-4 md:px-6 text-xs sm:text-sm md:text-base text-[#00000099]">
            <div className="flex-[1.2] font-semibold min-w-[120px]">User Name</div>
            <div className="flex-1 font-semibold min-w-[140px]">Client</div>
            <div className="flex-1 font-semibold min-w-[120px]">Action</div>
            <div className="flex-1 font-semibold min-w-[140px]">Environment</div>
            <div className="flex-1 font-semibold min-w-[140px]">IP Address</div>
            <div className="flex-1 text-right font-semibold min-w-[160px]">Time Stamp</div>
          </div>

          {/* Table Rows */}
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="flex items-center px-4 md:px-6 border-b border-gray-200 h-20 text-xs sm:text-sm md:text-base bg-white"
            >
              <div className="flex-[1.2] min-w-[120px]">
                <div className="font-semibold truncate">{row.userName}</div>
                <div className="text-xs text-gray-600">{row.role}</div>
              </div>
              <div className="flex-1 font-semibold min-w-[140px] truncate">{row.client}</div>
              <div
                className={`flex-1 font-semibold min-w-[120px] ${
                  row.action === 'Update' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {row.action}
              </div>
              <div className="flex-1 font-semibold min-w-[140px] truncate">{row.environment}</div>
              <div className="flex-1 font-semibold min-w-[140px] truncate">{row.ip}</div>
              <div className="flex-1 text-right min-w-[160px]">
                <div
                  className={`font-semibold ${
                    row.action === 'File Delete' ? 'text-red-500' : 'text-black'
                  }`}
                >
                  {row.date}
                </div>
                <div
                  className={`font-semibold ${
                    row.action === 'File Delete' ? 'text-red-500' : 'text-black'
                  }`}
                >
                  {row.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(AuditLogTable);
