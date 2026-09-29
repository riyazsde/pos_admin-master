import React from 'react';
import { useNavigate } from 'react-router-dom';

const subscriptionData = [
  {
    id: '01',
    businessName: 'AOH Bars',
    planPurchased: '3 months Plan',
    purchasedDate: '23/09/2025',
    device: 'Printer',
  },
  {
    id: '02',
    businessName: 'AOH Bars',
    planPurchased: '6 months Plan',
    purchasedDate: '23/09/2025',
    device: 'Printer',
  },
  {
    id: '03',
    businessName: 'AOH Bars',
    planPurchased: '3 months Plan',
    purchasedDate: '23/09/2025',
    device: 'Printer',
  },
  {
    id: '04',
    businessName: 'AOH Bars',
    planPurchased: '1 Year Plan',
    purchasedDate: '23/09/2025',
    device: 'Printer',
  },
  {
    id: '05',
    businessName: 'AOH Bars',
    planPurchased: '6 months Plan',
    purchasedDate: '23/09/2025',
    device: 'Printer',
  },
  {
    id: '06',
    businessName: 'AOH Bars',
    planPurchased: '1 Year Plan',
    purchasedDate: '23/09/2025',
    device: 'Printer',
  },
  {
    id: '07',
    businessName: 'AOH Bars',
    planPurchased: '6 months Plan',
    purchasedDate: '23/09/2025',
    device: 'Printer',
  },
];

function HardwareSold() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start w-full font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-4 px-1">
        <h2 className="text-xl sm:text-2xl font-bold text-black">Hardware Sold</h2>
        <button
          onClick={() => navigate('/pos-device-history')}
          className="text-sm sm:text-base font-semibold text-black hover:underline"
        >
          See all
        </button>
      </div>

      {/* Scrollable Table Wrapper */}
      <div className="w-full overflow-x-auto rounded-2xl">
        <div className="min-w-[720px]">
          {/* Table Header */}
          <div className="flex items-center h-[51px] px-6 bg-gradient-to-b from-purple-100 to-red-100 text-[#00000099] font-semibold text-sm border-opacity-20 rounded-t-2xl">
            <span className="w-[5%] min-w-[40px]">#</span>
            <span className="w-[25%] min-w-[140px]">Business Name</span>
            <span className="w-[25%] min-w-[160px] text-center">Plan Purchased</span>
            <span className="w-[25%] min-w-[140px]">Purchased Date</span>
            <span className="w-[20%] min-w-[100px]">Device</span>
          </div>

          {/* Table Rows */}
          {subscriptionData.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center h-[53px] px-6 bg-white border-x border-b border-[#00000033] border-opacity-20 text-sm ${
                index === subscriptionData.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <span className="w-[5%] min-w-[40px]">{item.id}</span>
              <span className="w-[25%] min-w-[140px] truncate">{item.businessName}</span>
              <span className="w-[25%] min-w-[160px] text-center truncate">{item.planPurchased}</span>
              <span className="w-[25%] min-w-[140px]">{item.purchasedDate}</span>
              <span className="w-[20%] min-w-[100px] font-bold text-green-500">{item.device}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HardwareSold;
