import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';

import withAdminLayout from '../AdminPanel/withAdminLayout';

import NewTicketsPage from '../../Components/Supports/NewTicketsPage';
import OngoingTicketsPage from '../../Components/Supports/OngoingTicketsPage';
import ResolvedTicketsPage from '../../Components/Supports/ResolvedTicketsPage';
import AllTicketsPage from '../../Components/Supports/AllTicketsPage';
import TicketSummaryCard from '../../Components/Supports/TicketSummaryCard';
import SearchBar from '../../Components/Supports/SearchBar';
import TicketStatusNav from '../../Components/Supports/TicketStatusNav';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSummaryLoading,
  setSummaryData,
  setTicketsLoading,
  setTicketsData,
  setSupportTicketsError,
} from '../../Store/Features/supportTickets/supportTicketsSlice';
import { supportTicketService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------
const BACKEND_TO_UI = {
  Pending: 'Pending',
  Open: 'New',
  Process: 'On-Going',
  Solve: 'Resolved',
  Close: 'Closed',
};

const mapBackendStatus = (raw) => {
  if (!raw) return 'New';
  if (BACKEND_TO_UI[raw]) return BACKEND_TO_UI[raw];
  const key = Object.keys(BACKEND_TO_UI).find(
    (k) => k.toLowerCase() === String(raw).toLowerCase()
  );
  return key ? BACKEND_TO_UI[key] : 'New';
};

const getBusinessName = (ticket) => {
  if (ticket.businessName) return ticket.businessName;
  if (ticket.email) {
    const local = ticket.email.split('@')[0];
    return local.replace(/[._-]/g, ' ');
  }
  return ticket.CreatedBy?.Name || ticket.CreatedBy || 'Unknown';
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const SupportsPage = () => {
  const [activeTab, setActiveTab] = useState('All Tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  const dispatch = useAppDispatch();

  const { summary, tickets, hasLoaded } = useAppSelector(
    (state) => state.supportTickets
  );

  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAll = async () => {
      dispatch(setSummaryLoading(true));
      try {
        const s = await supportTicketService.getSummary();
        dispatch(setSummaryData(s));
      } catch (err) {
        console.error('Summary fetch error:', err);
        dispatch(setSupportTicketsError(err?.message || 'Failed to load summary'));
      }

      dispatch(setTicketsLoading(true));
      try {
        const result = await supportTicketService.getTickets(1, 20);
        dispatch(setTicketsData(result));
      } catch (err) {
        console.error('Tickets fetch error:', err);
        dispatch(setSupportTicketsError(err?.message || 'Failed to load tickets'));
        toast.error('Failed to load tickets', {
          description: err?.message || 'Please try again later.',
        });
      }
    };

    fetchAll();
  }, [dispatch]);

  const mappedTickets = useMemo(
    () =>
      (tickets || []).map((t) => {
        const rawStatus = t.Ticket_status || t.Status;
        return {
          id: t.TicketNumber || `TICKET${t.Support_Ticket_id}`,
          dbId: t.Support_Ticket_id,
          status: mapBackendStatus(rawStatus),
          title: t.Subject || t.question || 'No subject',
          description: t.Description || t.question || 'No description',
          userName: getBusinessName(t),
          email: t.email,
          priority: t.Priority,
          createdDate: t.CreatedDate || t.CreateAt,
        };
      }),
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    return mappedTickets.filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.userName?.toLowerCase().includes(q) ||
          t.id?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (statusFilter && t.status !== statusFilter) return false;
      return true;
    });
  }, [mappedTickets, searchQuery, statusFilter]);

  const renderTicketSection = () => {
    switch (activeTab) {
      case 'New':
        return <NewTicketsPage allTickets={filteredTickets} />;
      case 'On-Going':
        return <OngoingTicketsPage allTickets={filteredTickets} />;
      case 'Resolved':
        return <ResolvedTicketsPage allTickets={filteredTickets} />;
      case 'Escalated':
        return <AllTicketsPage allTickets={[]} />; // no escalated API yet
      case 'All Tickets':
      default:
        return <AllTicketsPage allTickets={filteredTickets} />;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Supports &amp; Tickets
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage and respond to client support tickets
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-8 w-full">
        {/* Summary Cards */}
        {activeTab === 'All Tickets' && (
          <div className="w-full flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            <TicketSummaryCard
              title="Total Tickets"
              count={String(summary?.totalTickets ?? 0)}
              iconBgColor="bg-yellow-200"
              textColor="text-black"
              iconType="money"
            />
            <TicketSummaryCard
              title="Total Active Tickets"
              count={String(summary?.activeTickets ?? 0)}
              iconBgColor="bg-pink-200"
              textColor="text-red-500"
              iconType="bill"
            />
            <TicketSummaryCard
              title="Total Resolved Tickets"
              count={String(summary?.resolvedTickets ?? 0)}
              iconBgColor="bg-green-200"
              textColor="text-green-500"
              iconType="global"
            />
          </div>
        )}

        {/* Search Bar */}
        <SearchBar
          onSearch={setSearchQuery}
          onFilterChange={({ status }) => {
            if (status !== undefined) setStatusFilter(status);
          }}
        />

        {/* Tabs */}
        <TicketStatusNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="w-full">{renderTicketSection()}</div>
      </div>
    </div>
  );
};

export default withAdminLayout(SupportsPage);