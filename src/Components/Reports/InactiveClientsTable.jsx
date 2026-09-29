// InactiveClientsTable.js (or App.js, depending on your file structure)
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Renamed main component to InactiveClientsTable
function InactiveClientsTable() {
  // Sample data for the table rows
  const clients = [
    { id: '01', businessName: 'AOH Bars', planPurchased: '3 months Plan', purchasedDate: '23/09/2025', status: 'Inactive' },
    { id: '02', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', status: 'Inactive' },
    { id: '03', businessName: 'AOH Bars', planPurchased: '3 months Plan', purchasedDate: '23/09/2025', status: 'Inactive' },
    { id: '04', businessName: 'AOH Bars', planPurchased: '1 Year Plan', purchasedDate: '23/09/2025', status: 'Inactive' },
    { id: '05', businessName: 'AOH Bars', planPurchased: '6 months Plan', purchasedDate: '23/09/2025', status: 'Inactive' },
  ];
  const navigate=useNavigate()

  return (
    // Main container, responsive padding and width
    <div className="flex flex-col items-center  w-full font-sans">
      {/* Inner container for the entire 'Inactive Clients' section */}
      <div className="flex flex-col items-start gap-4 w-full max-w-4xl mx-auto">
        {/* Header section with title and 'See all' button */}
        <div className="flex flex-row justify-between items-center w-full">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-black poppins-font">
            Inactive Clients
          </h2>
          {/* 'See all' button/link */}
          <button className="flex items-center justify-center px-4 py-2 gap-2 h-9 sm:h-10 text-black font-semibold text-sm rounded-lg hover:bg-gray-100 transition-colors poppins-font" onClick={()=>navigate('/clients')}>
            See all
          </button>
        </div>

        {/* Table container */}
        <div className="flex flex-col justify-center items-start w-full shadow-md rounded-2xl overflow-hidden">
          {/* Table Header Row */}
          <div
            className="flex items-center w-full h-12 sm:h-14 bg-gradient-to-r from-purple-100 to-red-100
                       border border-gray-300 rounded-t-2xl text-gray-600 font-semibold text-sm sm:text-base
                       px-4 sm:px-6"
          >
            {/* Header Columns */}
            <span className="w-1/12">#</span>
            <span className="w-3/12">Business Name</span>
            <span className="w-3/12 text-center">Plan Purchased</span>
            <span className="w-3/12">Purchased Date</span>
            <span className="w-2/12 text-center">Status</span>
          </div>

          {/* Table Data Rows */}
          {clients.map((client, index) => (
            <div
              key={client.id}
              className={`flex items-center w-full h-12 sm:h-14 bg-white border-x border-b border-gray-300 text-black
                          font-normal text-sm sm:text-base px-4 sm:px-6
                          ${index === clients.length - 1 ? 'rounded-b-2xl' : ''}`} // Apply bottom radius to last row
            >
              {/* Data Columns */}
              <span className="w-1/12">{client.id}</span>
              <span className="w-3/12">{client.businessName}</span>
              <span className="w-3/12 text-center">{client.planPurchased}</span>
              <span className="w-3/12">{client.purchasedDate}</span>
              <span className="w-2/12 text-center font-bold text-red-500 poppins-font">
                {client.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InactiveClientsTable; // Export the new component name
