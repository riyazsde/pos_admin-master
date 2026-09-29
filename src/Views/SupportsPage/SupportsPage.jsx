import React, { useState } from 'react';
import NewTicketsPage from '../../Components/Supports/NewTicketsPage';
import OngoingTicketsPage from '../../Components/Supports/OngoingTicketsPage';
import ResolvedTicketsPage from '../../Components/Supports/ResolvedTicketsPage';
import AllTicketsPage from '../../Components/Supports/AllTicketsPage';
import TicketSummaryCard from '../../Components/Supports/TicketSummaryCard';
import SearchBar from '../../Components/Supports/SearchBar';
import TicketStatusNav from '../../Components/Supports/TicketStatusNav';
import withAdminLayout from '../AdminPanel/withAdminLayout';

const SupportsPage = () => {
  const [activeTab, setActiveTab] = useState('All Tickets');

  const allTickets = [
    { id: '2023-CS123-001', status: 'New', title: 'How to deposit money to my portal?', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...', userName: 'Chinese Cusine Restaurant' },
    { id: '2023-CS123-002', status: 'Resolved', title: 'Issue with payment gateway integration', description: 'Consectetur adipiscing elit...', userName: 'Italian Bistro' },
    { id: '2023-CS123-003', status: 'On-Going', title: 'Website login problems for users', description: 'Ut enim ad minim veniam...', userName: 'Sushi Express' },
    { id: '2023-CS123-004', status: 'New', title: 'Request for new feature implementation', description: 'Duis aute irure dolor in reprehenderit...', userName: 'Burger Joint' },
    { id: '2023-CS123-005', status: 'Resolved', title: 'Data discrepancy in reports', description: 'Excepteur sint occaecat cupidatat non proident...', userName: 'Pizza Palace' },
    { id: '2023-CS123-006', status: 'On-Going', title: 'Server performance degradation', description: 'Nemo enim ipsam voluptatem quia voluptas sit...', userName: 'Vegan Cafe' },
  ];

  const renderTicketSection = () => {
    switch (activeTab) {
      case 'New':
        return <NewTicketsPage allTickets={allTickets} />;
      case 'On-Going':
        return <OngoingTicketsPage allTickets={allTickets} />;
      case 'Resolved':
        return <ResolvedTicketsPage allTickets={allTickets} />;
      case 'All Tickets':
      default:
        return <AllTicketsPage allTickets={allTickets} />;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Supports & Tickets</h1>
        {/* You can add future dropdown or filters here */}
      </div>

      <div className="flex flex-col items-start gap-8 w-full">
        {/* Summary Cards */}
        {activeTab === 'All Tickets' && (
          <div className="w-full flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            <TicketSummaryCard
              title="Total Tickets"
              count="300"
              iconBgColor="bg-yellow-200"
              textColor="text-black"
              iconType="money"
            />
            <TicketSummaryCard
              title="Total Active Tickets"
              count="50"
              iconBgColor="bg-pink-200"
              textColor="text-red-500"
              iconType="bill"
            />
            <TicketSummaryCard
              title="Total Resolved Tickets"
              count="50"
              iconBgColor="bg-green-200"
              textColor="text-green-500"
              iconType="global"
            />
          </div>
        )}

        {/* Search Bar */}
        <SearchBar />

        {/* Navigation Tabs */}
        <TicketStatusNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Render Ticket Content */}
        <div className="w-full">{renderTicketSection()}</div>
      </div>
    </div>
  );
};

export default withAdminLayout(SupportsPage);
