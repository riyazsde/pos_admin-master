import React from 'react';

const transactionData = [
  {
    id: '01',
    companyName: 'AOH Bars',
    totalSales: '#123456789321467',
    renewalDate: 'March 01, 2025',
  },
  {
    id: '01',
    companyName: 'Chinese Restaurant',
    totalSales: '#123456789321467',
    renewalDate: 'March 01, 2025',
  },
  {
    id: '01',
    companyName: 'AOH Bars',
    totalSales: '#123456789321467',
    renewalDate: 'March 01, 2025',
  },
  {
    id: '01',
    companyName: 'Chinese Restaurant',
    totalSales: '#123456789321467',
    renewalDate: 'March 01, 2025',
  },
  {
    id: '01',
    companyName: 'AOH Bars',
    totalSales: '#123456789321467',
    renewalDate: 'March 01, 2025',
  },
];

function LatestTransactionsTable() {
  return (
    <div className="flex flex-col items-start gap-4 w-full font-poppins px-2 sm:px-0">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-bold text-black">Latest Transactions</h2>
        <span className="text-sm font-semibold text-black cursor-pointer">See all</span>
      </div>

      {/* Scrollable Table Container */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-300">
        <div className="min-w-[768px]">
          {/* Table Header */}
          <div className="flex items-center h-[51px] px-6 bg-gradient-to-b from-purple-100 to-red-100 border-b border-gray-300 rounded-t-2xl">
            <span className="w-[5%] text-base font-semibold text-black/60">#</span>
            <span className="w-[30%] text-base font-semibold text-black/60">Company Name</span>
            <span className="w-[35%] text-base font-semibold text-black/60">Total Sales</span>
            <span className="w-[30%] text-base font-semibold text-black/60">Renewal Date</span>
          </div>

          {/* Table Rows */}
          {transactionData.map((item, index) => (
            <div
              key={index}
              className={`flex items-center h-[53px] px-6 bg-white border-b border-gray-200 ${
                index === transactionData.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <span className="w-[5%] text-base text-black">{item.id}</span>
              <span className="w-[30%] text-base text-black">{item.companyName}</span>
              <span className="w-[35%] text-base text-black">{item.totalSales}</span>
              <span className="w-[30%] text-base text-black">{item.renewalDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LatestTransactionsTable;
