import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionsPurchased = () => {
  const subscriptionData = [
    { id: '01', business: 'AOH Bars', plan: '3 months Plan', date: '23/09/2025', amount: '460 XOF' },
    { id: '02', business: 'AOH Bars', plan: '6 months Plan', date: '23/09/2025', amount: '840 XOF' },
    { id: '03', business: 'AOH Bars', plan: '3 months Plan', date: '23/09/2025', amount: '460 XOF' },
    { id: '04', business: 'AOH Bars', plan: '1 Year Plan', date: '23/09/2025', amount: '1060 XOF' },
    { id: '05', business: 'AOH Bars', plan: '6 months Plan', date: '23/09/2025', amount: '860 XOF' },
  ];

  const navigate = useNavigate();

  return (
    // Added a white card wrapper with subtle shadow and padding to match the Figma container
    <div className="flex flex-col gap-4 w-full bg-white rounded-3xl p-4 shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Active Subscriptions</h2>
        <div 
          className="text-xs font-bold text-black hover:text-blue-600 cursor-pointer transition-colors" 
          onClick={() => navigate('/subscription-list')}
        >
          See all
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px] w-full">
          {/* Table Header - Matched the exact light gray/pink background and text styling */}
          <div className="grid grid-cols-5 bg-[#F9F5F6] rounded-t-xl text-xs font-semibold text-gray-500 py-3 px-4">
            <div className="text-center">#</div>
            <div className="text-left pl-2">Business Name</div>
            <div className="text-left pl-2">Plan Purchased</div>
            <div className="text-center">Purchased Date</div>
            <div className="text-right pr-4">Amount</div>
          </div>

          {/* Table Rows - Removed heavy borders, added subtle bottom borders and exact alignments */}
          <div className="flex flex-col">
            {subscriptionData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-5 items-center border-b border-gray-100 py-3 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors last:border-b-0"
              >
                <div className="text-center font-semibold">{item.id}</div>
                <div className="text-left pl-2 font-semibold text-gray-800">{item.business}</div>
                <div className="text-left pl-2">{item.plan}</div>
                <div className="text-center">{item.date}</div>
                <div className="text-right pr-4 text-green-500 font-bold">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPurchased;