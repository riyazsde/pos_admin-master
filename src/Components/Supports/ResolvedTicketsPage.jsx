import React from 'react';
import TicketListItem from './TicketListItem';

const ResolvedTicketsPage = ({ allTickets = [], onStatusChange }) => {
  const resolved = allTickets.filter((t) => t.status === 'Resolved');
  return (
    <div className="flex flex-col items-start py-4 w-full max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Resolved Tickets</h2>
      {resolved.length > 0 ? (
        resolved.map((ticket, index) => (
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
        <p className="text-center w-full text-gray-600 text-lg">No resolved tickets found.</p>
      )}
    </div>
  );
};

export default ResolvedTicketsPage;