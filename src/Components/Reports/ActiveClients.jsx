import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveClients = () => {
  const clients = [
    { id: '01', businessName: 'AOH Bars', planPurchased: '3 months Plan', purchasedDate: '23/09/2025', status: 'Active' },
    { id: '02', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', status: 'Active' },
    { id: '03', businessName: 'AOH Bars', planPurchased: '3 months Plan', purchasedDate: '23/09/2025', status: 'Active' },
    { id: '04', businessName: 'AOH Bars', planPurchased: '1 Year Plan', purchasedDate: '23/09/2025', status: 'Active' },
    { id: '05', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', status: 'Active' },
    { id: '06', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', status: 'Active' },
    { id: '07', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', status: 'Active' },
  ];
  const navigate=useNavigate()

  return (
    <div className="w-full p-4">
      <div className="flex flex-col gap-4 w-full">
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="font-poppins font-bold text-2xl text-black">Active Clients</h2>
          <div className="py-2 px-4">
            <span className="font-poppins font-semibold text-sm text-black cursor-pointer" onClick={()=>navigate('/clients')}>See all</span>
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[768px]">
            {/* Table Header */}
            <div className="h-[51px] bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] text-[#00000099] 
                border border-[rgba(0,0,0,0.2)] rounded-t-2xl
                grid [grid-template-columns:auto_repeat(4,minmax(0,1fr))] items-center px-6 text-center poppins-text">
              <span className="font-poppins font-semibold text-base text-left">#</span>
              <span className="font-poppins font-semibold text-base">Business Name</span>
              <span className="font-poppins font-semibold text-base">Plan Purchased</span>
              <span className="font-poppins font-semibold text-base">Purchased Date</span>
              <span className="font-poppins font-semibold text-base">Status</span>
            </div>

            {/* Table Rows */}
            {clients.map((client, index) => (
              <div
                key={client.id}
                className={`h-[53px] bg-white border-x border-b border-[rgba(0,0,0,0.2)]
                  grid [grid-template-columns:auto_repeat(4,minmax(0,1fr))] items-center px-6 text-center
                  ${index === clients.length - 1 ? 'rounded-b-2xl' : ''}`}
              >
                <span className="font-poppins text-base text-black text-left">{client.id}</span>
                <span className="font-poppins text-base text-black">{client.businessName}</span>
                <span className="font-poppins text-base text-black">{client.planPurchased}</span>
                <span className="font-poppins text-base text-black">{client.purchasedDate}</span>
                <span className="font-poppins font-bold text-sm text-[#34C759]">{client.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveClients;
