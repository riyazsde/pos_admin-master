import React, { useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { useNavigate } from 'react-router-dom';

const TableRow = ({ id, businessName, planPurchased, date, transactionId, navigate }) => (
  <>
    {/* Desktop Table Row */}
    <div className="hidden lg:flex items-center w-full bg-white border-b border-gray-200 px-4 xl:px-6 py-4">
      <div className="flex-1 text-black font-poppins text-sm xl:text-base">{id}</div>
      <div className="flex-[2] text-black font-poppins text-sm xl:text-base">{businessName}</div>
      <div className="flex-[2] text-black font-poppins text-sm xl:text-base">{planPurchased}</div>
      <div className="flex-[2] text-black font-poppins text-sm xl:text-base">{date}</div>
      <div className="flex-[3] text-black font-poppins text-sm xl:text-base">{transactionId}</div>
      <div className="flex-[2] flex justify-end">
        <button
          onClick={() => navigate('/client-details')}
          className="w-full max-w-[120px] xl:max-w-[129px] h-[35px] xl:h-[38px] bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded-lg text-white font-poppins text-xs xl:text-sm font-medium"
        >
          View more
        </button>
      </div>
    </div>

    {/* Mobile/Tablet Card Layout */}
    <div className="lg:hidden bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-poppins text-sm">#</span>
          <span className="text-black font-poppins text-base font-medium">{id}</span>
        </div>
        <button
          onClick={() => navigate('/client-details')}
          className="px-4 py-2 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded-lg text-white font-poppins text-sm font-medium"
        >
          View more
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600 font-poppins text-sm">Business Name:</span>
          <span className="text-black font-poppins text-sm font-medium">{businessName}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600 font-poppins text-sm">Plan Purchased:</span>
          <span className="text-black font-poppins text-sm">{planPurchased}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600 font-poppins text-sm">Renewal Date:</span>
          <span className="text-black font-poppins text-sm">{date}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600 font-poppins text-sm">Transaction ID:</span>
          <span className="text-black font-poppins text-sm break-all">{transactionId}</span>
        </div>
      </div>
    </div>
  </>
);

const SubscriptionTable = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const data = [
    {
      id: '01',
      businessName: 'AOH Bars',
      planPurchased: '3 months Plan',
      date: 'April 03, 2025',
      transactionId: '#1234567893214687',
    },
    {
      id: '02',
      businessName: 'Chinese Restaurant',
      planPurchased: '3 months Plan',
      date: 'April 03, 2025',
      transactionId: '#1234567893214687',
    },
    {
      id: '03',
      businessName: 'Jacob Restaurant',
      planPurchased: '3 months Plan',
      date: 'April 03, 2025',
      transactionId: '#1234567893214687',
    },
    {
      id: '04',
      businessName: 'JJ Restaurant',
      planPurchased: '3 months Plan',
      date: 'April 03, 2025',
      transactionId: '#1234567893214687',
    },
    {
      id: '05',
      businessName: 'Food Court Express',
      planPurchased: '3 months Plan',
      date: 'April 03, 2025',
      transactionId: '#1234567893214687',
    },
  ];

  const filterOptions = ['Today', 'Yesterday', 'This Week', 'This Month', 'This Year'];

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold poppins-text text-black">
          Subscriptions Purchased
        </h1>
        
        <div className="relative w-full sm:w-auto">
          <button
            className="flex items-center justify-between w-full sm:w-[150px] lg:w-[150px] h-10 px-4 bg-white border border-black rounded-lg shadow-sm text-black font-poppins text-sm lg:text-base"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="truncate">{selectedPeriod}</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-full sm:w-[200px] lg:w-[246px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25),inset_0px_0px_1px_rgba(0,0,0,0.25)] rounded-lg flex flex-col items-start justify-start gap-2 lg:gap-4 px-3 py-3 lg:py-5 overflow-hidden z-10">
              {filterOptions.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                  className={`
                    flex items-center w-full h-8 px-2 py-3 lg:py-4 gap-2 lg:gap-4 
                    border-b border-black/20 
                    ${selectedPeriod === period
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded'
                      : 'text-black bg-white hover:bg-gray-100'}
                    font-[500] text-sm lg:text-[16px] leading-[24px] font-[Manrope]
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-x-auto rounded-2xl border border-gray-400">
        <div className="min-w-[1024px]">
          {/* Table Header */}
          <div className="flex items-center bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] border-b border-gray-400 px-4 xl:px-6 py-3 font-poppins text-xs xl:text-sm font-semibold text-black/60">
            <div className="flex-1">#</div>
            <div className="flex-[2]">Business Name</div>
            <div className="flex-[2]">Plan Purchased</div>
            <div className="flex-[2]">Renewal Date</div>
            <div className="flex-[3]">Transaction Id</div>
            <div className="flex-[2] text-right">Detailed Report</div>
          </div>

          {/* Table Rows */}
          {data.map((row, index) => (
            <TableRow
              key={index}
              id={row.id}
              businessName={row.businessName}
              planPurchased={row.planPurchased}
              date={row.date}
              transactionId={row.transactionId}
              navigate={navigate}
            />
          ))}
        </div>
      </div>

      {/* Mobile/Tablet Card Layout */}
      <div className="lg:hidden">
        {data.map((row, index) => (
          <TableRow
            key={index}
            id={row.id}
            businessName={row.businessName}
            planPurchased={row.planPurchased}
            date={row.date}
            transactionId={row.transactionId}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};

export default withAdminLayout(SubscriptionTable);