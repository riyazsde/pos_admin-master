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

    // ⚠️ MUST write to Ticket_status (backend string) — NOT Status (boolean)
    patchTicketStatus: (s, a) => {
      const { id, status } = a.payload;
      const t = s.tickets.find(
        (x) =>
          x.Support_Ticket_id === id ||
          x.support_ticket_id === id ||
          x.id === id
      );
      if (!t) return;
      t.Ticket_status = status;         // overwrite the field the mapper reads
      if ('Status' in t) t.Status = true;
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