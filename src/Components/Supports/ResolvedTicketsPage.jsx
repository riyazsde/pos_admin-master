import React from 'react';
import TicketListItem from './TicketListItem';

const ResolvedTicketsPage = ({ allTickets }) => {
  const resolvedTickets = allTickets.filter(ticket => ticket.status === 'Resolved');

  return (
    <div className="flex flex-col items-start py-4 w-full max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Resolved Tickets</h2>
      {resolvedTickets.length > 0 ? (
        resolvedTickets.map((ticket, index) => (
          <TicketListItem
            key={ticket.id}
            ticketId={ticket.id}
            status={ticket.status}
            title={ticket.title}
            description={ticket.description}
            userName={ticket.userName}
            isFirst={index === 0}
          />
        ))
      ) : (
        <p className="text-center w-full text-gray-600 text-lg">No resolved tickets found.</p>
      )}
    </div>
  );
};

export default ResolvedTicketsPage;