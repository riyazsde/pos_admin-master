import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { toast } from 'sonner';

import withAdminLayout from '../AdminPanel/withAdminLayout';

import TicketListPage from '../../Components/Supports/TicketListPage';
import TicketSummaryCard from '../../Components/Supports/TicketSummaryCard';
import SearchBar from '../../Components/Supports/SearchBar';
import TicketStatusNav from '../../Components/Supports/TicketStatusNav';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setSummaryLoading,
  setSummaryData,
  setTicketsLoading,
  setTicketsData,
  setUpdating,
  patchTicketStatus,
  setSupportTicketsError,
} from '../../Store/Features/supportTickets/supportTicketsSlice';
import { supportTicketService } from '../../Services/apiService';
import {
  mapBackendStatus,
  mapUiStatusToBackend,
  TICKET_TABS,
} from '../../Components/Supports/ticketStatus';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const getBusinessName = (ticket) => {
  if (ticket.businessName) return ticket.businessName;
  if (ticket.email) {
    const local = String(ticket.email).split('@')[0];
    return local.replace(/[._-]/g, ' ');
  }
  const createdBy = ticket.CreatedBy;
  if (typeof createdBy === 'string') return createdBy;
  return createdBy?.Name || 'Unknown';
};

const normaliseSummary = (raw) => {
  const d = raw?.data ?? raw ?? {};
  const totalTickets =
    d.totalTickets ?? d.total ?? d.TotalTickets ?? d.total_tickets ?? 0;

  const activeFromFields =
    d.activeTickets ?? d.active ?? d.ActiveTickets ?? d.active_tickets;
  const activeComputed =
    (d.pendingTickets ?? 0) +
    (d.openTickets ?? 0) +
    (d.processTickets ?? 0);
  const activeTickets = activeFromFields ?? activeComputed;

  const resolvedFromFields =
    d.resolvedTickets ?? d.resolved ?? d.ResolvedTickets ?? d.resolved_tickets;
  const resolvedComputed = (d.solveTickets ?? 0) + (d.closeTickets ?? 0);
  const resolvedTickets = resolvedFromFields ?? resolvedComputed;

  return { totalTickets, activeTickets, resolvedTickets };
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const SupportsPage = () => {
  const [activeTab, setActiveTab] = useState('All Tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  const dispatch = useAppDispatch();
  const { summary, tickets } = useAppSelector((state) => state.supportTickets);
  const hasFetched = useRef(false);

  // -------------------------------------------------------------------------
  // Initial fetch
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      dispatch(setSummaryLoading(true));
      dispatch(setTicketsLoading(true));

      const [summaryRes, ticketsRes] = await Promise.allSettled([
        supportTicketService.getSummary(),
        supportTicketService.getTickets(1, 20),
      ]);

      if (summaryRes.status === 'fulfilled') {
        dispatch(setSummaryData(normaliseSummary(summaryRes.value)));
      } else {
        dispatch(setSummaryData(normaliseSummary(null)));
      }

      if (ticketsRes.status === 'fulfilled') {
        dispatch(setTicketsData(ticketsRes.value));
      } else {
        dispatch(setTicketsData({ data: [], pagination: null }));
        dispatch(
          setSupportTicketsError(
            ticketsRes.reason?.message || 'Failed to load tickets'
          )
        );
        toast.error('Failed to load tickets');
      }
    })();
  }, [dispatch]);

  // -------------------------------------------------------------------------
  // Map raw → UI tickets
  // -------------------------------------------------------------------------
  const mappedTickets = useMemo(() => {
    const list = Array.isArray(tickets) ? tickets : [];
    return list.map((t) => {
      const rawStatus = t.Ticket_status ?? t.Status ?? t.status;
      const dbId = t.Support_Ticket_id ?? t.support_ticket_id ?? t.id;
      return {
        id: t.TicketNumber || `TICKET${dbId}`,
        dbId,
        status: mapBackendStatus(rawStatus),
        rawStatus,
        title: t.Subject || t.question || 'No subject',
        description: t.Description || t.question || 'No description',
        userName: getBusinessName(t),
        email: t.email,
        priority: t.Priority || 'Normal',
        createdDate: t.CreatedDate || t.CreateAt,
      };
    });
  }, [tickets]);

  // -------------------------------------------------------------------------
  // Filter — search + tab + status filter
  // -------------------------------------------------------------------------
  const filteredTickets = useMemo(() => {
    const tabConfig = TICKET_TABS.find((t) => t.key === activeTab);
    const tabFilter = tabConfig?.filter ?? null;

    return mappedTickets.filter((t) => {
      if (tabFilter && t.status !== tabFilter) return false;
      if (activeTab === 'Escalated') return false;

      if (statusFilter && t.status !== statusFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.userName?.toLowerCase().includes(q) ||
          t.id?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [mappedTickets, searchQuery, statusFilter, activeTab]);

  // -------------------------------------------------------------------------
  // Status update from list card dropdown
  // -------------------------------------------------------------------------
  const handleStatusUpdate = useCallback(
    async (ticketDbId, newUiStatus) => {
      const backendStatus = mapUiStatusToBackend(newUiStatus);
      if (!backendStatus) {
        toast.error(`Unsupported status: ${newUiStatus}`);
        return;
      }

      // Capture current ticket for rollback
      const before = (tickets || []).find(
        (t) =>
          (t.Support_Ticket_id ?? t.support_ticket_id ?? t.id) === ticketDbId
      );
      const beforeBackend = before?.Ticket_status ?? before?.Status ?? null;

      // Optimistic patch — ticket will jump tabs immediately
      dispatch(
        patchTicketStatus({ id: ticketDbId, status: backendStatus })
      );

      dispatch(setUpdating(true));
      const toastId = toast.loading(`Moving to ${newUiStatus}...`);

      try {
        const res = await supportTicketService.updateTicketStatus(
          ticketDbId,
          backendStatus
        );
        const newBackend = res?.Ticket_status ?? backendStatus;

        // Confirm with authoritative value
        dispatch(patchTicketStatus({ id: ticketDbId, status: newBackend }));

        toast.success(`Moved to ${mapBackendStatus(newBackend)}`, {
          id: toastId,
          duration: 2000,
        });
      } catch (err) {
        // Rollback
        if (beforeBackend) {
          dispatch(
            patchTicketStatus({ id: ticketDbId, status: beforeBackend })
          );
        }
        console.error('Update status error:', err);
        toast.error('Failed to update status', {
          id: toastId,
          description:
            err?.response?.data?.errors?.[0]?.msg ||
            err?.response?.data?.message ||
            err?.message ||
            'Please try again.',
        });
      } finally {
        dispatch(setUpdating(false));
      }
    },
    [dispatch, tickets]
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  const tabConfig = TICKET_TABS.find((t) => t.key === activeTab);

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 py-8">
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

        <SearchBar
          onSearch={setSearchQuery}
          onFilterChange={({ status }) => {
            if (status !== undefined) setStatusFilter(status);
          }}
        />

        <TicketStatusNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="w-full">
          <TicketListPage
            allTickets={filteredTickets}
            heading={tabConfig?.heading || 'Tickets'}
            onStatusChange={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(SupportsPage);