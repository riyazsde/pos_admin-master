import React from 'react';
import { useNavigate } from 'react-router-dom';

const subscriptionData = [
  { id: '01', businessName: 'AOH Bars', planPurchased: '3 months Plan', purchasedDate: '23/09/2025', amount: '460 XOF' },
  { id: '02', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', amount: '840 XOF' },
  { id: '03', businessName: 'AOH Bars', planPurchased: '3 months Plan', purchasedDate: '23/09/2025', amount: '460 XOF' },
  { id: '04', businessName: 'AOH Bars', planPurchased: '1 Year Plan', purchasedDate: '23/09/2025', amount: '1 060 XOF' },
  { id: '05', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', amount: '860 XOF' },
  { id: '06', businessName: 'AOH Bars', planPurchased: '1 Year Plan', purchasedDate: '23/09/2025', amount: '1 060 XOF' },
  { id: '07', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', amount: '860 XOF' },
];

function SubscriptionTable() {

    const navigate=useNavigate()

  return (
    <div className="flex flex-col items-start gap-4 w-full font-poppins px-2 sm:px-0">
      {/* Header section */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-bold text-black">Subscription Sales</h2>
        <span className="text-sm font-semibold text-black cursor-pointer" onClick={()=>navigate('/subscription-list')}>See all</span>
      </div>

      {/* Table container with scroll on small screens */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-300">
        <div className="min-w-[768px]">
          {/* Table Header */}
          <div className="flex items-center h-[51px] px-6 bg-gradient-to-b from-purple-100 to-red-100 border-b border-gray-200 rounded-t-2xl">
            <span className="w-[5%] text-base font-semibold text-black/60">#</span>
            <span className="w-[25%] text-base font-semibold text-black/60">Business Name</span>
            <span className="w-[25%] text-base font-semibold text-black/60 text-center">Plan Purchased</span>
            <span className="w-[25%] text-base font-semibold text-black/60">Purchased Date</span>
            <span className="w-[20%] text-base font-semibold text-black/60">Amount</span>
          </div>

          {/* Table Rows */}
          {subscriptionData.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center h-[53px] px-6 bg-white border-b border-gray-200 ${
                index === subscriptionData.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <span className="w-[5%] text-base text-black">{item.id}</span>
              <span className="w-[25%] text-base text-black">{item.businessName}</span>
              <span className="w-[25%] text-base text-black text-center">{item.planPurchased}</span>
              <span className="w-[25%] text-base text-black">{item.purchasedDate}</span>
              <span className="w-[20%] text-sm font-bold text-green-500">{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionTable;
