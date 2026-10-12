import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  summary: { totalTickets: 0, activeTickets: 0, resolvedTickets: 0 },
  tickets: [],
  pagination: null,
  chart: [],
  chartFilter: '1Month',
  summaryLoading: false,
  ticketsLoading: false,
  chartLoading: false,
  updating: false,
  error: null,
  hasLoaded: false,
};

const supportTicketsSlice = createSlice({
  name: 'supportTickets',
  initialState,
  reducers: {
    setSummaryLoading: (s, a) => { s.summaryLoading = a.payload; },
    setSummaryData: (s, a) => {
      s.summary = { ...s.summary, ...(a.payload || {}) };
      s.summaryLoading = false;
    },
    setTicketsLoading: (s, a) => { s.ticketsLoading = a.payload; },
    setTicketsData: (s, a) => {
      if (Array.isArray(a.payload)) {
        s.tickets = a.payload;
        s.pagination = null;
      } else {
        s.tickets = a.payload?.data || [];
        s.pagination = a.payload?.pagination || null;
      }
      s.ticketsLoading = false;
      s.hasLoaded = true;
      s.error = null;
    },
    setChartLoading: (s, a) => { s.chartLoading = a.payload; },
    setChartData: (s, a) => {
      s.chart = a.payload?.TicketsCharcount || [];
      s.chartLoading = false;
    },
    setChartFilter: (s, a) => { s.chartFilter = a.payload; },
    setUpdating: (s, a) => { s.updating = a.payload; },

    /**
     * `status` MUST be the BACKEND value ("Open" | "Process" | "Solve"
     * | "Pending" | "Close"). The mapper handles UI conversion on read.
     */
    patchTicketStatus: (s, a) => {
      const { id, status } = a.payload;
      const ticket = s.tickets.find(
        (t) =>
          t.Support_Ticket_id === id ||
          t.support_ticket_id === id ||
          t.id === id
      );
      if (!ticket) return;
      if ('Ticket_status' in ticket) ticket.Ticket_status = status;
      else if ('status' in ticket) ticket.status = status;
      else ticket.Ticket_status = status;
    },

    setSupportTicketsError: (s, a) => {
      s.error = a.payload;
      s.summaryLoading = false;
      s.ticketsLoading = false;
      s.chartLoading = false;
      s.updating = false;
    },
    resetSupportTickets: () => initialState,
  },
});

export const {
  setSummaryLoading, setSummaryData,
  setTicketsLoading, setTicketsData,
  setChartLoading, setChartData, setChartFilter,
  setUpdating, patchTicketStatus,
  setSupportTicketsError, resetSupportTickets,
} = supportTicketsSlice.actions;

export default supportTicketsSlice.reducer;