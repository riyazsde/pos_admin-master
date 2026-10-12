import React from 'react';
import TicketListItem from './TicketListItem';

const TicketListPage = ({
  allTickets = [],
  filterStatus = null, // 'New' | 'On-Going' | 'Resolved' | 'Pending' | 'Closed' | null
  heading = 'Tickets',
  onStatusChange,
}) => {
  const visible = filterStatus
    ? allTickets.filter((t) => t.status === filterStatus)
    : allTickets;

  return (
    <div className="flex flex-col items-start py-4 w-full max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{heading}</h2>
      {visible.length > 0 ? (
        visible.map((ticket, index) => (
          <TicketListItem
            key={ticket.id}
            ticketId={ticket.id}
            status={ticket.status}
            title={ticket.title}
            description={ticket.description}
            userName={ticket.userName}
            isFirst={index === 0}
            ticketData={ticket}
            onStatusChange={onStatusChange}
          />
        ))
      ) : (
        <p className="text-center w-full text-gray-600 text-lg">
          No tickets found.
        </p>
      )}
    </div>
  );
};

export default TicketListPage;