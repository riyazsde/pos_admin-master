import React from 'react';
import { useNavigate } from 'react-router-dom';

const tickets = [
  {
    id: '01',
    business: 'Chinese Ramen',
    issue: "Message isn’t working",
    date: '23/09/2025',
  },
  {
    id: '02',
    business: 'Indiana Bar',
    issue: 'Employee performance issue...',
    date: '23/09/2025',
  },
  {
    id: '03',
    business: 'Sushi Nights',
    issue: 'Kitchen Panel issue...',
    date: '23/09/2025',
  },
  {
    id: '04',
    business: 'Chinese Ramen',
    issue: 'Kitchen Panel issue...',
    date: '23/09/2025',
  },
  {
    id: '05',
    business: 'Chinese Ramen',
    issue: 'Kitchen Panel issue...',
    date: '23/09/2025',
  },
];

const SupportTickets = () => {


    const navigate=useNavigate()

  return (
    <div className="w-full mx-auto bg-white rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Support Tickets</h2>
        <span className="text-sm text-black font-medium cursor-pointer hover:underline" onClick={()=>navigate('/supports')}>
          See all
        </span>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gradient-to-r from-[#f7edf8] to-[#f5e0e0] text-gray-700 rounded-[14px]">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Business Name</th>
              <th className="py-3 px-4">Ticket Raised</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 font-semibold">{ticket.id}</td>
                <td className="py-3 px-4">{ticket.business}</td>
                <td className="py-3 px-4 text-red-500 font-semibold truncate max-w-[180px]">
                  {ticket.issue}
                </td>
                <td className="py-3 px-4">{ticket.date}</td>
                <td className="py-3 px-4">
                  <button className="bg-gradient-to-r from-[#D63384] to-[#9D00FF] text-white px-4 py-1 rounded-md text-sm font-semibold">
                    Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportTickets;
