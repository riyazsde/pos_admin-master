import React, { useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';

const subscriptionData = [
  { id: '01', businessName: 'AOH Bars', planPurchased: '3 months Plan', renewalDate: 'April 03,2025', transactionId: '#1234567893214687', device: 'Printer' },
  { id: '02', businessName: 'AOH Bars', planPurchased: '3 months Plan', renewalDate: 'April 03,2025', transactionId: '#1234567893214687', device: 'Printer' },
  { id: '03', businessName: 'AOH Bars', planPurchased: '3 months Plan', renewalDate: 'April 03,2025', transactionId: '#1234567893214687', device: 'System' },
  { id: '04', businessName: 'AOH Bars', planPurchased: '3 months Plan', renewalDate: 'April 03,2025', transactionId: '#1234567893214687', device: 'Printer' },
  { id: '05', businessName: 'AOH Bars', planPurchased: '3 months Plan', renewalDate: 'April 03,2025', transactionId: '#1234567893214687', device: 'System' },
  { id: '06', businessName: 'AOH Bars', planPurchased: '3 months Plan', renewalDate: 'April 03,2025', transactionId: '#1234567893214687', device: 'System' },
  { id: '07', businessName: 'AOH Bars', planPurchased: '3 months Plan', renewalDate: 'April 03,2025', transactionId: '#1234567893214687', device: 'System' },
];

function HardwareDeviceHistory() {
  const [selectedDevice, setSelectedDevice] = useState('All');

  const filteredData = selectedDevice === 'All'
    ? subscriptionData
    : subscriptionData.filter(item => item.device === selectedDevice);

  return (
    <div className="p-4 w-full font-poppins">
      {/* Header with dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">POS Hardware Devices History</h2>

        <div className="relative">
          <select
            className="border border-gray-300 rounded-md px-3 py-1 text-sm font-medium bg-white shadow-sm focus:outline-none cursor-pointer"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Printer">Printer</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-purple-100 text-gray-600">
            <tr className="text-left">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Business Name</th>
              <th className="px-4 py-3">Plan Purchased</th>
              <th className="px-4 py-3">Renewal Date</th>
              <th className="px-4 py-3">Transaction id</th>
              <th className="px-4 py-3">Device Purchased</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.businessName}</td>
                <td className="px-4 py-3">{item.planPurchased}</td>
                <td className="px-4 py-3">{item.renewalDate}</td>
                <td className="px-4 py-3">{item.transactionId}</td>
                <td className="px-4 py-3 font-bold text-green-600">{item.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



export default withAdminLayout(HardwareDeviceHistory);
