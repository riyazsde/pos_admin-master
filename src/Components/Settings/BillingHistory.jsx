import React, { useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { useNavigate } from 'react-router-dom';
import arrow from '../../assets/Images/Home/arrow.png';

const TableRow = ({ id, businessName, planPurchased, date, transactionId, navigate }) => (
  <div className="flex items-center w-full bg-white border-b border-gray-200 px-6 py-4 text-sm min-w-[700px]">
    <div className="flex-1 min-w-0 text-black font-poppins">{id}</div>
    <div className="flex-[2] min-w-0 text-black font-poppins">{businessName}</div>
    <div className="flex-[2] min-w-0 text-black font-poppins">{planPurchased}</div>
    <div className="flex-[2] min-w-0 text-black font-poppins">{date}</div>
    <div className="flex-[3] min-w-0 text-black font-poppins break-words">{transactionId}</div>
    <div className="flex-[2] flex justify-end">
      <button
        onClick={() => navigate('/client-details')}
        className="w-full max-w-[129px] h-[38px] bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded-lg text-white font-poppins text-sm font-medium"
      >
        View more
      </button>
    </div>
  </div>
);

const BillingHistory = () => {
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
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl md:text-[32px] font-bold text-gray-800 flex items-center gap-2">
          <span className="text-gray-400 flex items-center gap-2">
            Account Settings
            <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
          </span>
          <span>Billing History</span>
        </h1>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            className="flex items-center justify-between w-[150px] h-10 px-4 bg-white border border-black rounded-lg shadow-sm text-black font-poppins text-base"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedPeriod}
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[246px] bg-white shadow-lg rounded-lg px-3 py-5 z-10">
              {filterOptions.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                  className={`
                    w-full text-left py-2 px-2 mb-1 rounded 
                    ${selectedPeriod === period
                      ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white'
                      : 'hover:bg-gray-100 text-black'}
                    font-medium text-sm
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table (Visible on all screens) */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-400">
        <div className="min-w-[700px]">
          <div className="flex items-center bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] border-b border-gray-400 px-6 py-3 font-poppins text-sm font-semibold text-black/60">
            <div className="flex-1 min-w-0">#</div>
            <div className="flex-[2] min-w-0">Business Name</div>
            <div className="flex-[2] min-w-0">Plan Purchased</div>
            <div className="flex-[2] min-w-0">Renewal Date</div>
            <div className="flex-[3] min-w-0">Transaction Id</div>
            <div className="flex-[2] text-right min-w-0">Detailed Report</div>
          </div>
          {data.map((row, index) => (
            <TableRow key={index} {...row} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(BillingHistory);
