import React from 'react';

const renewalsData = [
  { id: '01', restaurant: 'Downtown Bistro', plan: 'Premium', date: '2026-05-05', amount: '$299' },
  { id: '02', restaurant: 'Ocean View Cafe', plan: 'Standard', date: '2026-05-05', amount: '$149' },
  { id: '03', restaurant: 'Mountain Lodge', plan: 'Enterprise', date: '2026-05-05', amount: '$599' },
  { id: '04', restaurant: 'City Square Diner', plan: 'Premium', date: '2026-05-05', amount: '$299' },
  { id: '05', restaurant: 'Ocean View Cafe', plan: 'Standard', date: '2026-05-05', amount: '$299' },
];

function UpcommingRenewals() {
  return (
    // Added h-full and flex flex-col to make the component fill the parent height
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-4 shrink-0">Upcoming Renewals</h2>
      
      {/* Added flex-grow to make the card stretch to fill remaining height */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-grow flex flex-col">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse h-full">
            <thead>
              <tr className="bg-[#FDF5F5] text-gray-600 text-sm">
                <th className="py-3 px-4 font-medium">#</th>
                <th className="py-3 px-4 font-medium">Restaurant</th>
                <th className="py-3 px-4 font-medium">Plan</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {renewalsData.map((row, index) => (
                <tr 
                  key={row.id} 
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    index === renewalsData.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-4 px-4 text-gray-500">{row.id}</td>
                  <td className="py-4 px-4 text-gray-800">{row.restaurant}</td>
                  <td className="py-4 px-4 text-green-500">{row.plan}</td>
                  <td className="py-4 px-4 text-green-500">{row.date}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium text-right">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UpcommingRenewals;