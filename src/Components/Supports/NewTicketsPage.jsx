import React from 'react';
import TicketListItem from './TicketListItem';

const NewTicketsPage = ({ allTickets }) => {
  const newTickets = allTickets.filter(ticket => ticket.status === 'New');

  return (
    <div className="flex flex-col items-start py-4 w-full max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">New Tickets</h2>
      {newTickets.length > 0 ? (
        newTickets.map((ticket, index) => (
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
        <p className="text-center w-full text-gray-600 text-lg">No new tickets found.</p>
      )}
    </div>
  );
};

export default NewTicketsPage;